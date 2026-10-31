import { Catalog } from "@/components/catalog/Catalog";
import { menu } from "@/data/menu";
import { banners } from "@/data/products";
import { loadCatalog } from "@/lib/catalog";

const department = menu.find((item) => item.href === "/sneakers")!;

export const metadata = { title: "Shoes" };

export default async function SneakersPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const products = (await loadCatalog()).filter((product) => product.department === "sneakers");

  return (
    <Catalog
      title="Shoes"
      banner={banners.sneakers}
      basePath="/sneakers"
      categories={department.items}
      products={products}
      category={category}
      photoTypes
    />
  );
}
