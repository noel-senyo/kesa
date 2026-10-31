"use client";

import Image from "next/image";
import Link from "@/components/ui/link";
import { useEffect, useState } from "react";

import { SizePicker } from "@/components/product/SizePicker";
import { ArrowRightIcon } from "@/components/icons";
import { menu } from "@/data/menu";
import { availableSizes, colorOf, productPath, sizesFor, type Product } from "@/data/products";
import { formatPrice } from "@/lib/currency";
import { fitDisplaySize } from "@/lib/display-type";
import { swatchBackground } from "@/lib/color";
import { cn } from "@/lib/utils";

const DWELL_MS = 6000;

function placement(slot: number) {
  if (slot === 0) return "z-30";
  if (slot === 1) return "z-20 translate-x-[58%] translate-y-[2%] rotate-[5deg] scale-[0.78]";
  if (slot === 2) return "z-10 translate-x-[102%] translate-y-[4%] rotate-[9deg] scale-[0.6] max-lg:opacity-0";
  return "pointer-events-none opacity-0";
}

function labelFor(product: Product) {
  const department = menu.find((item) => item.href === `/${product.department}`);
  const category = department?.items.find((item) => item.slug === product.category);
  return {
    department: department?.label ?? product.department,
    category: category?.label ?? product.category,
  };
}

/**
 * Homepage carousel. The giant word, the photo, and the name all open
 * that piece. Colour chips and the size run sit with it, as on the store.
 */
export function HomeHero({ products }: { products: Product[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [size, setSize] = useState<string | undefined>();
  const count = products.length;
  const product = products[index];

  useEffect(() => {
    if (paused || count < 2) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, DWELL_MS);
    return () => window.clearInterval(timer);
  }, [paused, count]);

  if (!product) return null;

  const word = product.name.split(" ")[0].toUpperCase();
  const wordSize = fitDisplaySize(word, { maxPx: 300, budgetPx: 1100, vwBudget: 90 });
  const sizes = sizesFor(product);
  const stocked = availableSizes(product);
  const chosen = size && stocked.includes(size) ? size : stocked[Math.min(2, Math.max(stocked.length - 1, 0))] ?? sizes[0];
  const href = `${productPath(product.id)}?size=${encodeURIComponent(chosen)}`;
  const labels = labelFor(product);
  const hold = {
    onMouseEnter: () => setPaused(true),
    onMouseLeave: () => setPaused(false),
    onFocus: () => setPaused(true),
    onBlur: () => setPaused(false),
  };

  return (
    <>
      <section
        aria-roledescription="carousel"
        aria-label="Featured pieces"
        className="hero relative isolate -mx-4 overflow-x-clip px-4 pb-10 lg:-mx-8 lg:h-[var(--hero-h)] lg:px-8 lg:pb-0 lg:pt-6"
      >
        <div className="relative h-[470px] lg:static lg:h-auto">
          <Link
            href={href}
            aria-label={word}
            style={{ "--word-m": "min(120px, 28vw)", "--word-d": wordSize } as React.CSSProperties}
            className="absolute inset-x-0 top-0 whitespace-nowrap text-center font-display text-[length:var(--word-m)] leading-[0.85] lg:static lg:text-[length:min(var(--word-d),calc(var(--hero-u)*316))] lg:leading-[0.82]"
          >
            <span key={word} className="inline-flex overflow-hidden align-top">
              {word.split("").map((letter, position) => (
                <span
                  key={`${word}-${position}`}
                  aria-hidden="true"
                  className="inline-block animate-rise whitespace-pre"
                  style={{ animationDelay: `${position * 28}ms` }}
                >
                  {letter}
                </span>
              ))}
            </span>
          </Link>
          <div className="absolute left-1/2 top-[70px] aspect-[2/3] w-64 -translate-x-1/2 lg:top-[calc(var(--hero-u)*150)] lg:w-[min(30vw,calc(var(--hero-u)*432))]">
            {products.map((item, position) => {
              const slot = (position - index + count) % count;
              return (
                <div
                  key={item.id}
                  className={cn(
                    "absolute inset-0 transition-[transform,opacity] duration-700 ease-out motion-reduce:transition-opacity",
                    placement(slot),
                  )}
                >
                  <Link
                    href={productPath(item.id)}
                    className="relative block size-full overflow-hidden rounded-photo bg-photo shadow-hero lg:rounded-photo-lg"
                  >
                    <Image src={item.image} alt="" fill sizes="30vw" className="object-cover" priority={slot === 0} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        <div
          {...hold}
          className="flex flex-col gap-3.5 lg:absolute lg:bottom-[calc(var(--hero-u)*48)] lg:left-8 lg:w-[min(340px,25vw)]"
        >
          <span className="text-xs text-muted lg:text-13">
            {labels.department} · {colorOf(product)}
          </span>
          <h2 className="font-display-75 text-[26px] leading-none lg:text-[length:max(28px,calc(var(--hero-u)*44))]">
            <Link href={href}>{product.name}</Link>
          </h2>
          <p className="text-lg font-medium tabular-nums">{formatPrice(product.price)}</p>
          <div className="flex items-center gap-1 lg:hidden">
            {products.map((option, position) => (
              <button
                key={option.id}
                type="button"
                aria-label={`${colorOf(option)} ${option.name}`}
                aria-pressed={position === index}
                onClick={() => {
                  setPaused(true);
                  setIndex(position);
                }}
                className="press grid size-11 place-items-center rounded-pill aria-pressed:shadow-[0_0_0_1.5px_var(--fg)]"
              >
                <span className="size-7 rounded-pill shadow-[0_0_0_1px_var(--line)]" style={{ background: swatchBackground(colorOf(option)) }} />
              </button>
            ))}
            <span className="ml-auto text-xs">{products.length} colors</span>
          </div>
          <div className="hidden lg:block" style={{ width: sizes.length * 54 - 6 }}>
            <SizePicker compact options={sizes} available={availableSizes(product)} value={chosen} onChange={setSize} />
          </div>
          <div className="lg:hidden">
            <SizePicker compact options={sizes} available={availableSizes(product)} value={chosen} onChange={setSize} />
          </div>
          <Link href={href} className="press inline-flex h-14 items-center justify-center rounded-pill bg-fg px-8 font-semibold text-bg hover:bg-hover">
            View piece
          </Link>
        </div>

        <div className="absolute bottom-[calc(var(--hero-u)*48)] right-8 hidden flex-col items-end gap-4 lg:flex">
          <span className="font-display text-[length:max(40px,calc(var(--hero-u)*64))] font-extrabold leading-none tabular-nums">
            {String(index + 1).padStart(2, "0")}
            <span className="opacity-60">/{String(count).padStart(2, "0")}</span>
          </span>
          <button
            type="button"
            onClick={() => setIndex((current) => (current + 1) % count)}
            className="press flex h-[52px] items-center gap-2.5 rounded-pill border border-fg px-[22px] font-medium"
          >
            Next piece
            <ArrowRightIcon />
          </button>
        </div>
      </section>

      <section className="flex flex-col gap-4 pb-10">
        <h2 className="text-13 text-muted">Shop by color</h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))] gap-3">
          {products.map((option, position) => (
            <button
              key={option.id}
              type="button"
              aria-pressed={position === index}
              onClick={() => {
                setPaused(true);
                setIndex(position);
              }}
              className="press flex items-center gap-3.5 rounded-chip border border-line p-2 pr-4 text-left aria-pressed:border-fg aria-pressed:bg-card"
            >
              <Image src={option.image} alt="" width={56} height={72} sizes="56px" className="h-[72px] w-14 rounded-[14px] bg-photo object-cover" />
              <span className="flex grow flex-col">
                <span className="font-medium">{option.name.split(" ")[0]}</span>
                <span className="text-13 text-muted">{colorOf(option)}</span>
              </span>
              <span aria-hidden="true" className="size-[22px] shrink-0 rounded-pill shadow-[0_0_0_1px_var(--line)]" style={{ background: swatchBackground(colorOf(option)) }} />
            </button>
          ))}
        </div>
      </section>
    </>
  );
}
