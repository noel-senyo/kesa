"use client";

import { bagSnapshot, isBagQuiet, onBagChange } from "@/lib/bag";
import { createBrowserSupabase } from "@/lib/supabase/browser";

let watching = false;

/** Keeps the signed-in cart table in step with the browser cart. */
export function watchBag() {
  if (watching || typeof window === "undefined") return;
  watching = true;
  onBagChange(() => {
    if (!isBagQuiet()) void pushBag();
  });
}

export async function reconcileBag() {
  const supabase = createBrowserSupabase();
  if (!supabase) return;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const local = bagSnapshot();
  if (local.length === 0) {
    const { data } = await supabase.from("cart_items").select("product_id, size, quantity").eq("user_id", user.id);
    if (data?.length) {
      const { replaceBag } = await import("@/lib/bag");
      replaceBag(data.map((row) => ({ productId: row.product_id, size: row.size, quantity: row.quantity })));
    }
    return;
  }
  await pushBag();
}

async function pushBag() {
  const supabase = createBrowserSupabase();
  if (!supabase) return;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const local = bagSnapshot();
  if (local.length === 0) {
    await supabase.from("cart_items").delete().eq("user_id", user.id);
    return;
  }

  await supabase.from("cart_items").upsert(
    local.map((line) => ({
      user_id: user.id,
      product_id: line.productId,
      size: line.size,
      quantity: line.quantity,
    })),
  );

  const { data } = await supabase.from("cart_items").select("product_id, size").eq("user_id", user.id);
  const keys = new Set(local.map((line) => `${line.productId}:${line.size}`));
  for (const row of data ?? []) {
    if (!keys.has(`${row.product_id}:${row.size}`)) {
      await supabase.from("cart_items").delete().eq("user_id", user.id).eq("product_id", row.product_id).eq("size", row.size);
    }
  }
}
