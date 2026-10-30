import Link from "@/components/ui/link";
import type { ReactNode } from "react";

/**
 * The form column of sign-in and sign-up. On a phone the giant word sits
 * above the form. On a desktop it lives in the ink panel beside it.
 */
export function AuthShell({
  word,
  title,
  description,
  footerText,
  footerHref,
  footerLinkLabel,
  children,
}: {
  word: string;
  title: string;
  description: string;
  footerText: string;
  footerHref: string;
  footerLinkLabel: string;
  children: ReactNode;
}) {
  return (
    <section className="mx-auto flex w-full max-w-[460px] flex-col justify-center">
      <span aria-hidden="true" className="mb-6 font-display text-[88px] leading-[0.8] lg:hidden">
        {word}
      </span>
      <h1 className="text-[30px] font-semibold tracking-[-0.02em]">{title}</h1>
      <p className="mb-6 mt-1.5 text-muted">{description}</p>
      {children}
      <p className="mt-6 text-sm">
        {footerText}{" "}
        <Link href={footerHref} className="font-semibold underline underline-offset-[3px]">
          {footerLinkLabel}
        </Link>
      </p>
    </section>
  );
}
