import { momoChannel, normalizeGhanaPhone } from "@/lib/phone";

export type PaymentStart = {
  ok: boolean;
  needsOtp?: boolean;
  message: string;
  externalref?: string;
};

type MoolreBody = {
  status?: number;
  code?: string;
  message?: string;
};

function baseUrl() {
  return (process.env.MOOLRE_BASE_URL || "https://sandbox.moolre.com").replace(/\/$/, "");
}

/**
 * Ask Moolre to prompt the payer's phone.
 * Sandbox is the default host. Set MOOLRE_BASE_URL to https://api.moolre.com for live keys.
 */
export async function startMoolrePayment(input: {
  externalref: string;
  phone: string;
  amount: number;
  reference: string;
  otp?: string;
}): Promise<PaymentStart> {
  const user = process.env.MOOLRE_API_USER;
  const pubkey = process.env.MOOLRE_PUBLIC_KEY;
  if (!user || !pubkey) {
    return { ok: false, message: "Add the Moolre sandbox user and public key before taking payment." };
  }

  const payer = normalizeGhanaPhone(input.phone);
  const channel = payer ? momoChannel(payer) : null;
  if (!payer || !channel) {
    return { ok: false, message: "Enter a Ghana MTN, Telecel, or AT number." };
  }

  const payload: Record<string, string | number> = {
    type: 1,
    channel,
    currency: "GHS",
    payer,
    amount: input.amount.toFixed(2),
    externalref: input.externalref,
    reference: input.reference,
  };
  if (input.otp) payload.otpcode = input.otp;

  let response: Response;
  try {
    response = await fetch(`${baseUrl()}/open/transact/payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-USER": user,
        "X-API-PUBKEY": pubkey,
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Could not reach Moolre." };
  }

  const body = (await response.json().catch(() => ({}))) as MoolreBody;
  const code = String(body.code ?? "");
  const message = body.message || "Moolre did not start the payment.";
  const blob = `${code} ${message}`.toLowerCase();

  if (blob.includes("otp") && blob.includes("invalid")) {
    return { ok: false, needsOtp: true, message, externalref: input.externalref };
  }
  if (blob.includes("otp") && (blob.includes("required") || blob.includes("sent"))) {
    return { ok: false, needsOtp: true, message: "Enter the code Moolre sent to the phone.", externalref: input.externalref };
  }
  if (blob.includes("otp") && blob.includes("verified")) {
    return startMoolrePayment({ ...input, otp: undefined });
  }
  if (response.ok && (body.status === 1 || blob.includes("request") || blob.includes("prompt") || blob.includes("success"))) {
    return { ok: true, message: "Approve the prompt on the phone.", externalref: input.externalref };
  }
  return { ok: false, message };
}
