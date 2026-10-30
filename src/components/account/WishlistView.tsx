"use client";

import Link from "@/components/ui/link";

import { Starters } from "@/components/account/Starters";
import { HeartIcon } from "@/components/icons";
import { buttonClass } from "@/components/ui/button-classes";
import type { Product } from "@/data/products";
import { useShopper } from "@/lib/shopper";

export function WishlistView({ starters }: { starters: Product[] }) {
  const shopper = useShopper();

  if (!shopper) {
    return (
      <EmptyWishlist
        title="Your wishlist is empty"
        body="Not registered? You must be in order to save your products in the wishlist."
        actions={
          <>
            <Link href="/login?redirect=/wishlist" className={buttonClass()}>
              Sign in
            </Link>
            <Link href="/register?redirect=/wishlist" className={buttonClass({ variant: "secondary" })}>
              Create account
            </Link>
          </>
        }
        starters={starters}
      />
    );
  }

  return (
    <>
      <EmptyWishlist
        title="Nothing saved yet"
        body="Tap the heart on any piece to keep it here for later."
        actions={
          <Link href="/" className={buttonClass()}>
            See what&apos;s new
          </Link>
        }
        starters={starters}
      />
    </>
  );
}

/** "00" beside the title once someone is signed in, same as the template count. */
export function WishlistCount() {
  const shopper = useShopper();
  if (!shopper) return null;

  return (
    <span aria-label="0 pieces" className="pb-1.5 font-display text-[40px] font-extrabold leading-none tabular-nums lg:text-[64px]">
      00
    </span>
  );
}

function EmptyWishlist({
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
    <div className="flex flex-col gap-12">
      <div className="flex flex-col items-start gap-[18px] border-t border-line pt-7">
        <span className="grid size-14 place-items-center rounded-pill border-2 border-dashed border-fg">
          <HeartIcon size={22} />
        </span>
        <h2 className="font-display text-[56px] leading-[0.85] lg:text-[min(120px,8.3vw)]">{title}</h2>
        <p className="max-w-[520px] text-lg">{body}</p>
        <div className="flex flex-wrap gap-2">{actions}</div>
      </div>
      <Starters products={starters} />
    </div>
  );
}
