"use client";

import Link from "@/components/ui/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import { CloseIcon, HeartIcon, MenuIcon, SearchIcon, UserIcon } from "@/components/icons";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { categoryHref, menu, type MenuDepartment } from "@/data/menu";
import { products } from "@/data/products";
import { productPath } from "@/data/products";
import { site } from "@/data/site";
import { formatPrice } from "@/lib/currency";
import { cn } from "@/lib/utils";

const iconButton =
  "press grid size-11 place-items-center rounded-pill text-fg hover:bg-card";

const pillLink =
  "flex h-11 items-center rounded-pill px-4 text-sm hover:bg-card aria-[current=page]:bg-fg aria-[current=page]:text-bg";

/** True when this department's page is the one on screen. */
function departmentIsCurrent(pathname: string, href: string) {
  return pathname === href;
}

function DesktopMenu() {
  const pathname = usePathname();
  const [openHref, setOpenHref] = useState<string | null>(null);
  const closeTimer = useRef<number | null>(null);

  const cancelClose = () => {
    if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };

  const open = (href: string) => {
    cancelClose();
    setOpenHref(href);
  };

  // A short delay so the pointer can cross the gap into the dropdown.
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpenHref(null), 180);
  };

  useEffect(() => cancelClose, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenHref(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {menu.map((department) => (
        <DepartmentMenu
          key={department.href}
          department={department}
          current={departmentIsCurrent(pathname, department.href)}
          open={openHref === department.href}
          onOpen={() => open(department.href)}
          onClose={scheduleClose}
        />
      ))}
    </>
  );
}

function DepartmentMenu({
  department,
  current,
  open,
  onOpen,
  onClose,
}: {
  department: MenuDepartment;
  current: boolean;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const panelId = useId();

  return (
    <div className="relative" onMouseEnter={onOpen} onMouseLeave={onClose}>
      <Link
        href={department.href}
        aria-current={current ? "page" : undefined}
        aria-expanded={open}
        aria-controls={panelId}
        className={pillLink}
        onFocus={onOpen}
        onBlur={(event) => {
          const next = event.relatedTarget;
          if (!(next instanceof Node) || !event.currentTarget.parentElement?.contains(next)) {
            onClose();
          }
        }}
      >
        {department.label}
      </Link>
      <div
        id={panelId}
        hidden={!open}
        className={cn(
          "absolute left-0 top-full z-50 pt-3",
          open && "animate-fade-in",
        )}
        onMouseEnter={onOpen}
      >
        <ul className="min-w-52 rounded-photo bg-panel p-2 shadow-lift">
          {department.items.map((item) => (
            <li key={item.slug}>
              <Link
                href={categoryHref(department, item.slug)}
                className="block rounded-pill px-4 py-2.5 text-sm hover:bg-card"
                onClick={onClose}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function MobileMenu({ onNavigate }: { onNavigate: () => void }) {
  const pathname = usePathname();
  const [openHref, setOpenHref] = useState<string | null>(pathname);

  return (
    <nav aria-label="Menu" className="flex min-h-full flex-col gap-2 px-4 pb-8 pt-2">
      <Link href="/new-arrivals" onClick={onNavigate} className="font-display border-b border-line py-3 text-[40px] leading-none">
        New arrivals
      </Link>
      {menu.map((department) => {
        const expanded = openHref === department.href;
        const panelId = `${department.href}-mobile`;
        return (
          <div key={department.href} className="border-b border-line">
            <div className="flex items-center">
              <Link
                href={department.href}
                aria-current={departmentIsCurrent(pathname, department.href) ? "page" : undefined}
                onClick={onNavigate}
                className="font-display flex-1 py-3 text-[40px] leading-none"
              >
                {department.label}
              </Link>
              <button
                type="button"
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => setOpenHref(expanded ? null : department.href)}
                className="press grid size-11 place-items-center rounded-pill text-sm"
              >
                {expanded ? "Hide" : "Show"}
                <span className="sr-only"> {department.label} categories</span>
              </button>
            </div>
            {expanded ? (
              <ul id={panelId} className="flex flex-col gap-1 pb-4">
                <li>
                  <Link
                    href={department.href}
                    onClick={onNavigate}
                    className="block rounded-pill px-3 py-2 text-sm hover:bg-card"
                  >
                    All {department.label.toLowerCase()}
                  </Link>
                </li>
                {department.items.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={categoryHref(department, item.slug)}
                      onClick={onNavigate}
                      className="block rounded-pill px-3 py-2 text-sm hover:bg-card"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        );
      })}
      <div className="mt-6 grid grid-cols-2 gap-2">
        <Link
          href="/login"
          onClick={onNavigate}
          className="press grid h-[52px] place-items-center rounded-pill bg-fg font-semibold text-bg"
        >
          Sign in
        </Link>
        <Link
          href="/register"
          onClick={onNavigate}
          className="press grid h-[52px] place-items-center rounded-pill border border-fg font-medium"
        >
          Create account
        </Link>
      </div>
    </nav>
  );
}

function SearchPanel({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const matches = products.filter((product) =>
    product.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="fixed inset-0 z-50 grid place-items-start bg-scrim px-4 pt-24" onClick={onClose}>
      <div
        role="dialog"
        aria-label="Search"
        className="w-full max-w-xl animate-fade-in rounded-photo-lg bg-panel p-4 shadow-lift"
        onClick={(event) => event.stopPropagation()}
      >
        <label className="flex items-center gap-3 rounded-field bg-field px-4">
          <SearchIcon />
          <span className="sr-only">Search products</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products"
            className="h-14 w-full bg-transparent text-[15px] outline-none"
          />
        </label>
        <ul className="mt-3 max-h-80 overflow-auto">
          {matches.slice(0, 8).map((product) => (
            <li key={product.id}>
              <Link
                href={productPath(product.id)}
                onClick={onClose}
                className="flex items-center justify-between rounded-pill px-3 py-2.5 text-sm hover:bg-card"
              >
                <span>{product.name}</span>
                <span className="tabular-nums text-muted">{formatPrice(product.price)}</span>
              </Link>
            </li>
          ))}
          {query.trim() && matches.length === 0 ? (
            <li className="px-3 py-4 text-sm text-muted">Nothing matches that name.</li>
          ) : null}
        </ul>
      </div>
    </div>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen && !searchOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen, searchOpen]);

  return (
    <>
      <header className="pointer-events-none sticky top-0 z-40 hidden justify-center px-8 pt-5 lg:flex">
        <nav
          aria-label="Main"
          className="pointer-events-auto flex items-center gap-2 rounded-pill bg-glass p-1.5 shadow-float backdrop-blur-[20px] backdrop-saturate-150"
        >
          <Link href="/" className="px-[18px] font-display text-[26px] font-extrabold leading-[44px]">
            {site.name}
          </Link>
          <Link href="/new-arrivals" aria-current={pathname === "/new-arrivals" ? "page" : undefined} className={pillLink}>
            New arrivals
          </Link>
          <DesktopMenu />
          <button type="button" aria-label="Search" onClick={() => setSearchOpen(true)} className={iconButton}>
            <SearchIcon />
          </button>
          <Link
            href="/wishlist"
            aria-label="Wishlist"
            aria-current={pathname === "/wishlist" ? "page" : undefined}
            className={cn(iconButton, "aria-[current=page]:bg-fg aria-[current=page]:text-bg")}
          >
            <HeartIcon />
          </Link>
          <Link href="/login" aria-label="Account" className={iconButton}>
            <UserIcon />
          </Link>
          <ThemeToggle />
          <Link
            href="/cart"
            className="press flex h-11 items-center whitespace-nowrap rounded-pill bg-fg px-[18px] text-sm font-semibold text-bg"
          >
            Cart
          </Link>
        </nav>
      </header>

      <header className="sticky top-0 z-50 flex h-14 items-center justify-between bg-bg pl-4 pr-2 lg:hidden">
        <Link href="/" className="font-display text-[26px] font-extrabold leading-none">
          {site.name}
        </Link>
        <div className="flex items-center">
          <ThemeToggle />
          <button type="button" aria-label="Search" onClick={() => setSearchOpen(true)} className={iconButton}>
            <SearchIcon />
          </button>
          <Link
            href="/cart"
            className="press mx-1 flex h-10 items-center whitespace-nowrap rounded-pill bg-fg px-3.5 text-13 font-semibold text-bg"
          >
            Cart
          </Link>
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className={iconButton}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </header>

      {menuOpen ? (
        <div className="fixed inset-x-0 bottom-0 top-14 z-40 overflow-auto bg-bg lg:hidden">
          <MobileMenu onNavigate={() => setMenuOpen(false)} />
        </div>
      ) : null}
      {searchOpen ? <SearchPanel onClose={() => setSearchOpen(false)} /> : null}
    </>
  );
}
