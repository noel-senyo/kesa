import Link from "@/components/ui/link";

import { loadAllProducts } from "@/lib/catalog";
import { formatPrice } from "@/lib/currency";

export const metadata = { title: "Inventory" };

export default async function AdminPage() {
  const products = await loadAllProducts();

  return (
    <div className="overflow-x-auto border-t border-line">
      {products.length === 0 ? (
        <p className="py-8 text-muted">No products yet. Run npm run seed, or add one.</p>
      ) : null}
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="text-muted">
          <tr>
            <th className="py-3 font-medium">Piece</th>
            <th className="py-3 font-medium">Price</th>
            <th className="py-3 font-medium">Stock</th>
            <th className="py-3 font-medium">Shop</th>
            <th className="py-3 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const units = Object.values(product.stock ?? {}).reduce((sum, count) => sum + count, 0);
            return (
              <tr key={product.id} className="border-t border-line">
                <td className="py-3">
                  <span className="font-medium">{product.name}</span>
                  <span className="mt-1 block text-muted">{product.department} · {product.category}</span>
                </td>
                <td className="py-3 tabular-nums">{formatPrice(product.price)}</td>
                <td className="py-3 tabular-nums">{units}</td>
                <td className="py-3">{product.hidden ? "Hidden" : "Visible"}</td>
                <td className="py-3 text-right">
                  <Link href={`/admin/products/${product.id}`} className="underline underline-offset-[3px]">
                    Edit
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
