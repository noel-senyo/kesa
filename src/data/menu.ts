/**
 * Main menu. Add a department or rename a category here.
 * `href` is the page. Each item becomes a dropdown entry and a filter tab.
 */
export type MenuItem = {
  label: string;
  slug: string;
};

export type MenuDepartment = {
  label: string;
  href: string;
  items: MenuItem[];
};

export const menu: MenuDepartment[] = [
  {
    label: "Clothing",
    href: "/clothing",
    items: [
      { label: "Hoodies", slug: "hoodies" },
      { label: "T-Shirts", slug: "t-shirts" },
      { label: "Pants", slug: "pants" },
      { label: "Shorts", slug: "shorts" },
      { label: "Jackets", slug: "jackets" },
    ],
  },
  {
    label: "Shoes",
    href: "/sneakers",
    items: [
      { label: "Running", slug: "running" },
      { label: "Lifestyle", slug: "lifestyle" },
      { label: "Basketball", slug: "basketball" },
      { label: "Training", slug: "training" },
      { label: "Sneakers", slug: "sneakers" },
      { label: "Slides", slug: "slides" },
      { label: "Boots", slug: "boots" },
    ],
  },
  {
    label: "Accessories",
    href: "/accessories",
    items: [
      { label: "Caps", slug: "caps" },
      { label: "Bags", slug: "bags" },
    ],
  },
];

/** Link for one category on its department page. */
export function categoryHref(department: MenuDepartment, slug: string) {
  return `${department.href}?category=${slug}#catalog`;
}
