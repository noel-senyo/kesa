"use client";

import { useActionState } from "react";

import { placeOrder, type ActionState } from "@/lib/actions";
import { useBag } from "@/lib/bag";
import { formatPrice } from "@/lib/currency";
import { buttonClass } from "@/components/ui/button-classes";
import { Input } from "@/components/ui/input";
import type { Product } from "@/data/products";

const empty: ActionState = {};

export function CheckoutForm({
  catalog,
  configured,
  phone,
}: {
  catalog: Product[];
  configured: boolean;
  phone: string;
}) {
  const lines = useBag();
  const [state, action, pending] = useActionState(placeOrder, empty);
  const filled = lines
    .map((line) => ({ line, product: catalog.find((product) => product.id === line.productId) }))
    .filter((entry): entry is { line: (typeof lines)[number]; product: Product } => Boolean(entry.product));
  const total = filled.reduce((sum, entry) => sum + entry.product.price * entry.line.quantity, 0);

  if (!configured) {
    return <p className="text-muted">Orders are saved once Supabase is connected.</p>;
  }
  if (filled.length === 0) {
    return <p className="text-muted">The cart is empty.</p>;
  }

  return (
    <form action={action} className="grid max-w-xl gap-4">
      {state.error ? (
        <p role="alert" className="rounded-field bg-err-bg px-3.5 py-3 text-sm text-err-fg">
          {state.error}
        </p>
      ) : null}
      <input type="hidden" name="lines" value={JSON.stringify(filled.map(({ line }) => line))} />
      <label className="grid gap-1.5 text-sm font-medium">
        Name
        <Input name="recipient" required autoComplete="name" />
      </label>
      <label className="grid gap-1.5 text-sm font-medium">
        Address
        <Input name="address" required autoComplete="street-address" />
      </label>
      <label className="grid gap-1.5 text-sm font-medium">
        City
        <Input name="city" required autoComplete="address-level2" />
      </label>
      <label className="grid gap-1.5 text-sm font-medium">
        Mobile money number
        <Input name="phone" required defaultValue={phone} autoComplete="tel" placeholder="0240000000" />
      </label>
      <p className="text-sm text-muted">Total {formatPrice(total)}. The order stays unpaid until the payment is confirmed.</p>
      <button type="submit" disabled={pending} className={buttonClass()}>
        {pending ? "Saving order" : "Place order"}
      </button>
    </form>
  );
}
