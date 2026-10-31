import { redirect } from "next/navigation";

import { CheckoutForm } from "@/components/account/CheckoutForm";
import { loadCatalog } from "@/lib/catalog";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const supabase = await createClient();
  let phone = "";
  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/login?redirect=/checkout");
    const { data: profile } = await supabase.from("profiles").select("phone").eq("id", user.id).maybeSingle();
    phone = profile?.phone ?? "";
  }
  const catalog = await loadCatalog();

  return (
    <section className="flex flex-col gap-8 py-10">
      <h1 className="font-display text-[72px] leading-none">Checkout</h1>
      <CheckoutForm catalog={catalog} configured={Boolean(supabase)} phone={phone} />
    </section>
  );
}
