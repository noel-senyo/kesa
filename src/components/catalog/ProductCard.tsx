"use client";

import Image from "next/image";
import Link from "@/components/ui/link";

import type { Product } from "@/data/products";
import { productPath } from "@/data/products";
import { formatPrice } from "@/lib/currency";
import { useMediaQuery } from "@/hooks/useMediaQuery";

/**
 * A product tile. On a mouse, the second photo rises over the first.
 * Touch screens keep a single photo, same as the template.
 * The link opens the piece.
 */
export function ProductCard({ product }: { product: Product }) {
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");
  const href = productPath(product.id);
  const showAlt = canHover && product.hoverImage !== product.image;

  return (
    <article id={product.id} className="group/piece flex scroll-mt-28 flex-col gap-3">
      <div className="relative overflow-hidden rounded-photo bg-photo">
        <Link href={href} tabIndex={-1} aria-hidden="true" className="relative block aspect-[3/4]">
          <Image
            fill
            src={product.image}
            alt=""
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover"
          />
          {showAlt ? (
            <span className="absolute inset-0 transition-[clip-path,opacity] duration-300 ease-out [clip-path:inset(100%_0_0_0_round_24px_24px_0_0)] group-hover/piece:duration-500 group-hover/piece:[clip-path:inset(0_0_0_0_round_0px)] group-has-[:focus-visible]/piece:[clip-path:inset(0_0_0_0_round_0px)] motion-reduce:opacity-0 motion-reduce:[clip-path:none] motion-reduce:group-hover/piece:opacity-100">
              <Image
                fill
                src={product.hoverImage}
                alt=""
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="scale-110 object-cover transition-transform duration-300 ease-out group-hover/piece:scale-100 group-hover/piece:duration-700 motion-reduce:scale-100"
              />
            </span>
          ) : null}
        </Link>
      </div>
      <div className="flex flex-col gap-1">
        <Link href={href} className="font-display-75 text-[22px] leading-none lg:text-[26px]">
          {product.name}
        </Link>
        <p className="text-[15px] font-medium tabular-nums">{formatPrice(product.price)}</p>
      </div>
    </article>
  );
}
