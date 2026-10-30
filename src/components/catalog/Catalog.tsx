import Image from "next/image";
import Link from "@/components/ui/link";

import { SectionCount, SectionHeading } from "@/components/catalog/SectionHeading";
import { ProductCard } from "@/components/catalog/ProductCard";
import type { MenuItem } from "@/data/menu";
import type { Product } from "@/data/products";
import { cn } from "@/lib/utils";

const pill =
  "inline-flex h-10 items-center rounded-pill border border-line px-4 text-sm";

/**
 * Department page: giant title, photo banner, category pills, product grid.
 * `category` comes from the ?category= query. An unknown value shows everything.
 */
export function Catalog({
  title,
  banner,
  basePath,
  categories,
  products,
  category,
  photoTypes = false,
}: {
  title: string;
  banner: string;
  basePath: string;
  categories: MenuItem[];
  products: Product[];
  category?: string;
  /** Round photos for each type, used on the shoes page. */
  photoTypes?: boolean;
}) {
  const known = categories.some((item) => item.slug === category);
  const active = known ? category : undefined;
  const visible = active ? products.filter((product) => product.category === active) : products;

  return (
    <section className="pb-8">
      <SectionHeading title={title} count={<SectionCount count={visible.length} />} />
      <div className="relative mt-6 aspect-[2.4/1] overflow-hidden rounded-photo-lg bg-photo">
        <Image src={banner} alt="" fill priority sizes="100vw" className="object-cover" />
      </div>
      {photoTypes ? (
        <div className="mt-8 flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none]">
          {categories.map((item) => {
            const sample = products.find((product) => product.category === item.slug);
            if (!sample) return null;
            const selected = item.slug === active;
            return (
              <Link
                key={item.slug}
                href={`${basePath}?category=${item.slug}#catalog`}
                aria-current={selected ? "page" : undefined}
                className="flex w-[92px] shrink-0 flex-col items-center gap-2"
              >
                <span className={cn("relative size-20 overflow-hidden rounded-pill bg-photo", selected && "shadow-[0_0_0_2px_var(--fg)]")}>
                  <Image src={sample.image} alt="" fill sizes="80px" className="object-cover" />
                </span>
                <span className="text-center text-13">{item.label}</span>
              </Link>
            );
          })}
        </div>
      ) : null}
      <nav id="catalog" aria-label={`${title} categories`} className="mt-6 flex flex-wrap gap-2 scroll-mt-28">
        <Link
          href={basePath}
          aria-current={active ? undefined : "page"}
          className={cn(pill, !active && "border-fg bg-fg text-bg")}
        >
          All {products.length}
        </Link>
        {categories.map((item) => {
          const count = products.filter((product) => product.category === item.slug).length;
          const selected = item.slug === active;
          return (
            <Link
              key={item.slug}
              href={`${basePath}?category=${item.slug}#catalog`}
              aria-current={selected ? "page" : undefined}
              className={cn(pill, selected && "border-fg bg-fg text-bg")}
            >
              {item.label} {count}
            </Link>
          );
        })}
      </nav>
      <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 lg:grid-cols-4 lg:gap-x-4">
        {visible.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
