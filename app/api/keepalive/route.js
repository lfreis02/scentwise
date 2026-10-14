// =============================================================
// ScentWise — Supabase keep-alive (Vercel Cron target)
// =============================================================
// The Supabase free tier pauses a project after about a week without
// activity, which takes every brand page down with it. Vercel Cron calls
// this route once a day (schedule in vercel.json) and it makes one real
// read against the database, so the project always counts as active.
//
// Deliberately not behind CRON_SECRET: it returns no data, and the read
// it makes is one anyone can already make with the public anon key.
// =============================================================

import { supabase } from "../../../lib/supabase";

// Must reach the database on every call — never prerender or cache this.
export const dynamic = "force-dynamic";

export async function GET() {
  const { error } = await supabase.from("brands").select("id").limit(1);

  if (error) {
    // Lands in Vercel's function logs; a paused project shows up here.
    console.error("keepalive: database read failed:", error.message);
    return Response.json({ ok: false }, { status: 503 });
  }

  return Response.json({ ok: true });
}
