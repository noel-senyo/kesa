import { WishlistCount, WishlistView } from "@/components/account/WishlistView";
import { loadCatalog } from "@/lib/catalog";

export const metadata = {
  title: "Wishlist",
  description: "View the products you saved to your wishlist.",
};

export default async function WishlistPage() {
  const starters = (await loadCatalog()).filter((product) => product.featured).slice(0, 4);

  return (
    <section className="flex flex-col gap-5 pb-24 lg:gap-7">
      <div className="flex items-end justify-between gap-4 pt-3 lg:pt-12">
        <h1 className="font-display text-[min(88px,20vw)] leading-[0.8] lg:text-[min(240px,16vw)]">
          Wishlist
        </h1>
        <WishlistCount />
      </div>
      <WishlistView starters={starters} />
    </section>
  );
}
