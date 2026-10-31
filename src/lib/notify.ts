import { site } from "@/data/site";
import { formatPrice } from "@/lib/currency";
import { toE164 } from "@/lib/phone";
import { createServiceClient } from "@/lib/supabase/service";

type Line = {
  name: string;
  size: string;
  quantity: number;
  unit_price: number | string;
};

type PaidOrder = {
  id: string;
  number: string;
  email: string | null;
  phone: string;
  total: number | string;
};

async function logNotify(orderId: string, channel: string, ok: boolean, detail: string) {
  const supabase = createServiceClient();
  if (!supabase) {
    console.error(`[${channel}] ${detail}`);
    return;
  }
  const { error } = await supabase.from("notify_log").insert({ order_id: orderId, channel, ok, detail });
  if (error) console.error("Could not write notify log", error.message);
  if (!ok) console.error(`[${channel}] ${detail}`);
}

/** Email and SMS after a newly paid order. A failure here does not change the payment. */
export async function notifyPaidOrder(order: PaidOrder, lines: Line[]) {
  const supabase = createServiceClient();
  const list = lines
    .map((line) => `${line.quantity} × ${line.name} (${line.size}) — ${formatPrice(Number(line.unit_price) * line.quantity)}`)
    .join("\n");
  const text = `Your ${site.name} order ${order.number} is confirmed.\n${list}\nTotal ${formatPrice(Number(order.total))}`;

  const emailSent = await sendEmail(order, text);
  const smsSent = await sendSms(
    order,
    `Your ${site.name} order ${order.number} is confirmed. Total ${formatPrice(Number(order.total))}.`,
  );

  if (supabase) {
    await supabase.from("orders").update({ email_sent: emailSent, sms_sent: smsSent }).eq("id", order.id);
  }
}

async function sendEmail(order: PaidOrder, text: string) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  if (!key || !from || !order.email) {
    await logNotify(order.id, "email", false, "Skipped. Add RESEND_API_KEY, RESEND_FROM, and an order email.");
    return false;
  }

  const html = text
    .split("\n")
    .map((line) => `<p>${line.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</p>`)
    .join("");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: order.email,
        subject: `Order ${order.number} is confirmed`,
        html,
      }),
    });
    const body = await response.text();
    await logNotify(order.id, "email", response.ok, body.slice(0, 500));
    return response.ok;
  } catch (error) {
    await logNotify(order.id, "email", false, error instanceof Error ? error.message : "Email failed");
    return false;
  }
}

async function sendSms(order: PaidOrder, message: string) {
  const key = process.env.TAYSEND_API_KEY;
  const sender = process.env.TAYSEND_SENDER_ID;
  if (!key || !sender) {
    await logNotify(order.id, "sms", false, "Skipped. Add TAYSEND_API_KEY and TAYSEND_SENDER_ID.");
    return false;
  }

  const local = normalizePhone(order.phone);
  if (!local) {
    await logNotify(order.id, "sms", false, "The order phone is not a Ghana number.");
    return false;
  }

  try {
    const response = await fetch("https://api.taysend.com/v1/messages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `order-${order.id}`,
      },
      body: JSON.stringify({
        to: toE164(local),
        sender_id: sender,
        message,
        type: "transactional",
      }),
    });
    const body = await response.text();
    await logNotify(order.id, "sms", response.ok, body.slice(0, 500));
    return response.ok;
  } catch (error) {
    await logNotify(order.id, "sms", false, error instanceof Error ? error.message : "SMS failed");
    return false;
  }
}

function normalizePhone(phone: string) {
  const digits = phone.replace(/[^\d]/g, "");
  if (digits.startsWith("233") && digits.length === 12) return `0${digits.slice(3)}`;
  if (/^0\d{9}$/.test(digits)) return digits;
  return null;
}
