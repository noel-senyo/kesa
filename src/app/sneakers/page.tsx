import { Catalog } from "@/components/catalog/Catalog";
import { menu } from "@/data/menu";
import { banners, productsFor } from "@/data/products";

const department = menu.find((item) => item.href === "/sneakers")!;

export const metadata = { title: "Shoes" };

export default async function SneakersPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  return (
    <Catalog
      title="Shoes"
      banner={banners.sneakers}
      basePath="/sneakers"
      categories={department.items}
      products={productsFor("sneakers")}
      category={category}
      photoTypes
    />
  );
}
