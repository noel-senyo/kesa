import { Catalog } from "@/components/catalog/Catalog";
import { banners } from "@/data/products";
import { loadCatalog } from "@/lib/catalog";

export const metadata = { title: "New arrivals" };

export default async function NewArrivalsPage() {
  const products = await loadCatalog();

  return (
    <Catalog
      title="New arrivals"
      banner={banners.clothing}
      basePath="/new-arrivals"
      categories={[]}
      products={products}
    />
  );
}
