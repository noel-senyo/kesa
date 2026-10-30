import { cn } from "@/lib/utils";

const base =
  "press inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-pill font-semibold transition-[transform,background-color,color,opacity] duration-120 ease-out disabled:pointer-events-none disabled:opacity-65";

const variants = {
  default: "bg-fg text-bg hover:bg-hover",
  secondary: "border border-fg bg-transparent font-medium text-fg hover:bg-card",
} as const;

const sizes = {
  default: "h-14 px-[26px] text-[15px]",
} as const;

/** Pill classes shared by buttons and links that should look like buttons. */
export function buttonClass(options?: {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
}) {
  return cn(base, variants[options?.variant ?? "default"], sizes[options?.size ?? "default"]);
}
