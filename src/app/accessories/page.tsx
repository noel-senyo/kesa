import { Catalog } from "@/components/catalog/Catalog";
import { menu } from "@/data/menu";
import { banners, productsFor } from "@/data/products";

const department = menu.find((item) => item.href === "/accessories")!;

export const metadata = { title: "Accessories" };

export default async function AccessoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  return (
    <Catalog
      title="Accessories"
      banner={banners.accessories}
      basePath="/accessories"
      categories={department.items}
      products={productsFor("accessories")}
      category={category}
    />
  );
}
