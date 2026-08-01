"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { FAMILIES, FAMILY_LABEL, famFill, famText } from "../lib/families";

const CATEGORY_LABELS = { niche: "Niche", "luxury-line": "Luxury line", heritage: "Heritage" };

// Turns of context kept for the consultant. The route caps this again server-side.
const MAX_HISTORY = 20;

const FILTERS = [
  { id: "all", label: "All" },
  { id: "niche", label: "Niche" },
  { id: "heritage", label: "Heritage" },
  { id: "luxury-line", label: "Luxury lines" },
];

// What each family smells like, in plain words. This is the site's answer to serving
// newcomers and enthusiasts on the same page: the vocabulary is taught, not assumed.
const FAMILY_PRIMER = {
  floral: "Rose, jasmine, iris. From single-flower studies to dense white-flower bouquets.",
  woody: "Cedar, sandalwood, vetiver. Dry and structural, the backbone of most modern perfumery.",
  amber: "Labdanum, benzoin, vanilla. Warm, resinous and sweet without being edible.",
  citrus: "Bergamot, grapefruit, neroli. Bright and short-lived, traditionally the opening.",
  incense: "Frankincense, myrrh, elemi. Smoke and church resin, cool rather than warm.",
  chypre: "Oakmoss over citrus and labdanum. The classical bitter-green architecture.",
  leather: "Birch tar, suede, castoreum. Animalic and smoky, the most divisive family.",
  aromatic: "Lavender, sage, rosemary. Herbal and clean, the heart of the fougère.",
};

const OPENERS = [
  "My first niche fragrance",
  "Something for the office",
  "A cold-weather evening",
  "I like Aventus, what else?",
];

function Mark({ className = "" }) {
  return (
    <span className={`mark ${className}`} aria-hidden="true">
      <span className="t1" /><span className="t2" /><span className="t3" />
    </span>
  );
}

function Wordmark({ size = "text-lg" }) {
  return (
    <span className="flex items-center gap-2.5" style={{ color: "var(--ink)" }}>
      <Mark />
      <span className={`serif ${size} font-semibold`}>
        Scent<span style={{ color: "var(--muted)", fontWeight: 400 }}>Wise</span>
      </span>
    </span>
  );
}

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");
    if (!("IntersectionObserver" in window) || els.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("shown");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function Consultant({ seed, onSeedConsumed }) {
  const [messages, setMessages] = useState([
    { role: "bot", text: "Tell me what you are after: an occasion, a scent you already love, a feeling you want to wear, or a budget. I will work from there." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const endRef = useRef(null);
  const sendRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, loading]);

  async function send(text) {
    if (!text.trim() || loading) return;
    const userText = text.trim();
    // Not committed to state yet: `history` only advances on a completed round
    // trip. Committing up front left an unanswered user turn behind on every
    // failure, so a retry during an outage silently piled duplicate intent
    // into the model's context (and into the tokens we pay for).
    const attempt = [...history, { role: "user", content: userText }];
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/consultant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: attempt }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!data.reply) throw new Error("Empty response");
      setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
      setHistory(
        [...attempt, { role: "assistant", content: data.reply }].slice(-MAX_HISTORY)
      );
    } catch (err) {
      console.error("[consultant] send failed:", err);
      setMessages((prev) => [...prev, {
        role: "bot",
        text: "The consultant is unreachable right now. Try again shortly, or browse the houses below in the meantime.",
      }]);
    }
    setLoading(false);
  }
  sendRef.current = send;

  // A question asked from the hero arrives here as a seed.
  useEffect(() => {
    if (!seed) return;
    sendRef.current?.(seed);
    onSeedConsumed?.();
  }, [seed, onSeedConsumed]);

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--rule-firm)" }}>
      <div className="flex items-center gap-3 px-5 py-3.5" style={{ borderBottom: "1px solid var(--rule)" }}>
        <Mark />
        <span className="label" style={{ color: "var(--ink)" }}>ScentWise consultant</span>
      </div>

      <div className="overflow-y-auto px-4 md:px-6 py-6 flex flex-col gap-4" style={{ minHeight: 260, maxHeight: 480, background: "var(--paper)" }}>
        {messages.map((m, i) => (
          <div key={i} className={`max-w-[86%] ${m.role === "user" ? "self-end" : ""}`}>
            <p className="label mb-1">{m.role === "user" ? "You" : "ScentWise"}</p>
            <div
              className="px-3.5 py-2.5 text-[13.5px] whitespace-pre-wrap"
              style={
                m.role === "user"
                  ? { background: "var(--ink)", color: "var(--paper)" }
                  : { background: "var(--surface)", border: "1px solid var(--rule)", color: "var(--ink-soft)" }
              }
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && <p className="label">Thinking…</p>}
        <div ref={endRef} />
      </div>

      {messages.length <= 1 && !loading && (
        <div className="px-4 md:px-6 py-3 flex flex-wrap gap-2" style={{ borderTop: "1px solid var(--rule)" }}>
          {OPENERS.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              disabled={loading}
              className="px-3 py-2 text-[12.5px] transition disabled:opacity-50 hover:opacity-70"
              style={{ border: "1px solid var(--rule-firm)", color: "var(--muted)", minHeight: 36 }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="flex" style={{ borderTop: "1px solid var(--rule)" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send(input)}
          placeholder="Describe what you are looking for"
          disabled={loading}
          maxLength={500}
          className="flex-1 px-5 py-4 outline-none text-[13.5px] bg-transparent disabled:opacity-50"
          style={{ color: "var(--ink)" }}
        />
        <button
          onClick={() => send(input)}
          disabled={loading || !input.trim()}
          className="px-6 label transition disabled:opacity-40"
          style={{ background: "var(--ink)", color: "var(--paper)" }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default function HomeClient({ brands }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [family, setFamily] = useState(null);
  const [seed, setSeed] = useState(null);
  const [heroAsk, setHeroAsk] = useState("");

  useScrollReveal();

  function askConsultant(text) {
    const q = text.trim();
    if (!q) return;
    setSeed(q);
    setHeroAsk("");
    document.getElementById("consultant")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function pickFamily(f) {
    setFamily((cur) => (cur === f ? null : f));
    document.getElementById("houses")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Houses that survive all three filters, each carrying the fragrances that
  // explain a text match so the card can show why it is in the results.
  const results = useMemo(() => {
    const q = search.trim().toLowerCase();
    return brands
      .map((b) => {
        const hits = q ? b.perfumes.filter((p) => p.haystack.includes(q)) : [];
        const matches = !q || b.haystack.includes(q) || hits.length > 0;
        return { ...b, hits, matches };
      })
      .filter((b) => b.matches)
      .filter((b) => category === "all" || b.category === category)
      .filter((b) => !family || b.families.includes(family));
  }, [brands, search, category, family]);

  const totalFragrances = brands.reduce((n, b) => n + b.perfumes.length, 0);
  const oldest = brands
    .map((b) => parseInt((b.origin || "").match(/\b(1[0-9]{3}|20[0-9]{2})\b/)?.[1], 10))
    .filter(Boolean)
    .sort((a, b) => a - b)[0];

  const filtersOn = search.trim() || category !== "all" || family;

  return (
    <div className="min-h-screen" style={{ background: "var(--paper)" }}>
      <header
        className="sticky top-0 z-50 flex items-center justify-between gap-3 px-4 md:px-11 py-3"
        style={{ background: "var(--paper)", borderBottom: "1px solid var(--rule)" }}
      >
        <a href="#top" className="py-1.5"><Wordmark /></a>
        <nav className="flex gap-3.5 md:gap-6 items-center">
          <a href="#families" className="label py-2.5 hover:opacity-60">Families</a>
          <a href="#houses" className="label py-2.5 hover:opacity-60">Houses</a>
          <a
            href="#consultant"
            className="label px-3 py-2.5"
            style={{ background: "var(--ink)", color: "var(--paper)" }}
          >
            Ask
          </a>
        </nav>
      </header>

      {/* ---------- hero ---------- */}
      <section
        id="top"
        className="px-5 md:px-11 pt-14 md:pt-20 pb-11"
        style={{
          borderBottom: "1px solid var(--rule)",
          background: "linear-gradient(180deg, var(--wash) 0%, var(--surface) 100%)",
        }}
      >
        <div className="max-w-6xl xl:flex xl:items-end xl:justify-between xl:gap-16">
        <div className="max-w-5xl">
          <p className="label mb-6">The perfume encyclopedia</p>
          <h1
            className="serif font-semibold mb-5"
            style={{ fontSize: "clamp(2.4rem,6.2vw,4.4rem)", lineHeight: 1.03, color: "var(--ink)", textWrap: "balance", maxWidth: "15ch" }}
          >
            Every house has an accent. Learn to hear them.
          </h1>
          <p className="mb-8 max-w-xl" style={{ color: "var(--muted)", fontSize: "16.5px" }}>
            {brands.length} houses of niche and luxury perfumery, each with its history, its materials
            and its fragrances opened up note by note.
          </p>

          {/* ask the consultant, from the first screen */}
          <div className="max-w-xl">
            <label htmlFor="hero-ask" className="label block mb-2.5">
              Not sure where to start? Ask.
            </label>
            <div className="flex" style={{ border: "1px solid var(--rule-firm)", background: "var(--surface)" }}>
              <input
                id="hero-ask"
                type="text"
                value={heroAsk}
                onChange={(e) => setHeroAsk(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && askConsultant(heroAsk)}
                placeholder="A gift for my father, he wears Dior Sauvage"
                maxLength={500}
                className="flex-1 min-w-0 px-4 outline-none text-[14px] bg-transparent"
                style={{ color: "var(--ink)", minHeight: 48 }}
              />
              <button
                onClick={() => askConsultant(heroAsk)}
                disabled={!heroAsk.trim()}
                className="px-5 label transition disabled:opacity-40"
                style={{ background: "var(--ink)", color: "var(--paper)", minHeight: 48 }}
              >
                Ask
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {OPENERS.slice(0, 3).map((s) => (
                <button
                  key={s}
                  onClick={() => askConsultant(s)}
                  className="px-3 text-[12.5px] transition hover:opacity-70"
                  style={{ border: "1px solid var(--rule)", color: "var(--muted)", minHeight: 36 }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5 mt-9">
            <a
              href="#houses"
              className="px-5 label flex items-center"
              style={{ border: "1px solid var(--rule-firm)", color: "var(--ink)", minHeight: 46 }}
            >
              Browse all {brands.length} houses
            </a>
            <a
              href="#families"
              className="px-5 label flex items-center"
              style={{ border: "1px solid var(--rule-firm)", color: "var(--ink)", minHeight: 46 }}
            >
              New to this? Start here
            </a>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-11 gap-y-5 pt-9 mt-9 border-t border-[var(--rule)] xl:flex-col xl:items-start xl:gap-y-7 xl:pt-0 xl:mt-0 xl:pl-16 xl:border-t-0 xl:border-l xl:shrink-0">
          <Figure n={brands.length} l="houses" />
          <Figure n={totalFragrances} l="fragrances" />
          {oldest && <Figure n={oldest} l="oldest house" />}
          <Figure n={FAMILIES.length} l="olfactory families" />
        </div>
        </div>
      </section>

      {/* ---------- families primer, now a filter ---------- */}
      <section id="families" className="px-5 md:px-11 py-12 md:py-16" style={{ borderBottom: "1px solid var(--rule)" }}>
        <div className="max-w-6xl" data-reveal>
          <p className="label mb-5">The vocabulary</p>
          <h2 className="serif font-semibold mb-3" style={{ fontSize: "clamp(1.6rem,3.2vw,2.3rem)" }}>
            Eight families, and what they actually smell like.
          </h2>
          <p className="mb-9 max-w-2xl" style={{ color: "var(--muted)" }}>
            Every fragrance here is coded by family, so you can see the shape of a house before you
            read a word about it. Pick one to see the houses that work in it.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-2">
            {FAMILIES.map((f) => {
              const count = brands.filter((b) => b.families.includes(f)).length;
              const on = family === f;
              return (
                <button
                  key={f}
                  onClick={() => pickFamily(f)}
                  aria-pressed={on}
                  className="text-left py-3.5 px-3.5 -mx-3.5 transition"
                  style={{ background: on ? "var(--wash)" : "transparent" }}
                >
                  <span className="flex items-center gap-2.5 mb-2">
                    <span className="w-3.5 h-3.5 rounded-[3px] shrink-0" style={{ background: famFill(f) }} />
                    <span className="serif text-lg font-semibold" style={{ color: famText(f) }}>
                      {FAMILY_LABEL[f]}
                    </span>
                    <span className="label ml-auto">{count} houses</span>
                  </span>
                  <span className="block" style={{ color: "var(--muted)", fontSize: "13.5px" }}>
                    {FAMILY_PRIMER[f]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- houses ---------- */}
      <section id="houses" style={{ background: "var(--wash)", borderBottom: "1px solid var(--rule)" }}>
        <div className="px-5 md:px-11 pt-12 md:pt-16 pb-6" data-reveal>
          <p className="label mb-5">The encyclopedia</p>
          <h2 className="serif font-semibold mb-3" style={{ fontSize: "clamp(1.6rem,3.2vw,2.3rem)" }}>
            The houses
          </h2>
          <p className="max-w-2xl mb-8" style={{ color: "var(--muted)" }}>
            The bar under each name is that house's fragrances, coloured by family. Search reaches
            fragrance names, notes, families and countries.
          </p>

          <div className="flex flex-col md:flex-row gap-2.5 max-w-3xl">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Try vetiver, or Japan, or Aventus"
              className="flex-1 px-4 outline-none text-[13.5px]"
              style={{ background: "var(--surface)", border: "1px solid var(--rule-firm)", color: "var(--ink)", minHeight: 44 }}
            />
            <div className="flex gap-1.5 flex-wrap">
              {FILTERS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className="px-3.5 label transition"
                  style={
                    category === c.id
                      ? { background: "var(--ink)", color: "var(--paper)", minHeight: 44 }
                      : { background: "var(--surface)", border: "1px solid var(--rule-firm)", color: "var(--muted)", minHeight: 44 }
                  }
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {filtersOn && (
            <div className="flex items-center gap-3 flex-wrap mt-4">
              <span className="label">
                {results.length} {results.length === 1 ? "house" : "houses"}
                {family ? ` working in ${FAMILY_LABEL[family].toLowerCase()}` : ""}
              </span>
              <button
                onClick={() => { setSearch(""); setCategory("all"); setFamily(null); }}
                className="label px-2.5 py-1.5 transition hover:opacity-60"
                style={{ border: "1px solid var(--rule-firm)", color: "var(--ink)" }}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        <div className="house-grid" style={{ borderTop: "1px solid var(--rule)" }}>
          {results.map((b) => (
            <button
              key={b.id}
              onClick={() => router.push(`/brands/${b.id}`)}
              className="house-card text-left transition hover:bg-[var(--wash)]"
            >
              <span className="flex items-baseline justify-between gap-2.5">
                <span className="serif text-[19px] font-semibold" style={{ color: "var(--ink)" }}>
                  {b.name}
                </span>
                <span className="label whitespace-nowrap">{CATEGORY_LABELS[b.category]}</span>
              </span>
              <span className="label" style={{ color: "var(--muted)" }}>{b.origin}</span>

              {b.hits.length > 0 ? (
                <span className="flex flex-wrap gap-1.5 py-0.5">
                  {b.hits.slice(0, 3).map((h) => (
                    <span
                      key={h.name}
                      className="text-[12px] px-2 py-0.5"
                      style={{
                        border: `1px solid ${famFill(h.family)}`,
                        color: famText(h.family),
                      }}
                    >
                      {h.name}
                    </span>
                  ))}
                  {b.hits.length > 3 && (
                    <span className="label self-center">+{b.hits.length - 3} more</span>
                  )}
                </span>
              ) : (
                <span
                  className="text-[13.5px]"
                  style={{
                    color: "var(--muted)",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {b.desc}
                </span>
              )}

              <span className="fp mt-auto pt-3" title={`${b.perfumes.length} fragrances`}>
                {b.families.map((f, i) => (
                  <i key={i} style={{ background: famFill(f) }} />
                ))}
              </span>
            </button>
          ))}
        </div>

        {results.length === 0 && (
          <div className="px-5 md:px-11 py-16" style={{ background: "var(--surface)" }}>
            <p className="serif text-xl mb-1">No houses match that.</p>
            <p className="mb-5" style={{ color: "var(--muted)" }}>
              Try a fragrance name, a note like vetiver, a country, or one of the eight families.
            </p>
            <button
              onClick={() => { setSearch(""); setCategory("all"); setFamily(null); }}
              className="label px-3.5 py-2.5"
              style={{ background: "var(--ink)", color: "var(--paper)" }}
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      {/* ---------- consultant ---------- */}
      <section id="consultant" className="px-5 md:px-11 py-12 md:py-16" style={{ borderBottom: "1px solid var(--rule)" }}>
        <div className="max-w-6xl xl:grid xl:grid-cols-[1fr_1.3fr] xl:gap-16 xl:items-start" data-reveal>
          <div className="max-w-3xl">
            <p className="label mb-5">Ask instead of browse</p>
            <h2 className="serif font-semibold mb-3" style={{ fontSize: "clamp(1.6rem,3.2vw,2.3rem)" }}>
              Describe what you want. Get somewhere to start.
            </h2>
            <p className="mb-8" style={{ color: "var(--muted)" }}>
              No account, no form. Say it in your own words, including the words you are not sure about.
            </p>
          </div>
          <Consultant seed={seed} onSeedConsumed={() => setSeed(null)} />
        </div>
      </section>

      {/* ---------- footer ---------- */}
      <footer className="px-5 md:px-11 py-12" style={{ background: "var(--surface)" }}>
        <div className="flex flex-wrap justify-between gap-8">
          <div>
            <Wordmark size="text-xl" />
            <p className="mt-3 max-w-sm" style={{ color: "var(--muted)", fontSize: "13.5px" }}>
              An independent reference for niche and luxury perfumery.
            </p>
          </div>
          <div className="label" style={{ lineHeight: 2, maxWidth: "34ch" }}>
            Not affiliated with the houses documented here.<br />
            Fragrance notes are compiled from public sources.<br />
            Prices, where shown, are in USD and change without notice.
          </div>
        </div>
      </footer>
    </div>
  );
}

function Figure({ n, l }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="serif tnum" style={{ fontSize: "27px", lineHeight: 1, color: "var(--ink)" }}>{n}</span>
      <span className="label">{l}</span>
    </div>
  );
}
