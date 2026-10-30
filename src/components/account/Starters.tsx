import Image from "next/image";

import Link from "@/components/ui/link";
import type { Product } from "@/data/products";
import { productPath } from "@/data/products";
import { formatPrice } from "@/lib/currency";

/** The four pieces under an empty cart or wishlist: "Start with these". */
export function Starters({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-13 font-semibold uppercase tracking-[0.08em]">Start with these</h3>
      <div className="grid grid-cols-2 gap-x-3 gap-y-6 lg:grid-cols-4">
        {products.map((product) => {
          const href = productPath(product.id);
          return (
            <article key={product.id} className="flex flex-col gap-3">
              <Link href={href} tabIndex={-1} aria-hidden="true" className="relative block aspect-[3/4] overflow-hidden rounded-photo bg-photo">
                <Image src={product.image} alt="" fill sizes="(max-width: 1023px) 50vw, 25vw" className="object-cover" />
              </Link>
              <Link href={href} className="flex justify-between gap-3 px-1">
                <span className="font-medium">{product.name}</span>
                <span className="whitespace-nowrap tabular-nums">{formatPrice(product.price)}</span>
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}
