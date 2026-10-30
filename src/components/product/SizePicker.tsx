"use client";

import { cn } from "@/lib/utils";

/**
 * Size pills. The ink capsule slides to the chosen size.
 * Sizes this piece does not stock are dashed and cannot be chosen.
 */
export function SizePicker({
  options,
  available,
  value,
  onChange,
  compact = false,
}: {
  options: readonly string[];
  available: readonly string[];
  value: string | undefined;
  onChange: (size: string) => void;
  compact?: boolean;
}) {
  const index = value ? options.indexOf(value) : -1;
  const gap = compact ? 5 : 6;
  const count = options.length;
  const inStock = new Set(available);

  return (
    <div
      role="group"
      aria-label="Size"
      className="relative grid"
      style={{ gap, gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
    >
      {index >= 0 ? (
        <span
          aria-hidden="true"
          className={cn(
            "absolute left-0 top-0 rounded-pill bg-fg transition-transform duration-220 ease-in-out motion-reduce:transition-none",
            compact ? "h-11" : "h-11 lg:h-[52px]",
          )}
          style={{
            width: `calc((100% - ${gap * (count - 1)}px) / ${count})`,
            transform: `translateX(calc(${index} * (100% + ${gap}px)))`,
          }}
        />
      ) : null}
      {options.map((size) => {
        const stocked = inStock.has(size);
        const selected = size === value;
        return (
          <button
            key={size}
            type="button"
            disabled={!stocked}
            aria-pressed={selected}
            onClick={() => onChange(size)}
            className={cn(
              "press relative rounded-pill border transition-[color,transform] duration-220 ease-in-out",
              compact ? "h-11 text-13" : "h-11 text-13 lg:h-[52px] lg:text-sm",
              selected
                ? "border-transparent text-bg"
                : stocked
                  ? "border-line text-fg hover:border-fg"
                  : "border-dashed border-line text-fg line-through opacity-65",
            )}
          >
            {size}
          </button>
        );
      })}
    </div>
  );
}
