"use client";

import { useRouter } from "next/navigation";

import { clearShopper } from "@/lib/shopper";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { buttonClass } from "@/components/ui/button-classes";

export function SignOutButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      className={buttonClass({ variant: "secondary" })}
      onClick={async () => {
        const supabase = createBrowserSupabase();
        if (supabase) await supabase.auth.signOut();
        clearShopper();
        router.push("/");
        router.refresh();
      }}
    >
      Sign out
    </button>
  );
}
