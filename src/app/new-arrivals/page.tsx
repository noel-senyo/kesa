import { Catalog } from "@/components/catalog/Catalog";
import { banners, products } from "@/data/products";

export const metadata = { title: "New arrivals" };

export default function NewArrivalsPage() {
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
