import { colorOf, products as localProducts, sizesFor, type Product } from "@/data/products";
import { createClient } from "@/lib/supabase/server";

type ProductRow = {
  id: string;
  name: string;
  price: number | string;
  department: Product["department"];
  category: string;
  image: string;
  hover_image: string;
  color: string | null;
  featured: boolean;
  hidden: boolean;
};

type StockRow = {
  product_id: string;
  size: string;
  quantity: number;
};

function fromFile(): Product[] {
  return localProducts.map((product) => ({
    ...product,
    color: colorOf(product),
    hidden: false,
  }));
}

function toProduct(row: ProductRow, stockRows: StockRow[]): Product {
  const product: Product = {
    id: row.id,
    name: row.name,
    price: Number(row.price),
    department: row.department,
    category: row.category,
    image: row.image,
    hoverImage: row.hover_image,
    color: row.color ?? undefined,
    featured: row.featured,
    hidden: row.hidden,
    stock: {},
  };
  const stock: Record<string, number> = {};
  for (const size of sizesFor(product)) stock[size] = 0;
  for (const row of stockRows) {
    if (row.product_id === product.id) stock[row.size] = row.quantity;
  }
  product.stock = stock;
  return product;
}

/** Visible shop pieces. Falls back to the file catalog when Supabase is not configured. */
export async function loadCatalog(): Promise<Product[]> {
  const all = await loadAllProducts();
  return all.filter((product) => !product.hidden);
}

/** Includes pieces an admin has hidden. */
export async function loadAllProducts(): Promise<Product[]> {
  const supabase = await createClient();
  if (!supabase) return fromFile();

  const { data, error } = await supabase.from("products").select("*").order("name");
  if (error || !data) {
    console.error("Could not read products", error?.message);
    return fromFile();
  }
  if (data.length === 0) return [];

  const rows = data as ProductRow[];
  const { data: stockData } = await supabase
    .from("stock")
    .select("product_id,size,quantity")
    .in(
      "product_id",
      rows.map((row) => row.id),
    );

  const stockRows = (stockData ?? []) as StockRow[];
  return rows.map((row) => toProduct(row, stockRows.filter((stock) => stock.product_id === row.id)));
}

export async function loadProduct(id: string, options?: { includeHidden?: boolean }) {
  const products = options?.includeHidden ? await loadAllProducts() : await loadCatalog();
  return products.find((product) => product.id === id) ?? null;
}
