import { Catalog } from "@/components/catalog/Catalog";
import { menu } from "@/data/menu";
import { banners } from "@/data/products";
import { loadCatalog } from "@/lib/catalog";

const department = menu.find((item) => item.href === "/accessories")!;

export const metadata = { title: "Accessories" };

export default async function AccessoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const products = (await loadCatalog()).filter((product) => product.department === "accessories");

  return (
    <Catalog
      title="Accessories"
      banner={banners.accessories}
      basePath="/accessories"
      categories={department.items}
      products={products}
      category={category}
    />
  );
}
