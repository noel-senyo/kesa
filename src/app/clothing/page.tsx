import { Catalog } from "@/components/catalog/Catalog";
import { menu } from "@/data/menu";
import { banners } from "@/data/products";
import { loadCatalog } from "@/lib/catalog";

const department = menu.find((item) => item.href === "/clothing")!;

export const metadata = { title: "Clothing" };

export default async function ClothingPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const products = (await loadCatalog()).filter((product) => product.department === "clothing");

  return (
    <Catalog
      title="Clothing"
      banner={banners.clothing}
      basePath="/clothing"
      categories={department.items}
      products={products}
      category={category}
    />
  );
}
