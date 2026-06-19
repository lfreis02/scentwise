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

export async function POST(request) {
  try {
    const { messages } = await request.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: "messages array required" }, { status: 400 });
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