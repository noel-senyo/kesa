import { Catalog } from "@/components/catalog/Catalog";
import { menu } from "@/data/menu";
import { banners, productsFor } from "@/data/products";

const department = menu.find((item) => item.href === "/clothing")!;

export const metadata = { title: "Clothing" };

export default async function ClothingPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  return (
    <Catalog
      title="Clothing"
      banner={banners.clothing}
      basePath="/clothing"
      categories={department.items}
      products={productsFor("clothing")}
      category={category}
    />
  );
}
