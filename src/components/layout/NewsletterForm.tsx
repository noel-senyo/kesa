"use client";

import { type FormEvent, useState } from "react";

/** A note for this browser only. There is no mailing list behind it. */
export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;
    setJoined(true);
  };

  if (joined) {
    return (
      <p className="text-sm text-white/80" role="status">
        You&apos;re on the list. We&apos;ll write when there&apos;s something new.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <label htmlFor="footer-email" className="sr-only">
        Email
      </label>
      <div className="flex overflow-hidden rounded-pill bg-white/10 focus-within:bg-white/15">
        <input
          id="footer-email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email address"
          autoComplete="email"
          className="h-12 min-w-0 flex-1 bg-transparent px-4 text-sm text-white outline-none placeholder:text-white/45"
        />
        <button type="submit" className="press px-4 text-sm font-semibold text-white">
          Join
        </button>
      </div>
    </form>
  );
}
