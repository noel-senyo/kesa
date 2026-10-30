"use client";

import { forwardRef, useState, type InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

/** Password field with a show / hide control, matching the template's input group. */
export const PasswordField = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, disabled, placeholder, ...props }, ref) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className={cn(
        "flex h-[52px] items-center overflow-hidden rounded-field border border-line bg-field transition-[border-color,box-shadow] duration-120 ease-out focus-within:border-fg focus-within:shadow-[0_0_0_4px_var(--ring)] has-[[aria-invalid=true]]:border-err-line",
        className,
      )}
    >
      <input
        {...props}
        ref={ref}
        disabled={disabled}
        type={visible ? "text" : "password"}
        placeholder={placeholder ?? "Password"}
        className="h-full w-full bg-transparent px-[18px] text-[15px] text-fg outline-none disabled:cursor-not-allowed disabled:opacity-65"
      />
      <button
        type="button"
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        disabled={disabled}
        onClick={() => setVisible((current) => !current)}
        className="press grid size-11 shrink-0 place-items-center text-muted hover:text-fg disabled:opacity-65"
      >
        {visible ? <EyeOpen /> : <EyeClosed />}
      </button>
    </div>
  );
});

PasswordField.displayName = "PasswordField";

function EyeOpen() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeClosed() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3l18 18" />
      <path d="M10.5 6.2A10.7 10.7 0 0 1 12 6c6 0 10 6 10 6a18.5 18.5 0 0 1-4.1 4.6" />
      <path d="M6.1 6.1C3.5 7.8 2 12 2 12s4 6 10 6c1.6 0 3-.4 4.2-1" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </svg>
  );
}
