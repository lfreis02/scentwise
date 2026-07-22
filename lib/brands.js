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

// Everything the home page needs, in the curated display order held by
// brands.display_order. Perfume names come along so the search box can match
// on them.
export async function getBrands() {
  const [{ data: brands, error }, { data: perfumes }] = await Promise.all([
    supabase
      .from("brands")
      .select("id, name, category, origin, description, timeline, philosophy, display_order")
      .order("display_order", { ascending: true, nullsFirst: false }),
    supabase.from("perfumes").select("brand_id, name, family").order("sort_order", { ascending: true }),
  ]);

  if (error) throw error;

  const byBrand = new Map();
  for (const p of perfumes ?? []) {
    if (!byBrand.has(p.brand_id)) byBrand.set(p.brand_id, []);
    byBrand.get(p.brand_id).push(p);
  }

  return (brands ?? []).map((b) => {
    const own = byBrand.get(b.id) ?? [];
    return {
      id: b.id,
      name: b.name,
      category: b.category,
      origin: b.origin,
      desc: b.description,
      tier: tierOf(b),
      perfumes: own.map((p) => ({ name: p.name })),
      // The card's fingerprint bar: this house's fragrances in order, as family roots.
      families: own.map((p) => rootFamily(p.family)),
    };
  });
}
