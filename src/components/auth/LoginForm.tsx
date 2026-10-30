"use client";

import { type FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { AuthShell } from "@/components/auth/AuthShell";
import { PasswordField } from "@/components/auth/PasswordField";
import { buttonClass } from "@/components/ui/button-classes";
import { Input } from "@/components/ui/input";
import { saveShopper, useShopper } from "@/lib/shopper";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shopper = useShopper();
  const [error, setError] = useState<string | null>(null);
  const redirect = safePath(searchParams.get("redirect"));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");

    if (!email || !password) {
      setError("Invalid email or password");
      return;
    }

    const name = shopper?.email === email && shopper.name ? shopper.name : email.split("@")[0];
    saveShopper({ name, email });
    router.push(redirect);
  };

  return (
    <AuthShell
      word="Hello again"
      title="Welcome back"
      description="Sign in with your email and password to access your account."
      footerText="Don't have an account?"
      footerHref={redirect === "/" ? "/register" : `/register?redirect=${encodeURIComponent(redirect)}`}
      footerLinkLabel="Create one here"
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        {error ? <FormError message={error} /> : null}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="login-email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="login-email"
              name="email"
              type="email"
              placeholder="name@example.com"
              autoComplete="email"
              required
              aria-invalid={Boolean(error) || undefined}
              defaultValue={shopper?.email}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="login-password" className="text-sm font-medium">
              Password
            </label>
            <PasswordField
              id="login-password"
              name="password"
              autoComplete="current-password"
              required
              aria-invalid={Boolean(error) || undefined}
            />
          </div>
        </div>
        <button type="submit" className={`${buttonClass()} mt-1.5 w-full text-base`}>
          Sign in
        </button>
      </form>
    </AuthShell>
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
