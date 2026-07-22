// Olfactory families are free text on `perfumes.family` (40+ variants that overlap:
// "Woody", "Woody Spicy", "Oriental Woody"). Everything visual keys off a small set of
// roots derived from those strings, so the colour always means something.
//
// Order matters: the first match wins, and the more specific families are tested first.
// "Amber Floral" is an amber, "Incense Spicy" is an incense.

export const FAMILIES = [
  "floral", "woody", "amber", "citrus",
  "incense", "chypre", "leather", "aromatic",
];

export const FAMILY_LABEL = {
  floral: "Floral", woody: "Woody", amber: "Amber", citrus: "Citrus",
  incense: "Incense", chypre: "Chypre", leather: "Leather", aromatic: "Aromatic",
};

export function rootFamily(family) {
  if (!family) return "woody";
  const f = family.toLowerCase();
  if (f.includes("incense") || f.includes("resin")) return "incense";
  if (f.includes("leather")) return "leather";
  if (f.includes("chypre")) return "chypre";
  if (f.includes("citrus")) return "citrus";
  if (f.includes("amber") || f.includes("oriental")) return "amber";
  if (f.includes("floral")) return "floral";
  if (f.includes("aromatic") || f.includes("fougere") || f.includes("fougère")) return "aromatic";
  if (f.includes("musk") || f.includes("vanilla") || f.includes("gourmand")) return "amber";
  return "woody";
}

// Fill tone, for bars and chips.
export const famFill = (root) => `var(--fam-${root})`;
// Darkened tone, for the same family rendered as text. Every one of these clears
// WCAG AA (4.5:1) on --paper; the fill tones do not, which is why there are two.
export const famText = (root) => `var(--fam-${root}-t)`;
