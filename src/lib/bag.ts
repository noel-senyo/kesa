"use client";

import { useSyncExternalStore } from "react";

/** One line in the cart, kept in this browser. */
export type BagLine = {
  productId: string;
  size: string;
  quantity: number;
};

const KEY = "kesa-bag";
const CHANGE = "kesa-bag-change";

let cachedRaw: string | null = null;
let cachedLines: BagLine[] = [];
let quiet = false;

function readLines(): BagLine[] {
  const raw = window.localStorage.getItem(KEY);
  if (raw === cachedRaw) return cachedLines;
  cachedRaw = raw;
  if (!raw) {
    cachedLines = [];
    return cachedLines;
  }
  try {
    const parsed = JSON.parse(raw) as BagLine[];
    cachedLines = Array.isArray(parsed)
      ? parsed.filter((line) => line.productId && line.size && line.quantity > 0)
      : [];
  } catch {
    cachedLines = [];
  }
  return cachedLines;
}

function write(lines: BagLine[]) {
  window.localStorage.setItem(KEY, JSON.stringify(lines));
  cachedRaw = window.localStorage.getItem(KEY);
  cachedLines = lines;
  window.dispatchEvent(new Event(CHANGE));
}

export function bagSnapshot() {
  return readLines().map((line) => ({ ...line }));
}

export function isBagQuiet() {
  return quiet;
}

/** Replaces the cart without sending it back to the account. */
export function replaceBag(lines: BagLine[]) {
  quiet = true;
  write(lines);
  quiet = false;
}

export function onBagChange(listener: () => void) {
  window.addEventListener(CHANGE, listener);
  return () => window.removeEventListener(CHANGE, listener);
}

export function addToBag(productId: string, size: string) {
  const lines = readLines().map((line) => ({ ...line }));
  const existing = lines.find((line) => line.productId === productId && line.size === size);
  if (existing) existing.quantity += 1;
  else lines.push({ productId, size, quantity: 1 });
  write(lines);
}

export function removeFromBag(productId: string, size: string) {
  write(readLines().filter((line) => line.productId !== productId || line.size !== size));
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function useBag() {
  return useSyncExternalStore(subscribe, readLines, () => []);
}
