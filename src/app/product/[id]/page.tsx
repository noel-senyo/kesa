import { notFound } from "next/navigation";

import { ProductView } from "@/components/product/ProductView";
import { findProduct, products } from "@/data/products";

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = findProduct(id);
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
  const product = findProduct(id);
  if (!product) notFound();

  return <ProductView product={product} initialSize={size} />;
}
