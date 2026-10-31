const MTN = new Set(["024", "025", "053", "054", "055", "059"]);
const TELECEL = new Set(["020", "050"]);
const AT = new Set(["026", "027", "056", "057"]);

/** A Ghana mobile number as 0XXXXXXXXX, or null when it is not one. */
export function normalizeGhanaPhone(input: string) {
  const digits = input.replace(/[^\d]/g, "");
  let local = digits;
  if (local.startsWith("233")) local = `0${local.slice(3)}`;
  if (!/^0\d{9}$/.test(local)) return null;
  return local;
}

export function toE164(local: string) {
  return `+233${local.slice(1)}`;
}

/** Moolre channel: 13 MTN, 6 Telecel, 7 AT. */
export function momoChannel(local: string) {
  const prefix = local.slice(0, 3);
  if (MTN.has(prefix)) return "13";
  if (TELECEL.has(prefix)) return "6";
  if (AT.has(prefix)) return "7";
  return null;
}
