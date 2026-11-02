"use client";

import { type FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { PasswordField } from "@/components/auth/PasswordField";
import Link from "@/components/ui/link";
import { buttonClass } from "@/components/ui/button-classes";
import { Input } from "@/components/ui/input";
import { saveShopper, useShopper } from "@/lib/shopper";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { isSupabaseConfigured } from "@/lib/supabase/env";

type Door = "client" | "staff";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shopper = useShopper();
  const [door, setDoor] = useState<Door>("client");
  const [clientError, setClientError] = useState<string | null>(null);
  const [staffError, setStaffError] = useState<string | null>(null);
  const [pending, setPending] = useState<Door | null>(null);
  const redirect = safePath(searchParams.get("redirect"));

  useEffect(() => {
    if (window.location.hash === "#staff") setDoor("staff");
  }, []);

  const show = (next: Door) => {
    setDoor(next);
    const params = redirect === "/" ? "" : `?redirect=${encodeURIComponent(redirect)}`;
    window.history.replaceState(null, "", `/login${params}${next === "staff" ? "#staff" : ""}`);
  };

  const handleClient = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");

    if (!email || !password) {
      setClientError("Invalid email or password");
      return;
    }

    if (!isSupabaseConfigured()) {
      const name = shopper?.email === email && shopper.name ? shopper.name : email.split("@")[0];
      saveShopper({ name, email });
      router.push(redirect);
      return;
    }

    const supabase = createBrowserSupabase();
    if (!supabase) return;
    setPending("client");
    const { error: signError } = await supabase.auth.signInWithPassword({ email, password });
    setPending(null);
    if (signError) {
      setClientError("Invalid email or password");
      return;
    }
    await fetch("/api/account/promote", { method: "POST" });
    router.push(redirect);
    router.refresh();
  };

  const handleStaff = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");
    const supabase = createBrowserSupabase();
    if (!supabase) {
      setStaffError("Add the Supabase URL and anon key first.");
      return;
    }
    if (!email || !password) {
      setStaffError("Invalid email or password");
      return;
    }
    setPending("staff");
    const { error: signError } = await supabase.auth.signInWithPassword({ email, password });
    if (signError) {
      setPending(null);
      setStaffError("Invalid email or password");
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
      setPending(null);
      setStaffError("This account cannot open the dashboard.");
      return;
    }
    router.push("/admin");
    router.refresh();
  };

  const registerHref = redirect === "/" ? "/register" : `/register?redirect=${encodeURIComponent(redirect)}`;
  const client = door === "client";

  return (
    <section className="mx-auto flex w-full max-w-[460px] flex-col justify-center">
      <span aria-hidden="true" className="mb-6 font-display text-[88px] leading-[0.8] lg:hidden">
        Hello again
      </span>
      <div className="mb-6 grid grid-cols-2 gap-2" role="tablist" aria-label="Sign in as">
        <button
          type="button"
          role="tab"
          aria-selected={client}
          onClick={() => show("client")}
          className={doorClass(client)}
        >
          Client
        </button>
        <button
          type="button"
          role="tab"
          id="staff"
          aria-selected={!client}
          onClick={() => show("staff")}
          className={doorClass(!client)}
        >
          Staff
        </button>
      </div>
      <h1 className="text-[30px] font-semibold tracking-[-0.02em]">{client ? "Welcome back" : "Dashboard"}</h1>
      <p className="mb-6 mt-1.5 text-muted">
        {client
          ? "Sign in with your email and password to access your account."
          : "Staff sign-in opens the inventory."}
      </p>
      {client ? (
        <>
          <form className="flex flex-col gap-4" onSubmit={handleClient} noValidate>
            {clientError ? <FormError message={clientError} /> : null}
            <Fields idPrefix="client" emailDefault={shopper?.email} invalid={Boolean(clientError)} />
            <button type="submit" disabled={pending !== null} className={`${buttonClass()} mt-1.5 w-full text-base`}>
              {pending === "client" ? "Signing in" : "Sign in"}
            </button>
          </form>
          <p className="mt-6 text-sm">
            Don&apos;t have an account?{" "}
            <Link href={registerHref} className="font-semibold underline underline-offset-[3px]">
              Create one here
            </Link>
          </p>
        </>
      ) : (
        <form className="flex flex-col gap-4" onSubmit={handleStaff} noValidate>
          {staffError ? <FormError message={staffError} /> : null}
          <Fields idPrefix="staff" invalid={Boolean(staffError)} />
          <button type="submit" disabled={pending !== null} className={`${buttonClass()} mt-1.5 w-full text-base`}>
            {pending === "staff" ? "Signing in" : "Sign in to dashboard"}
          </button>
        </form>
      )}
    </section>
  );
}

function doorClass(selected: boolean) {
  return selected
    ? "press h-14 rounded-pill bg-fg text-base font-semibold text-bg"
    : "press h-14 rounded-pill border border-fg text-base font-semibold";
}

function Fields({
  idPrefix,
  emailDefault,
  invalid,
}: {
  idPrefix: string;
  emailDefault?: string;
  invalid: boolean;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${idPrefix}-email`} className="text-sm font-medium">
          Email
        </label>
        <Input
          id={`${idPrefix}-email`}
          name="email"
          type="email"
          placeholder="name@example.com"
          autoComplete={idPrefix === "staff" ? "username" : "email"}
          required
          aria-invalid={invalid || undefined}
          defaultValue={emailDefault}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${idPrefix}-password`} className="text-sm font-medium">
          Password
        </label>
        <PasswordField
          id={`${idPrefix}-password`}
          name="password"
          autoComplete="current-password"
          required
          aria-invalid={invalid || undefined}
        />
      </div>
    </div>
  );
}

export function FormError({ message }: { message: string }) {
  return (
    <div role="alert" className="flex items-start gap-2.5 rounded-field bg-err-bg px-3.5 py-3 text-sm text-err-fg">
      <svg aria-hidden="true" className="mt-0.5 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 14h-2v-2h2v2Zm0-4h-2V7h2v5Z" />
      </svg>
      <p>{message}</p>
    </div>
  );
}

/** Only a path on this site is a safe place to send someone after sign-in. */
export function safePath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}
