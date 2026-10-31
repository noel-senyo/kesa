import Link from "@/components/ui/link";

import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { categoryHref, menu } from "@/data/menu";
import { site } from "@/data/site";

const clothing = menu.find((department) => department.href === "/clothing");
const shoes = menu.find((department) => department.href === "/sneakers");

const linkClass = "text-sm text-white/78 hover:text-white hover:underline hover:underline-offset-[3px]";

/**
 * A dark close to the page: shop links that go somewhere, account, and a
 * short note to join. The giant cropped wordmark used to be the whole footer.
 */
export function Footer() {
  return (
    <footer className="mt-20 bg-[#111214] text-[#F2F3F4] [body:has([data-auth-page])_&]:hidden">
      <div className="mx-auto grid w-full max-w-[1920px] gap-12 px-4 py-14 lg:grid-cols-12 lg:gap-8 lg:px-8 lg:py-16">
        <div className="min-w-0 lg:col-span-4">
          <p className="font-display text-[72px] leading-[0.78] lg:text-[88px]">{site.name}</p>
          <p className="mt-5 max-w-[320px] text-sm leading-relaxed text-white/68">
            Clothing, shoes, and the small things that finish a look. Prices are in Ghana cedis.
          </p>
        </div>

        <nav aria-label="Clothing" className="min-w-0 lg:col-span-2">
          <h2 className="text-13 font-semibold uppercase tracking-[0.08em] text-white/45">Clothing</h2>
          <ul className="mt-4 flex flex-col gap-2.5">
            <li>
              <Link href="/clothing" className={linkClass}>
                All clothing
              </Link>
            </li>
            {clothing?.items.map((item) => (
              <li key={item.slug}>
                <Link href={categoryHref(clothing, item.slug)} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Shoes" className="min-w-0 lg:col-span-2">
          <h2 className="text-13 font-semibold uppercase tracking-[0.08em] text-white/45">Shoes</h2>
          <ul className="mt-4 flex flex-col gap-2.5">
            <li>
              <Link href="/sneakers" className={linkClass}>
                All shoes
              </Link>
            </li>
            {shoes?.items.map((item) => (
              <li key={item.slug}>
                <Link href={categoryHref(shoes, item.slug)} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex min-w-0 flex-col gap-10 lg:col-span-4">
          <nav aria-label="Account">
            <h2 className="text-13 font-semibold uppercase tracking-[0.08em] text-white/45">Account</h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              <li>
                <Link href="/new-arrivals" className={linkClass}>
                  New arrivals
                </Link>
              </li>
              <li>
                <Link href="/accessories" className={linkClass}>
                  Accessories
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className={linkClass}>
                  Wishlist
                </Link>
              </li>
              <li>
                <Link href="/cart" className={linkClass}>
                  Cart
                </Link>
              </li>
              <li>
                <Link href="/orders" className={linkClass}>
                  My orders
                </Link>
              </li>
              <li>
                <Link href="/login" className={linkClass}>
                  Sign in
                </Link>
              </li>
              <li>
                <Link href="/register" className={linkClass}>
                  Create account
                </Link>
              </li>
            </ul>
          </nav>
          <div>
            <h2 className="text-13 font-semibold uppercase tracking-[0.08em] text-white/45">Notes</h2>
            <p className="mb-3 mt-4 max-w-sm text-sm text-white/68 text-pretty">
              New pieces and the occasional restock. No noise.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </div>
      <div className="border-t border-white/12">
        <div className="mx-auto flex w-full max-w-[1920px] flex-wrap items-center justify-between gap-3 px-4 py-5 text-13 text-white/48 lg:px-8">
          <p>© {new Date().getFullYear()} {site.name}</p>
          <p>Ghana cedis</p>
        </div>
      </div>
    </footer>
  );
}
