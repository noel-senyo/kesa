import Link from "@/components/ui/link";

import { CartCount, CartView } from "@/components/account/CartView";
import { loadCatalog } from "@/lib/catalog";

export const metadata = {
  title: "Cart",
  description: "View the products saved in your shopping cart.",
};

export default async function CartPage({
  searchParams,
}: {
  searchParams: Promise<{ result?: string; order?: string }>;
}) {
  const { result, order } = await searchParams;
  const catalog = await loadCatalog();
  const starters = catalog.filter((product) => product.featured).slice(0, 4);

  return (
    <section className="flex flex-col gap-6 pb-24">
      <div className="-mx-2 flex h-14 items-center justify-between lg:hidden">
        <Link href="/" aria-label="Continue shopping" className="press grid size-11 place-items-center rounded-pill">
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </Link>
      </div>
      <h1 className="font-display text-[120px] leading-[0.8] lg:pt-10 lg:text-[min(240px,16.6vw)]">
        Cart
        <CartCount />
      </h1>
      <CartView starters={starters} catalog={catalog} notice={result} orderNumber={order} />
    </section>
  );
}
