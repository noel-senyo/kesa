"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { SizePicker } from "@/components/product/SizePicker";
import Link from "@/components/ui/link";
import { menu } from "@/data/menu";
import { availableSizes, colorOf, sizesFor, type Product } from "@/data/products";
import { formatPrice } from "@/lib/currency";
import { swatchBackground } from "@/lib/color";
import { addToBag } from "@/lib/bag";
import { cn } from "@/lib/utils";

export function ProductView({ product, initialSize }: { product: Product; initialSize?: string }) {
  const router = useRouter();
  const sizes = sizesFor(product);
  const inStock = availableSizes(product);
  const color = colorOf(product);
  const [size, setSize] = useState(
    initialSize && inStock.includes(initialSize) ? initialSize : inStock[Math.min(2, inStock.length - 1)] ?? sizes[0],
  );
  const [photo, setPhoto] = useState(product.image);
  const department = menu.find((item) => item.href === `/${product.department}`);
  const category = department?.items.find((item) => item.slug === product.category);

  return (
    <div className="-mx-4 grid lg:mx-0 lg:grid-cols-[minmax(0,7fr)_minmax(400px,5fr)] lg:items-start lg:gap-12 lg:pb-16 lg:pt-8">
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
        {[product.image, product.hoverImage].map((src) => (
          <button
            key={src}
            type="button"
            onClick={() => setPhoto(src)}
            className={cn(
              "relative aspect-[3/4] overflow-hidden bg-photo lg:rounded-photo",
              photo === src && "lg:shadow-[inset_0_0_0_1.5px_var(--fg)]",
            )}
          >
            <Image src={src} alt="" fill sizes="(min-width: 1024px) 35vw, 100vw" className="object-cover" priority={src === product.image} />
          </button>
        ))}
      </div>

      <div className="flex min-w-0 flex-col gap-6 px-4 pb-28 pt-5 lg:sticky lg:top-28 lg:px-0 lg:pb-0">
        <div className="flex flex-col gap-3">
          {department && category ? (
            <Link href={`${department.href}?category=${product.category}#catalog`} className="text-13 text-muted hover:underline">
              {department.label} · {category.label}
            </Link>
          ) : null}
          <div className="flex items-end justify-between gap-3 lg:flex-col lg:items-start">
            <h1 className="font-display text-[46px] leading-[0.86] lg:text-[min(80px,5.6vw)]">{product.name}</h1>
            <p className="whitespace-nowrap text-lg font-medium tabular-nums lg:text-[26px]">{formatPrice(product.price)}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-sm">
            Color <span className="text-muted">— {color}</span>
          </span>
          <div role="group" aria-label="Color" className="flex">
            <button
              type="button"
              aria-pressed="true"
              className="press flex items-center gap-3 rounded-chip border-[1.5px] border-fg bg-card p-1.5 pr-4 text-left"
            >
              <Image src={product.image} alt="" width={48} height={60} className="h-[60px] w-12 rounded-[14px] object-cover" />
              <span className="flex flex-col leading-tight">
                <span className="font-medium">{color}</span>
                <span className="text-xs text-muted">{sizes.join(" · ")}</span>
              </span>
              <span aria-hidden="true" className="ml-2 size-[22px] rounded-pill shadow-[0_0_0_1px_var(--line)]" style={{ background: swatchBackground(color) }} />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-sm">
            Size <span className="text-muted">— {size}</span>
          </span>
          <SizePicker options={sizes} available={inStock} value={size} onChange={setSize} />
        </div>

        <button
          type="button"
          disabled={!inStock.includes(size)}
          onClick={() => {
            if (!inStock.includes(size)) return;
            addToBag(product.id, size);
            router.push("/cart");
          }}
          className="press hidden h-16 items-center justify-center rounded-pill bg-fg text-base font-semibold text-bg hover:bg-hover disabled:opacity-50 lg:flex"
        >
          {inStock.includes(size) ? "Add to cart" : "Out of stock"}
        </button>
        <div className="fixed inset-x-4 bottom-[max(24px,env(safe-area-inset-bottom))] z-30 lg:hidden">
          <button
            type="button"
            disabled={!inStock.includes(size)}
            onClick={() => {
              if (!inStock.includes(size)) return;
              addToBag(product.id, size);
              router.push("/cart");
            }}
            className="press flex h-[60px] w-full items-center justify-center rounded-pill bg-fg text-base font-semibold text-bg disabled:opacity-50"
          >
            {inStock.includes(size) ? "Add to cart" : "Out of stock"}
          </button>
        </div>

        <p className="max-w-[60ch] text-muted">
          A {color.toLowerCase()} {category?.label.toLowerCase() ?? product.category} piece. The second photo is the other side.
        </p>
      </div>
    </div>
  );
}
