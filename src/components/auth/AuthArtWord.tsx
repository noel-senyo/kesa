"use client";

import { useSelectedLayoutSegment } from "next/navigation";

/** "Hello again" on sign-in, "Join" on sign-up. */
export function AuthArtWord() {
  const segment = useSelectedLayoutSegment();
  return <>{segment === "register" ? "Join" : "Hello again"}</>;
}
