import Link from "@/components/ui/link";
import { notFound, redirect } from "next/navigation";

import { ClearBag, PayPanel } from "@/components/account/PayPanel";
import { formatPrice } from "@/lib/currency";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Order" };

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ placed?: string }>;
}) {
  const { id } = await params;
  const { placed } = await searchParams;
  const supabase = await createClient();
  if (!supabase) notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?redirect=/orders/${id}`);

  const { data: order } = await supabase
    .from("orders")
    .select("id, number, status, total, phone, recipient_name, address_line, city, payment_state, failure_reason")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!order) notFound();

  const { data: lines } = await supabase
    .from("order_lines")
    .select("id, name, size, quantity, unit_price")
    .eq("order_id", order.id);

  return (
    <section className="flex flex-col gap-8 py-10">
      <ClearBag placed={placed === "1"} />
      <div>
        <p className="text-sm text-muted">Order</p>
        <h1 className="font-display text-[72px] leading-none">{order.number}</h1>
      </div>
      <p className="max-w-xl text-sm text-muted">
        {order.recipient_name}, {order.address_line}, {order.city}. Mobile money {order.phone}.
      </p>
      <ul className="divide-y divide-line border-y border-line">
        {(lines ?? []).map((line) => (
          <li key={line.id} className="flex items-baseline justify-between gap-4 py-3">
            <span>
              {line.name} <span className="text-muted">· {line.size} · Qty {line.quantity}</span>
            </span>
            <span className="tabular-nums">{formatPrice(Number(line.unit_price) * line.quantity)}</span>
          </li>
        ))}
      </ul>
      <p className="font-display-75 text-[40px] leading-none">{formatPrice(Number(order.total))}</p>
      <PayPanel
        orderId={order.id}
        number={order.number}
        status={order.status}
        paymentState={order.payment_state}
        failureReason={order.failure_reason}
      />
      <Link href="/orders" className="w-fit text-sm underline underline-offset-[3px]">
        All orders
      </Link>
    </section>
  );
}
