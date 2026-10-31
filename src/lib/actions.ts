"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { loadProduct, loadAllProducts } from "@/lib/catalog";
import { startMoolrePayment } from "@/lib/payments/moolre";
import { normalizeGhanaPhone } from "@/lib/phone";
import { sizesFor, type Product } from "@/data/products";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export type ActionState = { error?: string; needsOtp?: boolean; message?: string };

async function currentUser() {
  const supabase = await createClient();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("profiles").select("role, full_name, email, phone").eq("id", user.id).maybeSingle();
  return { supabase, user, profile };
}

export async function requireAdmin() {
  const session = await currentUser();
  if (!session || session.profile?.role !== "admin") return null;
  return session;
}

function slug(value: string) {
  const id = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return id.slice(0, 48);
}

export async function saveProduct(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const admin = await requireAdmin();
  if (!admin) return { error: "Sign in with an admin account." };

  const name = String(formData.get("name") ?? "").trim();
  const id = slug(String(formData.get("id") ?? "")) || slug(name);
  const department = String(formData.get("department") ?? "") as Product["department"];
  const category = String(formData.get("category") ?? "").trim();
  const image = String(formData.get("image") ?? "").trim();
  const hoverImage = String(formData.get("hoverImage") ?? "").trim() || image;
  const price = Number(formData.get("price"));
  const color = String(formData.get("color") ?? "").trim();

  if (!id || !name || !category || !image) return { error: "Name, category, and a photo path are required." };
  if (!["sneakers", "clothing", "accessories"].includes(department)) return { error: "Choose a department." };
  if (!Number.isFinite(price) || price < 0) return { error: "Enter a price in cedis." };

  const draft: Product = { id, name, price, department, category, image, hoverImage };
  const { error } = await admin.supabase.from("products").upsert({
    id,
    name,
    price,
    department,
    category,
    image,
    hover_image: hoverImage,
    color: color || null,
    featured: formData.get("featured") === "on",
    hidden: formData.get("hidden") === "on",
  });
  if (error) return { error: error.message };

  const stock = sizesFor(draft).map((size) => ({
    product_id: id,
    size,
    quantity: Math.max(0, Math.floor(Number(formData.get(`stock-${size}`) ?? 0))),
  }));
  const { error: stockError } = await admin.supabase.from("stock").upsert(stock);
  if (stockError) return { error: stockError.message };

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/product/${id}`);
  redirect("/admin");
}

export async function placeOrder(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await currentUser();
  if (!session) return { error: "Sign in before placing an order." };

  let posted: { productId?: string; size?: string; quantity?: number }[] = [];
  try {
    posted = JSON.parse(String(formData.get("lines") ?? "[]"));
  } catch {
    return { error: "The cart could not be read." };
  }
  if (!Array.isArray(posted) || posted.length === 0) return { error: "The cart is empty." };

  const recipient = String(formData.get("recipient") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const phone = normalizeGhanaPhone(String(formData.get("phone") ?? ""));
  if (!recipient || !address || !city || !phone) {
    return { error: "Add a name, address, city, and a Ghana mobile-money number." };
  }

  const lines = [];
  let total = 0;
  for (const line of posted) {
    const product = await loadProduct(String(line.productId ?? ""));
    const quantity = Math.floor(Number(line.quantity));
    if (!product || !line.size || quantity < 1) return { error: "A piece in the cart is no longer available." };
    const onHand = product.stock?.[line.size] ?? 0;
    if (onHand < quantity) return { error: `${product.name} in size ${line.size} does not have enough stock.` };
    lines.push({
      product_id: product.id,
      name: product.name,
      size: line.size,
      quantity,
      unit_price: product.price,
    });
    total += product.price * quantity;
  }

  const { data: order, error } = await session.supabase
    .from("orders")
    .insert({
      user_id: session.user.id,
      status: "unpaid",
      total,
      email: session.user.email,
      recipient_name: recipient,
      address_line: address,
      city,
      phone,
    })
    .select("id, number")
    .single();
  if (error || !order) return { error: error?.message ?? "Could not save the order." };

  const { error: lineError } = await session.supabase.from("order_lines").insert(
    lines.map((line) => ({ ...line, order_id: order.id })),
  );
  if (lineError) {
    const service = createServiceClient();
    if (service) await service.from("orders").delete().eq("id", order.id);
    return { error: lineError.message };
  }

  await session.supabase.from("cart_items").delete().eq("user_id", session.user.id);
  redirect(`/orders/${order.id}?placed=1`);
}

export async function payOrder(orderId: string, otp?: string): Promise<ActionState> {
  const session = await currentUser();
  if (!session) return { error: "Sign in to pay." };

  const { data: order } = await session.supabase
    .from("orders")
    .select("id, number, status, total, phone, payment_ref, payment_state")
    .eq("id", orderId)
    .eq("user_id", session.user.id)
    .maybeSingle();
  if (!order) return { error: "That order is not on this account." };
  if (order.status === "paid") return { message: "This order is already paid." };
  if (order.payment_state === "prompt" && order.status === "unpaid" && !otp) {
    return { message: "Approve the prompt on the phone." };
  }

  const service = createServiceClient();
  if (!service) return { error: "Add SUPABASE_SERVICE_ROLE_KEY so the payment can be recorded." };

  const externalref = order.payment_state === "otp" && order.payment_ref ? order.payment_ref : `${order.id}-${Date.now()}`;

  const result = await startMoolrePayment({
    externalref,
    phone: order.phone,
    amount: Number(order.total),
    reference: order.number,
    otp,
  });

  await service
    .from("orders")
    .update({
      payment_ref: result.externalref ?? externalref,
      payment_state: result.needsOtp ? "otp" : result.ok ? "prompt" : null,
      status: order.status === "failed" && (result.ok || result.needsOtp) ? "unpaid" : order.status,
    })
    .eq("id", order.id);

  revalidatePath(`/orders/${order.id}`);
  if (result.needsOtp) return { needsOtp: true, message: result.message };
  if (!result.ok) return { error: result.message };
  return { message: result.message };
}

export async function listAdminProducts() {
  const admin = await requireAdmin();
  if (!admin) return [];
  return loadAllProducts();
}
