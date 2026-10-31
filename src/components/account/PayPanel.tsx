"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { replaceBag } from "@/lib/bag";
import { payOrder } from "@/lib/actions";
import { buttonClass } from "@/components/ui/button-classes";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function PayPanel({
  orderId,
  number,
  status,
  paymentState,
  failureReason,
}: {
  orderId: string;
  number: string;
  status: string;
  paymentState: string | null;
  failureReason: string | null;
}) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [needsOtp, setNeedsOtp] = useState(paymentState === "otp");
  const [otp, setOtp] = useState("");
  const [pending, setPending] = useState(false);
  const [watching, setWatching] = useState(paymentState === "prompt" || paymentState === "otp");

  useEffect(() => {
    if (!watching || status === "paid" || status === "failed") return;
    const timer = window.setInterval(async () => {
      const response = await fetch(`/api/orders/${orderId}/status`);
      if (!response.ok) return;
      const body = (await response.json()) as { status?: string; number?: string };
      if (body.status === "paid" || body.status === "failed") {
        router.push(`/cart?result=${body.status}&order=${encodeURIComponent(body.number ?? number)}`);
      }
    }, 3000);
    return () => window.clearInterval(timer);
  }, [watching, status, orderId, number, router]);

  async function onPay(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const result = await payOrder(orderId, needsOtp ? otp : undefined);
    setPending(false);
    if (result.needsOtp) {
      setNeedsOtp(true);
      setWatching(true);
      setMessage(result.message ?? "Enter the code from your phone.");
      return;
    }
    if (result.error) {
      setError(result.error);
      return;
    }
    setWatching(true);
    setMessage(result.message ?? "Approve the prompt on the phone.");
  }

  if (status === "paid") {
    return <p className="text-sm">This order is paid. Stock for each size has been reduced.</p>;
  }

  return (
    <form onSubmit={onPay} className="flex max-w-md flex-col gap-3">
      {status === "failed" ? (
        <p role="alert" className="text-sm text-err-fg">
          Payment failed{failureReason ? `: ${failureReason}` : ""}. You can try again. Stock has not changed.
        </p>
      ) : (
        <p className="text-sm text-muted">Payment is mobile money. Stock stays put until Moolre confirms it.</p>
      )}
      {message ? <p className="text-sm">{message}</p> : null}
      {error ? (
        <p role="alert" className="text-sm text-err-fg">
          {error}
        </p>
      ) : null}
      {needsOtp ? (
        <label className="grid gap-1.5 text-sm font-medium">
          Code from Moolre
          <Input value={otp} onChange={(event) => setOtp(event.target.value)} inputMode="numeric" required />
        </label>
      ) : null}
      <button type="submit" disabled={pending} className={buttonClass()}>
        {pending ? "Contacting Moolre" : status === "failed" ? "Try payment again" : "Pay with mobile money"}
      </button>
    </form>
  );
}

/** Empties the browser cart after an order has been saved. */
export function ClearBag({ placed }: { placed: boolean }) {
  useEffect(() => {
    if (placed) replaceBag([]);
  }, [placed]);
  return null;
}
