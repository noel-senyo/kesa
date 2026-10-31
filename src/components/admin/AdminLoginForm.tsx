"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { AuthShell } from "@/components/auth/AuthShell";
import { FormError } from "@/components/auth/LoginForm";
import { PasswordField } from "@/components/auth/PasswordField";
import { buttonClass } from "@/components/ui/button-classes";
import { Input } from "@/components/ui/input";
import { createBrowserSupabase } from "@/lib/supabase/browser";

export function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");
    const supabase = createBrowserSupabase();
    if (!supabase) {
      setError("Add the Supabase URL and anon key first.");
      return;
    }
    setPending(true);
    const { error: signError } = await supabase.auth.signInWithPassword({ email, password });
    if (signError) {
      setPending(false);
      setError("Invalid email or password");
      return;
    }
    await fetch("/api/account/promote", { method: "POST" });
    const { data: userData } = await supabase.auth.getUser();
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userData.user?.id ?? "")
      .maybeSingle();
    if (profile?.role !== "admin") {
      await supabase.auth.signOut();
      setPending(false);
      setError("This account is not an admin.");
      return;
    }
    router.push("/admin");
    router.refresh();
  };

  return (
    <AuthShell
      word="Admin"
      title="Inventory login"
      description="Only an admin account can change products and stock."
      footerText="Shopping instead?"
      footerHref="/login"
      footerLinkLabel="Customer sign in"
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        {error ? <FormError message={error} /> : null}
        <label className="flex flex-col gap-1.5 text-sm font-medium" htmlFor="admin-email">
          Email
          <Input id="admin-email" name="email" type="email" required autoComplete="username" />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium" htmlFor="admin-password">
          Password
          <PasswordField id="admin-password" name="password" autoComplete="current-password" required />
        </label>
        <button type="submit" disabled={pending} className={`${buttonClass()} mt-1.5 w-full text-base`}>
          {pending ? "Signing in" : "Sign in"}
        </button>
      </form>
    </AuthShell>
  );
}
