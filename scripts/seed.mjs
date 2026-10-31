import fs from "node:fs";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, then run npm run seed.");
  process.exit(1);
}

const text = fs.readFileSync(new URL("../src/data/products.ts", import.meta.url), "utf8");
const colors = Object.fromEntries(
  [...text.matchAll(/"([a-z0-9-]+)": "([A-Z][a-z]+)"/g)].map((match) => [match[1], match[2]]),
);

const products = [...text.matchAll(
  /id: "([^"]+)",\s*name: "([^"]+)",\s*price: (\d+),\s*department: "([^"]+)",\s*category: "([^"]+)",\s*image: "([^"]+)",\s*hoverImage: "([^"]+)",(\s*featured: true,)?/g,
)].map((match) => ({
  id: match[1],
  name: match[2],
  price: Number(match[3]),
  department: match[4],
  category: match[5],
  image: match[6],
  hover_image: match[7],
  featured: Boolean(match[8]),
  color: colors[match[1]] ?? "Black",
  hidden: false,
}));

function sizesFor(department) {
  if (department === "accessories") return ["One"];
  if (department === "sneakers") return ["S", "M", "L", "XL"];
  return ["XS", "S", "M", "L", "XL", "XXL"];
}

const supabase = createClient(url, key, { auth: { persistSession: false } });
const { error } = await supabase.from("products").upsert(products);
if (error) {
  console.error(error.message);
  process.exit(1);
}

const stock = products.flatMap((product) =>
  sizesFor(product.department).map((size) => ({ product_id: product.id, size, quantity: 8 })),
);
const { error: stockError } = await supabase.from("stock").upsert(stock, { onConflict: "product_id,size", ignoreDuplicates: true });
if (stockError) {
  console.error(stockError.message);
  process.exit(1);
}

if (process.env.ADMIN_EMAIL) {
  await supabase.from("profiles").update({ role: "admin" }).eq("email", process.env.ADMIN_EMAIL);
}

console.log(`Seeded ${products.length} products. Existing stock counts were left as they are.`);
