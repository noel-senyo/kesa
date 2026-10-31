import { HomeBands } from "@/components/home/HomeBands";
import { HomeHero } from "@/components/home/HomeHero";
import { loadCatalog } from "@/lib/catalog";
import { site } from "@/data/site";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const catalog = await loadCatalog();
  const featured = catalog.filter((product) => product.featured);

  return (
    <>
      <h1 className="sr-only">{site.name} — sneakers and clothing</h1>
      <HomeHero products={featured.length ? featured : catalog.slice(0, 4)} />
      <HomeBands products={catalog} />
    </>
  );
}
