@AGENTS.md

# ScentWise

## What this does
Live niche/luxury perfumery encyclopedia with an AI fragrance consultant.
Two surfaces: a brand encyclopedia (`/`, `/brands/[id]`) reading a Supabase
catalogue of houses and fragrances, and a chat consultant (`/api/consultant`)
that proxies to the Anthropic Messages API. Site copy is in English.

## Stack
- Next.js 16.2.9, App Router, React 19.2.4 (`package.json`)
- Tailwind CSS 4 (`@tailwindcss/postcss`) + `babel-plugin-react-compiler`
- Supabase JS client (`@supabase/supabase-js` 2.108.2, `@supabase/ssr`
  0.12.0) — Postgres + RLS, project id `iqfalqsflpqzizgepmtg`
- Fonts via `next/font/google`: Fraunces (display), Inter (body), IBM Plex
  Mono (technical) — wired in `app/layout.js`
- Vercel Web Analytics (`@vercel/analytics` 2.0.1) — `<Analytics />` in
  `app/layout.js`; only reports once Web Analytics is enabled for the
  project in the Vercel dashboard
- ESLint 9 / `eslint-config-next`
- `lucide-react` is a declared dependency but not imported anywhere in the
  code currently — unused

## Map
- `app/layout.js` — root layout, fonts, site metadata, Vercel Analytics
- `app/page.jsx` (9 lines) — home route, server component, `revalidate =
  60`, calls `getBrands()` and renders `HomeClient`
- `app/home-client.jsx` (574 lines, `"use client"`) — all home page
  interactivity: category filters, fragrance-aware search, the family
  primer, and the consultant chat widget (keeps last 20 turns client-side)
- `app/brands/[id]/page.jsx` (501 lines) — brand detail page, server
  component, `revalidate = 60`; fetches the brand, its perfumes, and
  related houses; throws on a query error instead of swallowing it
- `app/api/consultant/route.js` (128 lines) — the only route that costs
  money per call; validates and rate-limits, then proxies to the Anthropic
  Messages API
- `app/api/keepalive/route.js` (28 lines) — one-row read against
  `brands`, called daily by Vercel Cron so the free-tier Supabase project
  never pauses; returns `{ ok }` only, 503 if the read fails
- `vercel.json` — the cron schedule for `/api/keepalive` (`0 9 * * *`
  UTC; the Hobby plan allows at most one run per day)
- `app/error.jsx` (24 lines) — client-component error boundary, site-styled
- `app/not-found.jsx` (15 lines) — 404 page, site-styled
- `lib/supabase.js` (8 lines) — Supabase client, guarded by `server-only`
  (build fails if a client component ever imports it)
- `lib/brands.js` (122 lines) — all brand/fragrance data-shaping:
  `getBrands()` for the home page, `getRelatedHouses()` for the "houses
  that smell adjacent" section, family-overlap scoring
- `lib/families.js` (36 lines) — maps the free-text `perfumes.family`
  column onto 8 root families and their color tokens
- `app/globals.css` — design tokens (`--fam-*` family colors, `--paper` /
  `--ink` / etc.)
- `scripts/check-data.mjs` (177 lines) — plain-Node integrity check run
  by `npm run check:data`: notes shape, missing family, orphan
  fragrances, accent-insensitive duplicate names, duplicate `sort_order`;
  reads through the anon key, same door as the app

## Commands
- `npm run dev` — local dev server
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — ESLint
- `npm run check:data` — catalogue integrity check against the live DB
  (exit 1 on a hard failure; warnings never fail the run)

## Conventions
- **Supabase is the single source of truth.** No static brand/fragrance
  array exists in the repo — every house and fragrance is a DB row
  (`brands`, `perfumes`). Adding or editing content is a DB write, not a
  code change.
- **`perfumes.notes` is always a JSON array** (top/heart/base), never a
  comma-separated string — confirmed on all 739 rows currently in the
  table.
- **The consultant model is `claude-sonnet-4-6`**, hardcoded in
  `app/api/consultant/route.js`.
- **`/api/consultant` is rate-limited and shape-validated**: max 50
  messages per request, 2000 chars per message, 10 requests per IP per 10
  minutes (in-memory, per instance — resets per deploy/instance, not a
  hard guarantee), only the last 20 messages forwarded to the model,
  same-origin requests only.
- **The Supabase project is on the free tier and pauses after about a
  week without activity.** `/api/keepalive` + the cron in `vercel.json`
  exist only to prevent that — do not cache the route or remove the cron.
  If the project is ever `INACTIVE` anyway, restore it from the Supabase
  dashboard (or MCP `restore_project`); the data survives a pause.
- **`anon`/`authenticated` have SELECT-only privileges** on `brands` and
  `perfumes` (table-level write grants revoked; RLS enabled on both) —
  confirmed live in the DB. Any future write needs the `service_role` key,
  never the anon key.
- Required env vars (names only — values live in `.env.local`/Vercel,
  never in the repo): `NEXT_PUBLIC_SUPABASE_URL`,
  `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `ANTHROPIC_API_KEY`.

## State
- Catalogue currently at 77 houses / 739 fragrances (live count).
- All 5 code-reviewer findings from the last review round are closed:
  1. Cost/rate-limit bound on `/api/consultant` (`cd533c3`)
  2. `server-only` build tripwire on `lib/supabase.js` (`6febb8c`)
  3. Consultant chat history only advances on a completed reply (`fae9b2d`)
  4. Brand page's perfumes query now throws instead of silently rendering
     an empty house (`604f028`)
  5. `app/error.jsx` / `app/not-found.jsx` boundaries added (`604f028`)

## Do not
- Do not read or write `brands.aesthetic_theme` — the column still exists
  in the DB but no code references it; it's dead. All visual variety comes
  from per-fragrance family color (`lib/families.js`), not per-brand
  theming.
- Do not dedup fragrance names with a plain `lower(name)` comparison when
  writing to `perfumes` — it has previously missed accent and prefix
  variants (e.g. "Rosé" vs "Rose") and let duplicate rows through. Use an
  accent- and prefix-aware check.
- Do not pad a small house's fragrance count with an invented entry to hit
  a round number. If a house genuinely has fewer real fragrances than the
  target, ship the real count.
