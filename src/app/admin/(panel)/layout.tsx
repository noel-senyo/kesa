import Link from "@/components/ui/link";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/actions";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) {
    return (
      <section className="mx-auto max-w-xl py-16">
        <h1 className="font-display text-5xl">Inventory</h1>
        <p className="mt-4 text-muted">Add the Supabase URL and anon key, then open admin login.</p>
      </section>
    );
  }

  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <section className="flex flex-col gap-8 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-[64px] leading-none">Inventory</h1>
        <nav className="flex gap-4 text-sm">
          <Link href="/admin" className="underline underline-offset-[3px]">
            Products
          </Link>
          <Link href="/admin/products/new" className="underline underline-offset-[3px]">
            Add a product
          </Link>
        </nav>
      </div>
      {children}
    </section>
  );
}
