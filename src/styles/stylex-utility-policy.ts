export function isSafeStyleXUtility(utility: string, supportedUtilities: ReadonlySet<string>) {
  if (!supportedUtilities.has(utility) || utility === "dark") return false;

  if (utility.startsWith("[") || utility.startsWith("*")) return false;

  const variantSeparator = utility.indexOf(":");
  const baseUtility = variantSeparator === -1 ? utility : utility.slice(variantSeparator + 1);

  // Tailwind's space utilities target the children of the element carrying the
  // class. Treating their declarations as a StyleX style on the parent changes
  // the layout, so these stay in the precompiled compatibility stylesheet.
  if (/^-?space-[xy]-/.test(baseUtility)) return false;

  if (variantSeparator === -1) return true;

  const variant = utility.slice(0, variantSeparator);
  const value = utility.slice(variantSeparator + 1);
  return ["sm", "md", "lg", "xl", "2xl"].includes(variant) && !value.includes(":");
}
