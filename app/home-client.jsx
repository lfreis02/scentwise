"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FAMILIES, FAMILY_LABEL, famFill, famText } from "../lib/families";

const CATEGORY_LABELS = { niche: "Niche", "luxury-line": "Luxury line", heritage: "Heritage" };

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

function Consultant() {
  const [messages, setMessages] = useState([
    { role: "bot", text: "Tell me what you are after: an occasion, a scent you already love, a feeling you want to wear, or a budget. I will work from there." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const endRef = React.useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, loading]);

  async function send(text) {
    if (!text.trim() || loading) return;
    const userText = text.trim();
    const nextHistory = [...history, { role: "user", content: userText }];
    setHistory(nextHistory);
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/consultant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextHistory }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!data.reply) throw new Error("Empty response");
      setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
      setHistory((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((prev) => [...prev, {
        role: "bot",
        text: "The consultant is unreachable right now. Try again shortly, or browse the houses below in the meantime.",
      }]);
    }
    setLoading(false);
  }

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--rule-firm)" }}>
      <div className="flex items-center gap-3 px-5 py-3.5" style={{ borderBottom: "1px solid var(--rule)" }}>
        <Mark />
        <span className="label" style={{ color: "var(--ink)" }}>ScentWise consultant</span>
      </div>

      <div className="overflow-y-auto px-4 md:px-6 py-6 flex flex-col gap-4" style={{ height: 420, background: "var(--paper)" }}>
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

      {messages.length <= 1 && (
        <div className="px-4 md:px-6 py-3 flex flex-wrap gap-2" style={{ borderTop: "1px solid var(--rule)" }}>
          {["My first niche fragrance", "Something for the office", "A cold-weather evening", "I like Aventus, what else?"].map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              disabled={loading}
              className="px-3 py-1.5 text-[12.5px] transition disabled:opacity-50 hover:opacity-70"
              style={{ border: "1px solid var(--rule-firm)", color: "var(--muted)" }}
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

  useScrollReveal();

  const filtered = brands.filter((b) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      b.name.toLowerCase().includes(q) ||
      b.perfumes.some((p) => p.name.toLowerCase().includes(q));
    return matchesSearch && (category === "all" || b.category === category);
  });

  const totalFragrances = brands.reduce((n, b) => n + b.perfumes.length, 0);
  const oldest = brands
    .map((b) => parseInt((b.origin || "").match(/\b(1[0-9]{3}|20[0-9]{2})\b/)?.[1], 10))
    .filter(Boolean)
    .sort((a, b) => a - b)[0];

  return (
    <div className="min-h-screen" style={{ background: "var(--paper)" }}>
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-5 md:px-11 py-3.5"
        style={{ background: "var(--paper)", borderBottom: "1px solid var(--rule)" }}
      >
        <a href="#top"><Wordmark /></a>
        <nav className="flex gap-6 items-center">
          <a href="#families" className="label hidden md:block hover:opacity-60">Families</a>
          <a href="#consultant" className="label hidden md:block hover:opacity-60">Consultant</a>
          <a href="#houses" className="label hover:opacity-60">Houses</a>
        </nav>
      </header>

      {/* ---------- hero ---------- */}
      <section
        id="top"
        className="px-5 md:px-11 pt-16 md:pt-24 pb-12"
        style={{
          borderBottom: "1px solid var(--rule)",
          background: "linear-gradient(180deg, var(--wash) 0%, var(--surface) 100%)",
        }}
      >
        <div className="max-w-5xl">
          <p className="label mb-6">The perfume encyclopedia</p>
          <h1
            className="serif font-semibold mb-5"
            style={{ fontSize: "clamp(2.5rem,6.4vw,4.6rem)", lineHeight: 1.02, color: "var(--ink)", textWrap: "balance", maxWidth: "15ch" }}
          >
            Every house has an accent. Learn to hear them.
          </h1>
          <p className="mb-8 max-w-xl" style={{ color: "var(--muted)", fontSize: "16.5px" }}>
            {brands.length} houses of niche and luxury perfumery, each with its history, its materials
            and its fragrances opened up note by note. Start with a house you already love, or with
            something you cannot name yet.
          </p>

          <div className="flex flex-wrap gap-2.5 mb-11">
            <a
              href="#houses"
              className="px-5 py-3 label"
              style={{ background: "var(--ink)", color: "var(--paper)" }}
            >
              Browse the houses
            </a>
            <a
              href="#families"
              className="px-5 py-3 label"
              style={{ border: "1px solid var(--rule-firm)", color: "var(--ink)" }}
            >
              New to this? Start here
            </a>
          </div>

          <div className="flex flex-wrap gap-x-11 gap-y-5 pt-6" style={{ borderTop: "1px solid var(--rule)" }}>
            <Figure n={brands.length} l="houses" />
            <Figure n={totalFragrances} l="fragrances" />
            {oldest && <Figure n={oldest} l="oldest house" />}
            <Figure n={FAMILIES.length} l="olfactory families" />
          </div>
        </div>
      </section>

      {/* ---------- families primer ---------- */}
      <section id="families" className="px-5 md:px-11 py-12 md:py-16" style={{ borderBottom: "1px solid var(--rule)" }}>
        <div className="max-w-6xl" data-reveal>
          <p className="label mb-5">The vocabulary</p>
          <h2 className="serif font-semibold mb-3" style={{ fontSize: "clamp(1.6rem,3.2vw,2.3rem)" }}>
            Eight families, and what they actually smell like.
          </h2>
          <p className="mb-9 max-w-2xl" style={{ color: "var(--muted)" }}>
            Every fragrance on this site is colour-coded by family, so you can see the shape of a
            house before you read a word about it. This is the whole vocabulary you need to start.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-7">
            {FAMILIES.map((f) => (
              <div key={f}>
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="w-3.5 h-3.5 rounded-[3px]" style={{ background: famFill(f) }} />
                  <span className="serif text-lg font-semibold" style={{ color: famText(f) }}>
                    {FAMILY_LABEL[f]}
                  </span>
                </div>
                <p style={{ color: "var(--muted)", fontSize: "13.5px" }}>{FAMILY_PRIMER[f]}</p>
              </div>
            ))}
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
            The bar under each name is that house's fragrances, coloured by family. It tells you what
            a house is before you open it.
          </p>

          <div className="flex flex-col md:flex-row gap-2.5 max-w-3xl">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search a house or a fragrance"
              className="flex-1 px-4 py-2.5 outline-none text-[13.5px]"
              style={{ background: "var(--surface)", border: "1px solid var(--rule-firm)", color: "var(--ink)" }}
            />
            <div className="flex gap-1.5 flex-wrap">
              {FILTERS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className="px-3.5 py-2.5 label transition"
                  style={
                    category === c.id
                      ? { background: "var(--ink)", color: "var(--paper)" }
                      : { background: "var(--surface)", border: "1px solid var(--rule-firm)", color: "var(--muted)" }
                  }
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div
          className="grid"
          style={{
            gridTemplateColumns: "repeat(auto-fill,minmax(252px,1fr))",
            borderTop: "1px solid var(--rule)",
            background: "var(--surface)",
          }}
        >
          {filtered.map((b) => (
            <button
              key={b.id}
              onClick={() => router.push(`/brands/${b.id}`)}
              className="text-left flex flex-col gap-2 px-5 py-5 transition hover:bg-[var(--wash)]"
              style={{ borderBottom: "1px solid var(--rule)", borderRight: "1px solid var(--rule)" }}
            >
              <span className="flex items-baseline justify-between gap-2.5">
                <span className="serif text-[19px] font-semibold" style={{ color: "var(--ink)" }}>
                  {b.name}
                </span>
                <span className="label whitespace-nowrap">{CATEGORY_LABELS[b.category]}</span>
              </span>
              <span className="label" style={{ color: "var(--muted)" }}>{b.origin}</span>
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
              <span className="fp mt-auto pt-3" title={`${b.perfumes.length} fragrances`}>
                {b.families.map((f, i) => (
                  <i key={i} style={{ background: famFill(f) }} />
                ))}
              </span>
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="px-5 md:px-11 py-16" style={{ background: "var(--surface)" }}>
            <p className="serif text-xl mb-1">No houses match that.</p>
            <p style={{ color: "var(--muted)" }}>Try another term, or clear the category filter.</p>
          </div>
        )}
      </section>

      {/* ---------- consultant ---------- */}
      <section id="consultant" className="px-5 md:px-11 py-12 md:py-16" style={{ borderBottom: "1px solid var(--rule)" }}>
        <div className="max-w-3xl" data-reveal>
          <p className="label mb-5">Ask instead of browse</p>
          <h2 className="serif font-semibold mb-3" style={{ fontSize: "clamp(1.6rem,3.2vw,2.3rem)" }}>
            Describe what you want. Get somewhere to start.
          </h2>
          <p className="mb-8" style={{ color: "var(--muted)" }}>
            No account, no form. Say it in your own words, including the words you are not sure about.
          </p>
          <Consultant />
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
