import { HomeBands } from "@/components/home/HomeBands";
import { HomeHero } from "@/components/home/HomeHero";
import { products } from "@/data/products";
import { site } from "@/data/site";

export default function HomePage() {
  const featured = products.filter((product) => product.featured);

  return (
    <>
      <h1 className="sr-only">{site.name} — sneakers and clothing</h1>
      <HomeHero products={featured} />
      <HomeBands />
    </>
  );
}
