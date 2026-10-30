/**
 * Every product the shop shows. `price` is a number of cedis.
 * Swap a photo by replacing the file, or point `image` at a new path.
 */
export type Product = {
  id: string;
  name: string;
  /** Cedi amount, not a formatted string. */
  price: number;
  department: "sneakers" | "clothing" | "accessories";
  category: string;
  image: string;
  hoverImage: string;
  /** Shown in the homepage carousel. */
  featured?: boolean;
};

export const products: Product[] = [
  {
    id: "pace-runner",
    name: "Pace runner",
    price: 620,
    department: "sneakers",
    category: "running",
    image: "/images/products/shoe-run-01.jpg",
    hoverImage: "/images/products/shoe-run-01-alt.jpg",
    featured: true,
  },
  {
    id: "night-runner",
    name: "Night runner",
    price: 745,
    department: "sneakers",
    category: "running",
    image: "/images/products/shoe-run-02.jpg",
    hoverImage: "/images/products/shoe-run-02-alt.jpg",
  },
  {
    id: "court-high",
    name: "Court high",
    price: 890,
    department: "sneakers",
    category: "basketball",
    image: "/images/products/shoe-court-01.jpg",
    hoverImage: "/images/products/shoe-court-01-alt.jpg",
    featured: true,
  },
  {
    id: "court-low",
    name: "Court low",
    price: 810,
    department: "sneakers",
    category: "basketball",
    image: "/images/products/shoe-court-02.jpg",
    hoverImage: "/images/products/shoe-court-02-alt.jpg",
  },
  {
    id: "daily-leather",
    name: "Daily leather",
    price: 540,
    department: "sneakers",
    category: "lifestyle",
    image: "/images/products/shoe-life-01.jpg",
    hoverImage: "/images/products/shoe-life-01-alt.jpg",
  },
  {
    id: "daily-canvas",
    name: "Daily canvas",
    price: 420,
    department: "sneakers",
    category: "lifestyle",
    image: "/images/products/shoe-life-02.jpg",
    hoverImage: "/images/products/shoe-life-02-alt.jpg",
  },
  {
    id: "pool-slide",
    name: "Pool slide",
    price: 180,
    department: "sneakers",
    category: "slides",
    image: "/images/products/shoe-slide-01.jpg",
    hoverImage: "/images/products/shoe-slide-01-alt.jpg",
  },
  {
    id: "cloud-slide",
    name: "Cloud slide",
    price: 210,
    department: "sneakers",
    category: "slides",
    image: "/images/products/shoe-slide-02.jpg",
    hoverImage: "/images/products/shoe-slide-02-alt.jpg",
  },
  {
    id: "heavy-hoodie",
    name: "Heavy hoodie",
    price: 380,
    department: "clothing",
    category: "hoodies",
    image: "/images/products/look-hoodie-01.jpg",
    hoverImage: "/images/products/look-hoodie-01-alt.jpg",
    featured: true,
  },
  {
    id: "zip-hoodie",
    name: "Zip hoodie",
    price: 450,
    department: "clothing",
    category: "hoodies",
    image: "/images/products/look-hoodie-02.jpg",
    hoverImage: "/images/products/look-hoodie-02-alt.jpg",
  },
  {
    id: "plain-tee",
    name: "Plain tee",
    price: 165,
    department: "clothing",
    category: "t-shirts",
    image: "/images/products/look-tee-01.jpg",
    hoverImage: "/images/products/look-tee-01-alt.jpg",
    featured: true,
  },
  {
    id: "box-tee",
    name: "Box tee",
    price: 190,
    department: "clothing",
    category: "t-shirts",
    image: "/images/products/look-tee-02.jpg",
    hoverImage: "/images/products/look-tee-02-alt.jpg",
  },
  {
    id: "straight-pant",
    name: "Straight pant",
    price: 340,
    department: "clothing",
    category: "pants",
    image: "/images/products/look-pant-01.jpg",
    hoverImage: "/images/products/look-pant-01-alt.jpg",
  },
  {
    id: "wide-pant",
    name: "Wide pant",
    price: 410,
    department: "clothing",
    category: "pants",
    image: "/images/products/look-pant-02.jpg",
    hoverImage: "/images/products/look-pant-02-alt.jpg",
  },
  {
    id: "court-short",
    name: "Court short",
    price: 175,
    department: "clothing",
    category: "shorts",
    image: "/images/products/look-short-01.jpg",
    hoverImage: "/images/products/look-short-01-alt.jpg",
  },
  {
    id: "mesh-short",
    name: "Mesh short",
    price: 195,
    department: "clothing",
    category: "shorts",
    image: "/images/products/look-short-02.jpg",
    hoverImage: "/images/products/look-short-02-alt.jpg",
  },
  {
    id: "field-jacket",
    name: "Field jacket",
    price: 720,
    department: "clothing",
    category: "jackets",
    image: "/images/products/look-jacket-01.jpg",
    hoverImage: "/images/products/look-jacket-01-alt.jpg",
  },
  {
    id: "coach-jacket",
    name: "Coach jacket",
    price: 650,
    department: "clothing",
    category: "jackets",
    image: "/images/products/look-jacket-02.jpg",
    hoverImage: "/images/products/look-jacket-02-alt.jpg",
  },
  {
    id: "lane-trainer",
    name: "Lane trainer",
    price: 480,
    department: "sneakers",
    category: "training",
    image: "/images/products/look-trainer-01.jpg",
    hoverImage: "/images/products/look-trainer-01-alt.jpg",
  },
  {
    id: "gym-trainer",
    name: "Gym trainer",
    price: 510,
    department: "sneakers",
    category: "training",
    image: "/images/products/look-trainer-02.jpg",
    hoverImage: "/images/products/look-trainer-02-alt.jpg",
  },
  {
    id: "plain-court",
    name: "Plain court",
    price: 460,
    department: "sneakers",
    category: "sneakers",
    image: "/images/products/look-sneaker-01.jpg",
    hoverImage: "/images/products/look-sneaker-01-alt.jpg",
  },
  {
    id: "canvas-low",
    name: "Canvas low",
    price: 390,
    department: "sneakers",
    category: "sneakers",
    image: "/images/products/look-sneaker-02.jpg",
    hoverImage: "/images/products/look-sneaker-02-alt.jpg",
  },
  {
    id: "field-boot",
    name: "Field boot",
    price: 780,
    department: "sneakers",
    category: "boots",
    image: "/images/products/look-boot-01.jpg",
    hoverImage: "/images/products/look-boot-01-alt.jpg",
  },
  {
    id: "city-boot",
    name: "City boot",
    price: 690,
    department: "sneakers",
    category: "boots",
    image: "/images/products/look-boot-02.jpg",
    hoverImage: "/images/products/look-boot-02-alt.jpg",
  },
  {
    id: "soft-cap",
    name: "Soft cap",
    price: 95,
    department: "accessories",
    category: "caps",
    image: "/images/products/cap-01.jpg",
    hoverImage: "/images/products/cap-01-alt.jpg",
  },
  {
    id: "day-tote",
    name: "Day tote",
    price: 240,
    department: "accessories",
    category: "bags",
    image: "/images/products/tote-01.jpg",
    hoverImage: "/images/products/tote-01-alt.jpg",
  },
];

export const banners = {
  sneakers: "/images/banners/sneakers.jpg",
  clothing: "/images/banners/clothing-studio.jpg",
  accessories: "/images/products/cap-01.jpg",
} as const;

export function productsFor(department: Product["department"]) {
  return products.filter((product) => product.department === department);
}

export function departmentOf(href: string): Product["department"] | null {
  if (href === "/sneakers") return "sneakers";
  if (href === "/clothing") return "clothing";
  if (href === "/accessories") return "accessories";
  return null;
}

export function productPath(id: string) {
  return `/product/${id}`;
}

export function findProduct(id: string) {
  return products.find((product) => product.id === id);
}

/** Clothing uses the full run. Shoes stop at XL. A cap or a bag is one size. */
export function sizesFor(product: Product): string[] {
  if (product.department === "accessories") return ["One"];
  if (product.department === "sneakers") return ["S", "M", "L", "XL"];
  return ["XS", "S", "M", "L", "XL", "XXL"];
}

const colors: Record<string, string> = {
  "pace-runner": "Grey",
  "night-runner": "Black",
  "court-high": "White",
  "court-low": "Grey",
  "daily-leather": "Cream",
  "daily-canvas": "Green",
  "pool-slide": "Taupe",
  "cloud-slide": "White",
  "lane-trainer": "Grey",
  "gym-trainer": "Black",
  "plain-court": "White",
  "canvas-low": "Black",
  "field-boot": "Tan",
  "city-boot": "Black",
  "heavy-hoodie": "Charcoal",
  "zip-hoodie": "Black",
  "plain-tee": "White",
  "box-tee": "Charcoal",
  "straight-pant": "Blue",
  "wide-pant": "Black",
  "court-short": "Black",
  "mesh-short": "Black",
  "field-jacket": "Olive",
  "coach-jacket": "Black",
  "soft-cap": "Black",
  "day-tote": "Sand",
};

export function colorOf(product: Product) {
  return colors[product.id] ?? "Black";
}
