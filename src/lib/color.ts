const solids: Record<string, string> = {
  black: "#1A1A1A",
  blue: "#6B8CAE",
  charcoal: "#3F434A",
  cream: "#EFE8D8",
  green: "#5D7B6F",
  grey: "#9CA3AF",
  gray: "#9CA3AF",
  olive: "#6B705C",
  sand: "#D8C7A8",
  tan: "#C4A574",
  taupe: "#A89880",
  white: "#F4F4F4",
};

/** A flat fill for a colour name, used by the swatches. */
export function swatchBackground(name: string) {
  const key = name.trim().toLowerCase();
  return solids[key] ?? "#6B7280";
}
