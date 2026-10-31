import Link from "@/components/ui/link";
import { redirect } from "next/navigation";

import { SignOutButton } from "@/components/account/SignOutButton";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata = { title: "Account" };

export default async function AccountPage() {
  if (!isSupabaseConfigured()) redirect("/login");
  const supabase = await createClient();
  if (!supabase) redirect("/login");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/account");

  const { data: profile } = await supabase.from("profiles").select("full_name, email, phone, role").eq("id", user.id).maybeSingle();

  return (
    <section className="flex max-w-xl flex-col gap-6 py-12">
      <h1 className="font-display text-[72px] leading-none">Account</h1>
      <p className="text-lg">{profile?.full_name || user.email}</p>
      <p className="text-sm text-muted">{profile?.email || user.email}</p>
      {profile?.phone ? <p className="text-sm text-muted">{profile.phone}</p> : null}
      <div className="flex flex-wrap gap-3">
        <Link href="/orders" className="underline underline-offset-[3px]">
          My orders
        </Link>
        {profile?.role === "admin" ? (
          <Link href="/admin" className="underline underline-offset-[3px]">
            Inventory
          </Link>
        ) : null}
      </div>
      <SignOutButton />
    </section>
  );
}
