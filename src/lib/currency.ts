const formatter = new Intl.NumberFormat("en-GH", {
  style: "currency",
  currency: "GHS",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Turn a plain number of cedis into a price, for example GH₵ 450.00.
 * Intl supplies the symbol for en-GH. The space after it is added here
 * so every price reads the same.
 */
export function formatPrice(amount: number) {
  const parts = formatter.formatToParts(amount);
  const symbol = parts.find((part) => part.type === "currency")?.value ?? "GH₵";
  const number = parts
    .filter((part) => part.type === "integer" || part.type === "group" || part.type === "decimal" || part.type === "fraction")
    .map((part) => part.value)
    .join("");
  return `${symbol} ${number}`;
}
