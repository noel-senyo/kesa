"use client";

import Image from "next/image";
import Link from "@/components/ui/link";

import { Starters } from "@/components/account/Starters";
import { buttonClass } from "@/components/ui/button-classes";
import { findProduct, productPath, type Product } from "@/data/products";
import { formatPrice } from "@/lib/currency";
import { removeFromBag, useBag } from "@/lib/bag";
import { useShopper } from "@/lib/shopper";

export function CartView({ starters }: { starters: Product[] }) {
  const shopper = useShopper();
  const lines = useBag();
  const filled = lines
    .map((line) => ({ line, product: findProduct(line.productId) }))
    .filter((entry): entry is { line: (typeof lines)[number]; product: Product } => Boolean(entry.product));

  if (filled.length > 0) {
    const total = filled.reduce((sum, entry) => sum + entry.product.price * entry.line.quantity, 0);
    return (
      <div className="grid items-start gap-12 border-t border-line pt-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex flex-col">
          {filled.map(({ line, product }) => (
            <article key={`${line.productId}-${line.size}`} className="grid grid-cols-[80px_minmax(0,1fr)_auto] items-center gap-3 border-b border-line py-3 lg:grid-cols-[150px_minmax(0,1fr)_auto] lg:gap-6 lg:py-5">
              <Link href={productPath(product.id)} className="relative block h-[104px] overflow-hidden rounded-field bg-photo lg:h-[196px]">
                <Image src={product.image} alt="" fill sizes="150px" className="object-cover" />
              </Link>
              <div className="flex min-w-0 flex-col gap-2">
                <Link href={productPath(product.id)} className="font-medium lg:font-display-75 lg:text-[30px] lg:leading-none">
                  {product.name}
                </Link>
                <span className="text-sm text-muted">Size {line.size} · Qty {line.quantity}</span>
                <button type="button" onClick={() => removeFromBag(line.productId, line.size)} className="w-fit text-13 underline underline-offset-[3px]">
                  Remove
                </button>
              </div>
              <span className="tabular-nums lg:text-xl">{formatPrice(product.price * line.quantity)}</span>
            </article>
          ))}
        </div>
        <aside className="flex flex-col gap-4 rounded-photo-lg border border-line bg-fg/5 p-6">
          <div className="flex items-baseline justify-between">
            <span className="font-medium">Total</span>
            <span className="font-display-75 text-[40px] leading-none">{formatPrice(total)}</span>
          </div>
          <p className="text-sm text-muted">Checkout is not connected yet. The pieces stay in this browser.</p>
        </aside>
      </div>
    );
  }

  if (!shopper) {
    return (
      <EmptyCart
        title="Your cart is empty"
        body="Not registered? You must be in order to save your products in the shopping cart."
        actions={
          <>
            <Link href="/login?redirect=/cart" className={buttonClass()}>
              Sign in
            </Link>
            <Link href="/new-arrivals" className={buttonClass({ variant: "secondary" })}>
              See what&apos;s new
            </Link>
          </>
        }
        starters={starters}
      />
    );
  }

  return (
    <EmptyCart
      title="Your cart is empty"
      body="Anything you add shows up here, ready for checkout."
      actions={
        <>
          <Link href="/new-arrivals" className={buttonClass()}>
            See what&apos;s new
          </Link>
          <Link href="/wishlist" className={buttonClass({ variant: "secondary" })}>
            Open wishlist
          </Link>
        </>
      }
      starters={starters}
    />
  );
}

export function CartCount() {
  const lines = useBag();
  const count = lines.reduce((total, line) => total + line.quantity, 0);
  if (count === 0) return null;
  return <span className="opacity-60"> ({count})</span>;
}

function EmptyCart({
  title,
  body,
  actions,
  starters,
}: {
  title: string;
  body: string;
  actions: React.ReactNode;
  starters: Product[];
}) {
  return (
    <div className="flex flex-col gap-12 border-t border-line pt-8">
      <div className="flex flex-col items-start gap-[18px]">
        <h2 className="font-display text-[56px] leading-[0.85] lg:text-[min(120px,8.3vw)]">{title}</h2>
        <p className="max-w-[520px] text-base lg:text-lg">{body}</p>
        <div className="flex flex-wrap gap-2">{actions}</div>
      </div>
      <Starters products={starters} />
    </div>
  );
}
