"use client";

import { type FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { AuthShell } from "@/components/auth/AuthShell";
import { FormError, safePath } from "@/components/auth/LoginForm";
import { PasswordField } from "@/components/auth/PasswordField";
import { buttonClass } from "@/components/ui/button-classes";
import { Input } from "@/components/ui/input";
import { saveShopper } from "@/lib/shopper";

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const redirect = safePath(searchParams.get("redirect"));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");

    if (!name || !email || password.length < 8) {
      setError("Could not create the account. Check the form and try again.");
      return;
    }

    saveShopper({ name, email });
    router.push(redirect);
  };

  return (
    <AuthShell
      word="Join"
      title="Create your account"
      description="Create your account in seconds with your email and password."
      footerText="Already have an account?"
      footerHref={redirect === "/" ? "/login" : `/login?redirect=${encodeURIComponent(redirect)}`}
      footerLinkLabel="Sign in here"
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        {error ? <FormError message={error} /> : null}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="register-name" className="text-sm font-medium">
              Full name
            </label>
            <Input
              id="register-name"
              name="name"
              type="text"
              required
              placeholder="Alex Morgan"
              autoComplete="name"
              aria-invalid={Boolean(error) || undefined}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="register-email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="register-email"
              name="email"
              type="email"
              required
              placeholder="name@example.com"
              autoComplete="email"
              aria-invalid={Boolean(error) || undefined}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between">
              <label htmlFor="register-password" className="text-sm font-medium">
                Password
              </label>
              <span id="register-password-hint" className="text-13 text-muted">
                At least 8 characters
              </span>
            </div>
            <PasswordField
              id="register-password"
              name="password"
              autoComplete="new-password"
              aria-describedby="register-password-hint"
              required
              minLength={8}
              aria-invalid={Boolean(error) || undefined}
            />
          </div>
        </div>
        <button type="submit" className={`${buttonClass()} mt-1.5 w-full text-base`}>
          Create account
        </button>
      </form>
    </AuthShell>
  );
}
