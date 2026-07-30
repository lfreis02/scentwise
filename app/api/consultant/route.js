// =============================================================
// ScentWise — Live Consultant API Route (Next.js App Router)
// File location in your Next.js project: app/api/consultant/route.js
// =============================================================
//
// This is the piece that makes the live consultant WORK in production.
// It runs on the server (Vercel), so your Anthropic API key stays secret
// and there are no browser/CORS restrictions like in the artifact.
//
// SETUP:
// 1. Put this file at: app/api/consultant/route.js
// 2. In Vercel project settings, add an Environment Variable:
//      ANTHROPIC_API_KEY = sk-ant-...   (your key from console.anthropic.com)
// 3. The frontend calls fetch("/api/consultant", {...}) instead of
//    calling api.anthropic.com directly.
// =============================================================

const SYSTEM_PROMPT = `You are the ScentWise Consultant, a sophisticated and passionate fragrance specialist focused on niche and luxury perfumery. Speak in warm, elegant, natural English — like a knowledgeable friend who happens to be a perfumery expert.

Help the person find their ideal fragrance. When they describe an occasion, preference, or budget:
1. If important info is missing (budget, gender preference, current signature scents, climate), ask ONE natural follow-up question
2. When you have enough to recommend, give concrete picks with: name and house, olfactory family and key notes, why it fits, approximate USD price, and where to find it
3. Favor niche houses (Le Labo, Maison Francis Kurkdjian, Byredo, Creed, Diptyque, Amouage, Parfums de Marly, Initio, Xerjoff, Frederic Malle) and prestige lines (Tom Ford Private Blend, Chanel Les Exclusifs)
4. Be educational without being pedantic. Keep replies to 2-3 short paragraphs.

Tone: sophisticated yet accessible, never judgmental. Every budget deserves a thoughtful recommendation.`;

// --- Abuse limits -----------------------------------------------------
// This route costs money per call, so bound the cost per request
// (shape/size) and the cost per attacker (rate limit).
const MAX_MESSAGES_IN = 50;      // accepted payload length
const MAX_CONTENT_CHARS = 2000;  // per message
const RATE_LIMIT = 10;           // requests...
const RATE_WINDOW_MS = 10 * 60 * 1000; // ...per IP, per 10 minutes

// In-memory: per instance, not shared. Stops a simple loop; for a real
// guarantee, swap for a shared store (Upstash Redis).
const hits = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(key);
    }
  }
  return false;
}

function isValidMessages(messages) {
  if (!Array.isArray(messages) || messages.length === 0) return false;
  if (messages.length > MAX_MESSAGES_IN) return false;
  return messages.every(
    (m) =>
      m &&
      typeof m === "object" &&
      (m.role === "user" || m.role === "assistant") &&
      typeof m.content === "string" &&
      m.content.length > 0 &&
      m.content.length <= MAX_CONTENT_CHARS
  );
}

export async function POST(request) {
  try {
    // Browser requests from this site only. Does not stop curl — it stops
    // another site from using our endpoint from their own page.
    const origin = request.headers.get("origin");
    if (origin && new URL(origin).host !== request.headers.get("host")) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";
    if (isRateLimited(ip)) {
      return Response.json(
        { error: "Too many requests. Try again in a few minutes." },
        { status: 429, headers: { "Retry-After": "600" } }
      );
    }

    const { messages } = await request.json();

    if (!isValidMessages(messages)) {
      return Response.json({ error: "Invalid messages payload" }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return Response.json({ error: "Server is not configured with an API key" }, { status: 500 });
    }

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: messages.slice(-20), // keep last 20 turns for context
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return Response.json({ error: `Anthropic API error: ${res.status}`, detail: errText }, { status: 502 });
    }

    const data = await res.json();
    const reply = data.content?.find((b) => b.type === "text")?.text || "I'm sorry, I couldn't form a response. Please try again.";

    return Response.json({ reply });
  } catch (err) {
    return Response.json({ error: "Unexpected server error", detail: String(err) }, { status: 500 });
  }
}