import { timingSafeEqual } from "node:crypto";

import { notifyPaidOrder } from "@/lib/notify";
import { createServiceClient } from "@/lib/supabase/service";

type Callback = {
  status?: number;
  code?: string;
  message?: string;
  data?: {
    txstatus?: number;
    externalref?: string;
    secret?: string;
    reason?: string;
    amount?: string;
  };
};

function sameSecret(given: string, expected: string) {
  const left = Buffer.from(given);
  const right = Buffer.from(expected);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

/** Moolre posts P01 or P02 here. Stock moves only on the first confirmed success. */
export async function POST(request: Request) {
  const expected = process.env.MOOLRE_WEBHOOK_SECRET;
  const service = createServiceClient();
  if (!expected || !service) {
    return Response.json({ ok: false, message: "Payment webhook is not configured." }, { status: 500 });
  }

  const payload = (await request.json().catch(() => null)) as Callback | null;
  const data = payload?.data;
  if (!payload || !data?.externalref || !data.secret) {
    return Response.json({ ok: false }, { status: 400 });
  }
  if (!sameSecret(data.secret, expected)) {
    return Response.json({ ok: false }, { status: 401 });
  }

  const { data: order } = await service
    .from("orders")
    .select("id, number, email, phone, total, status")
    .eq("payment_ref", data.externalref)
    .maybeSingle();

  if (!order) {
    await service.from("notify_log").insert({
      channel: "webhook",
      ok: false,
      detail: `No order for ${data.externalref}`,
    });
    return Response.json({ ok: true });
  }

  const success = payload.status === 1 && payload.code === "P01" && data.txstatus === 1;
  const failure = payload.status === 0 && payload.code === "P02" && data.txstatus === 2;

  if (success) {
    const paid = Number(data.amount);
    const due = Number(order.total);
    if (Number.isFinite(paid) && Math.abs(paid - due) > 0.01) {
      await service.from("notify_log").insert({
        order_id: order.id,
        channel: "webhook",
        ok: false,
        detail: `Amount ${data.amount} did not match ${due}`,
      });
      return Response.json({ ok: false }, { status: 409 });
    }

    const { data: changed, error } = await service.rpc("apply_paid_order", { target: order.id });
    if (error) {
      console.error(error.message);
      return Response.json({ ok: false }, { status: 500 });
    }
    if (changed) {
      const { data: lines } = await service
        .from("order_lines")
        .select("name, size, quantity, unit_price")
        .eq("order_id", order.id);
      try {
        await notifyPaidOrder(order, lines ?? []);
      } catch (notifyError) {
        console.error(notifyError);
      }
    }
    return Response.json({ ok: true });
  }

  if (failure) {
    await service.rpc("mark_order_failed", {
      target: order.id,
      reason: data.reason || payload.message || "Payment failed",
    });
    return Response.json({ ok: true });
  }

  await service.from("notify_log").insert({
    order_id: order.id,
    channel: "webhook",
    ok: false,
    detail: `Ignored ${payload.code ?? "callback"}`,
  });
  return Response.json({ ok: true });
}
