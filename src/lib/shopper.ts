"use client";

import { useSyncExternalStore } from "react";

/**
 * A shopper saved in this browser only. The template checks a real account
 * before it shows a bag or a wishlist. This stand-in does the same job
 * without a server: sign-in and sign-up write it, log-out clears it.
 * The password is never stored.
 */
export type Shopper = {
  name: string;
  email: string;
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
    cachedShopper = parsed.email ? { name: parsed.name ?? "", email: parsed.email } : null;
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

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function useShopper() {
  return useSyncExternalStore(subscribe, readShopper, () => null);
}
