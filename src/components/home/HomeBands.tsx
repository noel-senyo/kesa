import { SectionRow } from "@/components/home/SectionRow";
import { menu } from "@/data/menu";
import { departmentOf, products } from "@/data/products";

/** Giant rows under the hero. Each one links to a department page. */
export function HomeBands() {
  return (
    <nav aria-label="Browse sections" className="mt-8 border-t border-line">
      {menu.map((department) => {
        const key = departmentOf(department.href);
        const count = key ? products.filter((product) => product.department === key).length : 0;
        return (
          <SectionRow
            key={department.href}
            href={department.href}
            label={department.label}
            count={count}
          />
        );
      })}
    </nav>
  );
}
