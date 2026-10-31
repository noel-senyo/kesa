import { notFound } from "next/navigation";

import { ProductForm } from "@/components/admin/ProductForm";
import { loadProduct } from "@/lib/catalog";

export const metadata = { title: "Edit product" };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await loadProduct(id, { includeHidden: true });
  if (!product) notFound();
  return <ProductForm product={product} />;
}
