import Link from "@/components/ui/link";
import { redirect } from "next/navigation";

import { formatPrice } from "@/lib/currency";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "My orders" };

export default async function OrdersPage() {
  const supabase = await createClient();
  if (!supabase) {
    return (
      <section className="py-16">
        <h1 className="font-display text-[72px] leading-none">My orders</h1>
        <p className="mt-4 text-muted">Orders appear here once Supabase is connected.</p>
      </section>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/orders");

  const { data: orders } = await supabase
    .from("orders")
    .select("id, number, status, total, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <section className="flex flex-col gap-6 py-10">
      <h1 className="font-display text-[72px] leading-none">My orders</h1>
      {orders?.length ? (
        <ul className="divide-y divide-line border-y border-line">
          {orders.map((order) => (
            <li key={order.id} className="flex flex-wrap items-baseline justify-between gap-3 py-4">
              <Link href={`/orders/${order.id}`} className="font-medium underline underline-offset-[3px]">
                {order.number}
              </Link>
              <span className="text-sm capitalize text-muted">{order.status}</span>
              <span className="tabular-nums">{formatPrice(Number(order.total))}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted">You have not placed an order yet.</p>
      )}
    </section>
  );
}
