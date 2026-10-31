"use client";

import { useSyncExternalStore } from "react";

import { reconcileBag, watchBag } from "@/lib/cart-sync";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { isSupabaseConfigured } from "@/lib/supabase/env";

/**
 * A shopper saved in this browser only. The template checks a real account
 * before it shows a bag or a wishlist. This stand-in does the same job
 * without a server: sign-in and sign-up write it, log-out clears it.
 * The password is never stored.
 */
export type Shopper = {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  role?: "customer" | "admin";
};

const KEY = "kesa-shopper";
const CHANGE = "kesa-shopper-change";

let cachedRaw: string | null = null;
let cachedShopper: Shopper | null = null;

function readShopper(): Shopper | null {
  const raw = window.localStorage.getItem(KEY);
  if (raw === cachedRaw) return cachedShopper;
  cachedRaw = raw;
  if (!raw) {
    cachedShopper = null;
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as Shopper;
    cachedShopper = parsed.email
      ? { name: parsed.name ?? "", email: parsed.email, phone: parsed.phone }
      : null;
  } catch {
    cachedShopper = null;
  }
  return cachedShopper;
}

function notify() {
  window.dispatchEvent(new Event(CHANGE));
}

export function saveShopper(shopper: Shopper) {
  window.localStorage.setItem(KEY, JSON.stringify(shopper));
  notify();
}

export function clearShopper() {
  window.localStorage.removeItem(KEY);
  notify();
}

let remote: Shopper | null = null;
let remoteStarted = false;

function applyRemote(shopper: Shopper | null) {
  remote = shopper;
  notify();
  if (shopper?.id) void reconcileBag();
}

function ensureRemote() {
  if (remoteStarted || !isSupabaseConfigured()) return;
  remoteStarted = true;
  watchBag();
  const supabase = createBrowserSupabase();
  if (!supabase) return;

  const load = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      applyRemote(null);
      return;
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, phone, role, email")
      .eq("id", user.id)
      .maybeSingle();
    applyRemote({
      id: user.id,
      name: profile?.full_name || String(user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "Shopper"),
      email: profile?.email || user.email || "",
      phone: profile?.phone || String(user.user_metadata?.phone ?? ""),
      role: profile?.role === "admin" ? "admin" : "customer",
    });
  };

  void load();
  supabase.auth.onAuthStateChange(() => {
    void load();
  });
}

function snapshot() {
  if (isSupabaseConfigured()) return remote;
  return readShopper();
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE, onChange);
  window.addEventListener("storage", onChange);
  ensureRemote();
  return () => {
    window.removeEventListener(CHANGE, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function useShopper() {
  return useSyncExternalStore(subscribe, snapshot, () => null);
}
