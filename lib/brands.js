import { supabase } from "./supabase";
import { rootFamily } from "./families";

// Depth of the profile behind each card. Derived from the data itself rather
// than hand-maintained lists: a deep-dive has a populated timeline, any
// enriched house has a philosophy headline.
function tierOf(brand) {
  if (Array.isArray(brand.timeline) && brand.timeline.length > 0) return "deep";
  if (brand.philosophy?.headline) return "tier2";
  return "basic";
}

const noteList = (v) => (Array.isArray(v) ? v : v ? [v] : []);

function allNotes(notes) {
  if (!notes) return [];
  return [...noteList(notes.top), ...noteList(notes.heart), ...noteList(notes.base)];
}

// How much of a house's output sits in each family, as a share of its fragrances.
// Used both for the fingerprint bar and for finding neighbouring houses.
function familyProfile(families) {
  const total = families.length;
  if (!total) return {};
  const counts = {};
  for (const f of families) counts[f] = (counts[f] || 0) + 1;
  const profile = {};
  for (const [f, n] of Object.entries(counts)) profile[f] = n / total;
  return profile;
}

// Histogram intersection: how much two houses' family profiles overlap, 0 to 1.
// Chosen over "shares a dominant family" because it accounts for proportion —
// a house that is 80% incense is a closer neighbour to another 80% incense house
// than to one that merely has incense somewhere in its range.
function profileOverlap(a, b) {
  let score = 0;
  for (const [f, share] of Object.entries(a)) {
    if (b[f]) score += Math.min(share, b[f]);
  }
  return score;
}

async function fetchAll() {
  const [{ data: brands, error }, { data: perfumes, error: pErr }] = await Promise.all([
    supabase
      .from("brands")
      .select("id, name, category, origin, description, timeline, philosophy, display_order")
      .order("display_order", { ascending: true, nullsFirst: false }),
    supabase
      .from("perfumes")
      .select("brand_id, name, family, notes")
      .order("sort_order", { ascending: true }),
  ]);

  if (error) throw error;
  if (pErr) throw pErr;

  const byBrand = new Map();
  for (const p of perfumes ?? []) {
    if (!byBrand.has(p.brand_id)) byBrand.set(p.brand_id, []);
    byBrand.get(p.brand_id).push(p);
  }
  return { brands: brands ?? [], byBrand };
}

// Everything the home page needs, in the curated display order held by
// brands.display_order. Each house also carries a compact search index so the
// box can match on fragrance names, notes, families and origin — not just the
// house name — and can say which fragrance caused the match.
export async function getBrands() {
  const { brands, byBrand } = await fetchAll();

  return brands.map((b) => {
    const own = byBrand.get(b.id) ?? [];
    return {
      id: b.id,
      name: b.name,
      category: b.category,
      origin: b.origin,
      desc: b.description,
      tier: tierOf(b),
      families: own.map((p) => rootFamily(p.family)),
      perfumes: own.map((p) => ({
        name: p.name,
        family: rootFamily(p.family),
        // Lowercased once here so the client filter never re-lowercases per keystroke.
        haystack: [p.name, p.family, ...allNotes(p.notes)].join(" ").toLowerCase(),
      })),
      haystack: [b.name, b.origin, b.description, b.category].filter(Boolean).join(" ").toLowerCase(),
    };
  });
}

// The three houses whose fragrance output most resembles this one's.
// Returns [] when the house has no fragrances to compare.
export async function getRelatedHouses(brandId, limit = 3) {
  const { brands, byBrand } = await fetchAll();

  const profiles = new Map();
  for (const b of brands) {
    const fams = (byBrand.get(b.id) ?? []).map((p) => rootFamily(p.family));
    profiles.set(b.id, { profile: familyProfile(fams), families: fams });
  }

  const self = profiles.get(brandId);
  if (!self || !self.families.length) return [];

  return brands
    .filter((b) => b.id !== brandId && profiles.get(b.id).families.length > 0)
    .map((b) => ({
      id: b.id,
      name: b.name,
      origin: b.origin,
      category: b.category,
      families: profiles.get(b.id).families,
      score: profileOverlap(self.profile, profiles.get(b.id).profile),
    }))
    .filter((b) => b.score > 0)
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
    .slice(0, limit);
}
