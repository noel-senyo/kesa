import { notFound } from "next/navigation";

import { ProductView } from "@/components/product/ProductView";
import { loadProduct } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await loadProduct(id);
  return { title: product?.name ?? "Piece" };
}

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ size?: string }>;
}) {
  const { id } = await params;
  const { size } = await searchParams;
  const product = await loadProduct(id);
  if (!product) notFound();

  return <ProductView product={product} initialSize={size} />;
}
