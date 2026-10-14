// =============================================================
// ScentWise - data integrity check
// =============================================================
// Codifies the invariants that the catalogue must always hold, so they
// stop depending on someone remembering to run them by hand.
//
// Run: npm run check:data
//
// Deliberately framework-agnostic: plain Node + @supabase/supabase-js,
// reads the SELECT-only anon key from .env.local. It talks to PostgREST
// (the same door the app uses), not the direct Postgres pooler, so it
// works even when admin SQL tooling is unavailable.
//
// Exit code 0 = all hard checks pass. Exit code 1 = at least one failed.
// Warnings never fail the run; they are printed for human review.
// =============================================================

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");

// --- load env from .env.local without adding a dotenv dependency ---
function loadEnv() {
  const env = {};
  try {
    const raw = readFileSync(join(ROOT, ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch {
    // fall through to process.env (e.g. in CI)
  }
  return {
    url: env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
    key: env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };
}

// Accent- and case-insensitive key, matching the rule that a plain
// lower(name) comparison has previously let duplicates through.
const norm = (s) =>
  (s || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip combining accent marks
    .toLowerCase()
    .trim();

const fails = [];
const warns = [];
const fail = (msg) => fails.push(msg);
const warn = (msg) => warns.push(msg);

async function main() {
  const { url, key } = loadEnv();
  if (!url || !key) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY (.env.local or env).");
    process.exit(2);
  }

  const db = createClient(url, key);

  const [{ data: brands, error: bErr }, { data: perfumes, error: pErr }] = await Promise.all([
    db.from("brands").select("id, name").range(0, 99999),
    db.from("perfumes").select("id, brand_id, name, family, notes, sort_order").range(0, 99999),
  ]);
  if (bErr) throw bErr;
  if (pErr) throw pErr;

  const brandIds = new Set(brands.map((b) => b.id));
  console.log(`Loaded ${brands.length} houses / ${perfumes.length} fragrances.\n`);

  // group perfumes by brand once
  const byBrand = new Map();
  for (const p of perfumes) {
    if (!byBrand.has(p.brand_id)) byBrand.set(p.brand_id, []);
    byBrand.get(p.brand_id).push(p);
  }

  // C1 - notes shape: top/heart/base must each be an array
  for (const p of perfumes) {
    const n = p.notes;
    const label = `${p.brand_id}/"${p.name}" (id ${p.id})`;
    if (!n || typeof n !== "object" || Array.isArray(n)) {
      fail(`notes is not an object: ${label}`);
      continue;
    }
    for (const tier of ["top", "heart", "base"]) {
      if (!Array.isArray(n[tier])) fail(`notes.${tier} is not an array: ${label}`);
    }
    const total = ["top", "heart", "base"].reduce(
      (s, t) => s + (Array.isArray(n[t]) ? n[t].length : 0),
      0
    );
    if (total === 0) warn(`all three note tiers empty: ${label}`);
  }

  // C2 - every fragrance has a family
  for (const p of perfumes) {
    if (!p.family || !String(p.family).trim()) {
      fail(`missing family: ${p.brand_id}/"${p.name}" (id ${p.id})`);
    }
  }

  // C3 - referential integrity: brand_id must exist
  for (const p of perfumes) {
    if (!brandIds.has(p.brand_id)) {
      fail(`orphan fragrance, unknown brand_id "${p.brand_id}": "${p.name}" (id ${p.id})`);
    }
  }

  // C4 - duplicate names within a house (accent/case-insensitive)
  for (const [brandId, list] of byBrand) {
    const seen = new Map();
    for (const p of list) {
      const k = norm(p.name);
      if (seen.has(k)) fail(`duplicate name in ${brandId}: "${p.name}" == "${seen.get(k)}"`);
      else seen.set(k, p.name);
    }
  }

  // C5 - duplicate sort_order within a house
  for (const [brandId, list] of byBrand) {
    const seen = new Map();
    for (const p of list) {
      if (p.sort_order == null) {
        warn(`null sort_order in ${brandId}: "${p.name}"`);
        continue;
      }
      if (seen.has(p.sort_order)) {
        fail(`duplicate sort_order ${p.sort_order} in ${brandId}: "${p.name}" and "${seen.get(p.sort_order)}"`);
      } else seen.set(p.sort_order, p.name);
    }
  }

  // C6 - prefix collisions within a house (WARN: often legitimate flankers)
  for (const [brandId, list] of byBrand) {
    const keys = list.map((p) => ({ name: p.name, k: norm(p.name) }));
    for (const a of keys) {
      for (const b of keys) {
        if (a === b) continue;
        if (b.k.startsWith(a.k + " ")) {
          warn(`prefix overlap in ${brandId}: "${a.name}" is a prefix of "${b.name}" (check they are distinct)`);
        }
      }
    }
  }

  // C7 - houses with zero fragrances (WARN: may be an intentional basic entry)
  for (const b of brands) {
    if (!byBrand.has(b.id)) warn(`house has no fragrances: ${b.id} (${b.name})`);
  }

  // --- report ---
  if (warns.length) {
    console.log(`WARNINGS (${warns.length}):`);
    for (const w of warns) console.log(`  - ${w}`);
    console.log("");
  }
  if (fails.length) {
    console.log(`FAILURES (${fails.length}):`);
    for (const f of fails) console.log(`  - ${f}`);
    console.log("");
    console.error(`FAILED: ${fails.length} hard check(s). See above.`);
    process.exit(1);
  }
  console.log(`OK: all hard checks pass${warns.length ? ` (${warns.length} warning(s) to review)` : ""}.`);
}

main().catch((e) => {
  console.error("check-data crashed:", e.message || e);
  process.exit(2);
});
