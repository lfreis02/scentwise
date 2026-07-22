"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, Sparkles, Building2, FlaskConical, Briefcase, BookMarked, Wallet, Users, ArrowRight, Search } from "lucide-react";

// Scroll-reveal hook: fades + lifts elements into view as the user scrolls
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");
    if (!("IntersectionObserver" in window) || els.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(28px)";
      el.style.transition = "opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1)";
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);
}


const FEATURES = [
  { icon: Building2, title: "House Histories", desc: "From founding to iconic creations — discover the soul behind each maison, with links to official boutiques." },
  { icon: FlaskConical, title: "Olfactory Notes Guide", desc: "Understand the difference between bergamot and cedar, fougère and oriental. Build your fragrance vocabulary." },
  { icon: Briefcase, title: "Fragrances by Occasion", desc: "Curation by moment: office, travel, evenings, beach, winter. The right scent always within reach." },
  { icon: BookMarked, title: "My Collection", desc: "Track perfumes you own, want, or have sampled. Your personal fragrance archive, organized." },
  { icon: Wallet, title: "Smart Budgeting", desc: "From entry niche to ultra-luxury: recommendations across all tiers with alternatives and where to find them." },
  { icon: Users, title: "Community", desc: "A space for fragrance lovers to connect, share discoveries, and build this culture together." },
];

const CATEGORY_LABELS = { niche: "Niche", "luxury-line": "Luxury Line", heritage: "Heritage House" };

function DemoConsultant() {
  const [liveMessages, setLiveMessages] = React.useState([
    { role: "bot", text: "Hello — I'm your ScentWise consultant. Tell me what you're looking for: an occasion, a scent you're chasing, a feeling you want to wear, or a budget in mind. Where shall we begin?" },
  ]);
  const [liveInput, setLiveInput] = React.useState("");
  const [liveLoading, setLiveLoading] = React.useState(false);
  const [apiHistory, setApiHistory] = React.useState([]);
  const liveEndRef = React.useRef(null);

  React.useEffect(() => {
    liveEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [liveMessages, liveLoading]);

  async function sendLive(text) {
    if (!text.trim() || liveLoading) return;
    const userText = text.trim();
    const newApiHistory = [...apiHistory, { role: "user", content: userText }];
    setApiHistory(newApiHistory);
    setLiveMessages(prev => [...prev, { role: "user", text: userText }]);
    setLiveInput("");
    setLiveLoading(true);

    try {
      const res = await fetch("/api/consultant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newApiHistory }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const reply = data.reply;
      if (!reply) throw new Error("Empty response");
      setLiveMessages(prev => [...prev, { role: "bot", text: reply }]);
      setApiHistory(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setLiveMessages(prev => [...prev, {
        role: "bot",
        text: "I'm having trouble connecting right now. Please try again in a moment, or explore the houses below in the meantime.",
      }]);
    }
    setLiveLoading(false);
  }

  return (
    <div>
      <div className="bg-white rounded-lg overflow-hidden" style={{ border: "1px solid rgba(196,168,130,0.3)", boxShadow: "0 20px 60px rgba(92,74,50,0.08)" }}>
        <div className="flex items-center gap-4 px-7 py-5" style={{ background: "#5C4A32" }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center serif text-xl text-white" style={{ background: "#C4A882" }}>S</div>
          <div className="flex-1">
            <h4 className="serif text-lg" style={{ color: "#F5F0E8" }}>ScentWise Consultant</h4>
            <p className="text-xs" style={{ color: "rgba(245,240,232,0.65)" }}>Live · Ask anything about fragrance</p>
          </div>
          <div className="w-2 h-2 rounded-full" style={{ background: "#7DBD8A", boxShadow: "0 0 0 4px rgba(125,189,138,0.3)" }}></div>
        </div>

        <div className="chat-scroll overflow-y-auto px-5 md:px-7 py-7 flex flex-col gap-5" style={{ background: "#FDFAF7", height: "520px" }}>
          {liveMessages.map((m, i) => (
            <div key={i} className={`flex gap-3 max-w-[88%] fade-up ${m.role === "user" ? "self-end flex-row-reverse" : ""}`}>
              <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm" style={m.role === "user" ? { background: "#E8DCC8", color: "#5C4A32" } : { background: "#5C4A32", color: "#F5F0E8", fontFamily: "'Cormorant Garamond', serif" }}>
                {m.role === "user" ? "U" : "S"}
              </div>
              <div className="px-4 py-3 text-sm leading-relaxed font-light whitespace-pre-wrap" style={m.role === "user" ? { background: "#5C4A32", color: "#F5F0E8", borderRadius: "4px 4px 0 4px" } : { background: "white", color: "#2C1F0F", border: "1px solid rgba(196,168,130,0.25)", borderRadius: "4px 4px 4px 0" }}>
                {m.text}
              </div>
            </div>
          ))}
          {liveLoading && (
            <div className="flex gap-3 fade-up">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ background: "#5C4A32", color: "#F5F0E8", fontFamily: "'Cormorant Garamond', serif" }}>S</div>
              <div className="px-4 py-3 bg-white border flex items-center gap-1.5" style={{ borderColor: "rgba(196,168,130,0.25)", borderRadius: "4px 4px 4px 0" }}>
                <span className="dot w-1.5 h-1.5 rounded-full" style={{ background: "#C4A882" }}></span>
                <span className="dot w-1.5 h-1.5 rounded-full" style={{ background: "#C4A882" }}></span>
                <span className="dot w-1.5 h-1.5 rounded-full" style={{ background: "#C4A882" }}></span>
              </div>
            </div>
          )}
          <div ref={liveEndRef} />
        </div>

        {liveMessages.length <= 1 && (
          <div className="px-5 md:px-7 py-4 flex flex-wrap gap-2 border-t" style={{ background: "#FDFAF7", borderColor: "rgba(196,168,130,0.15)" }}>
            {[
              "Something elegant for the office",
              "My first niche fragrance",
              "A fresh scent for summer",
              "Something for a winter evening",
            ].map((s, i) => (
              <button key={i} onClick={() => sendLive(s)} disabled={liveLoading} className="px-4 py-2 border rounded-full text-xs transition disabled:opacity-50" style={{ borderColor: "#C4A882", color: "#8B6F47", background: "transparent" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#8B6F47"; e.currentTarget.style.color = "white"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#8B6F47"; }}>
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="flex border-t bg-white" style={{ borderColor: "rgba(196,168,130,0.2)" }}>
          <input
            type="text"
            value={liveInput}
            onChange={(e) => setLiveInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") sendLive(liveInput); }}
            placeholder="Describe what you're looking for..."
            disabled={liveLoading}
            maxLength={500}
            className="flex-1 px-6 py-5 outline-none text-sm font-light bg-transparent disabled:opacity-50"
            style={{ color: "#2C1F0F" }}
          />
          <button onClick={() => sendLive(liveInput)} disabled={liveLoading || !liveInput.trim()} className="px-6 py-5 text-white flex items-center gap-2 text-xs uppercase tracking-widest transition disabled:opacity-50" style={{ background: "#5C4A32" }}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default function HomeClient({ brands }) {
  const [userName, setUserName] = useState(null);
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [nameInput, setNameInput] = useState("");

  const router = useRouter();
  const [brandSearch, setBrandSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    (async () => {
      try {
        const nameRes = await window.storage.get("user:name");
        if (nameRes?.value) setUserName(nameRes.value);
        else setShowNamePrompt(true);
      } catch (e) {
        setShowNamePrompt(true);
      }
    })();
  }, []);

  async function saveName() {
    const name = nameInput.trim();
    if (!name) return;
    try { await window.storage.set("user:name", name); } catch (e) {}
    setUserName(name);
    setShowNamePrompt(false);
  }

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  useScrollReveal();

  // Always open the page at the top (hero section) on load,
  // overriding the browser's scroll-restoration behavior.
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  const filteredBrands = brands.filter((b) => {
    const q = brandSearch.toLowerCase();
    const matchesSearch = !q || b.name.toLowerCase().includes(q) || b.perfumes.some((p) => p.name.toLowerCase().includes(q));
    const matchesCategory = categoryFilter === "all" || b.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // ===== MAIN VIEW =====
  return (
    <div className="min-h-screen" style={{ background: "#F9F6F1", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500&display=swap');
        .serif { font-family: 'Cormorant Garamond', Georgia, serif; }
        @keyframes blink { 0%,60%,100% { opacity:0.2; transform:scale(1); } 30% { opacity:1; transform:scale(1.3); } }
        .dot { animation: blink 1.2s infinite; }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }
        .chat-scroll::-webkit-scrollbar { width: 4px; }
        .chat-scroll::-webkit-scrollbar-thumb { background: #d6c4a8; border-radius: 2px; }
        html { scroll-behavior: smooth; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.6s ease-out; }
      `}</style>

      {showNamePrompt && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4" style={{ background: "rgba(44,31,15,0.85)", backdropFilter: "blur(8px)" }}>
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-10 fade-up" style={{ border: "1px solid rgba(196,168,130,0.3)" }}>
            <Sparkles size={28} style={{ color: "#A67C52" }} className="mb-5" />
            <h3 className="serif text-3xl mb-3 font-light" style={{ color: "#2C1F0F" }}>Welcome to ScentWise</h3>
            <p className="text-sm font-light mb-6 leading-relaxed" style={{ color: "#7A6650" }}>
              For a more personal experience, what should I call you? Your conversations are saved so you can pick up where you left off.
            </p>
            <input type="text" value={nameInput} onChange={(e) => setNameInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && saveName()} placeholder="Your first name" className="w-full px-4 py-3 border outline-none text-sm font-light mb-4 rounded" style={{ borderColor: "#C4A882", color: "#2C1F0F" }} autoFocus />
            <div className="flex gap-3">
              <button onClick={saveName} disabled={!nameInput.trim()} className="flex-1 py-3 text-xs uppercase tracking-widest transition disabled:opacity-50" style={{ background: "#5C4A32", color: "#F5F0E8" }}>Begin</button>
              <button onClick={() => { setUserName("guest"); setShowNamePrompt(false); }} className="px-5 py-3 text-xs uppercase tracking-widest border" style={{ borderColor: "#C4A882", color: "#7A6650" }}>Skip</button>
            </div>
          </div>
        </div>
      )}

      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5 backdrop-blur-md border-b" style={{ background: "rgba(249,246,241,0.92)", borderColor: "rgba(196,168,130,0.2)" }}>
        <a href="#" className="serif text-2xl font-semibold tracking-widest" style={{ color: "#5C4A32" }}>
          Scent<span style={{ color: "#A67C52" }}>Wise</span>
        </a>
        <div className="hidden md:flex gap-7 items-center">
          <button onClick={() => scrollTo("how")} className="text-xs uppercase tracking-widest" style={{ color: "#7A6650" }}>How it works</button>
          <button onClick={() => scrollTo("consultor")} className="text-xs uppercase tracking-widest" style={{ color: "#7A6650" }}>Consultant</button>
          <button onClick={() => scrollTo("brands")} className="text-xs uppercase tracking-widest" style={{ color: "#7A6650" }}>Houses</button>
          <button onClick={() => scrollTo("features")} className="text-xs uppercase tracking-widest" style={{ color: "#7A6650" }}>Features</button>
          <button onClick={() => scrollTo("consultor")} className="text-xs uppercase tracking-widest px-5 py-2.5" style={{ background: "#5C4A32", color: "#F5F0E8" }}>Explore</button>
        </div>
      </nav>

      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-32 pb-20 relative overflow-hidden" style={{ background: "linear-gradient(160deg, #F9F6F1 0%, #F5F0E8 50%, #E8DCC8 100%)" }}>
        <div className="absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full opacity-30" style={{ background: "radial-gradient(circle, #C4A882 0%, transparent 70%)" }}></div>
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full opacity-20" style={{ background: "radial-gradient(circle, #8B6F47 0%, transparent 70%)" }}></div>

        <p className="text-xs tracking-[0.3em] uppercase mb-5 font-medium relative z-10" style={{ color: "#A67C52" }}>
          {userName && userName !== "guest" ? `Welcome back, ${userName}` : "Niche fragrance, curated"}
        </p>
        <h1 className="serif font-light leading-tight mb-6 max-w-4xl relative z-10" style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)", color: "#2C1F0F" }}>
          The right fragrance for <em style={{ color: "#8B6F47" }}>every moment</em> of your life
        </h1>
        <p className="text-base md:text-lg leading-relaxed font-light max-w-xl mb-10 relative z-10" style={{ color: "#7A6650" }}>
          A personal AI consultant trained in niche perfumery, paired with a curated encyclopedia of the world's most respected houses.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 relative z-10">
          <button onClick={() => scrollTo("consultor")} className="inline-flex items-center gap-3 text-xs uppercase tracking-widest px-9 py-4 transition hover:-translate-y-0.5" style={{ background: "#5C4A32", color: "#F5F0E8" }}>
            <MessageCircle size={16} /> Talk to the consultant
          </button>
          <button onClick={() => scrollTo("brands")} className="inline-flex items-center gap-3 text-xs uppercase tracking-widest px-9 py-4 border transition" style={{ borderColor: "#5C4A32", color: "#5C4A32" }}>
            <Building2 size={16} /> Explore the houses
          </button>
        </div>
        <div className="mt-16 flex flex-col items-center gap-2 relative z-10">
          <div className="w-px h-12" style={{ background: "linear-gradient(to bottom, #C4A882, transparent)" }}></div>
          <span className="text-[10px] uppercase tracking-[0.4em]" style={{ color: "#A89880" }}>Explore</span>
        </div>
      </section>

      <section id="how" className="px-6 md:px-12 py-24" style={{ background: "#F5F0E8" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16" data-reveal>
            <p className="text-xs tracking-[0.3em] uppercase mb-4 font-medium" style={{ color: "#A67C52" }}>Simple as that</p>
            <h2 className="serif font-light mb-5" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", color: "#2C1F0F" }}>How ScentWise works</h2>
            <p className="text-base font-light max-w-lg mx-auto" style={{ color: "#7A6650" }}>You don't need to be an expert. You just need to know what you want to feel.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 md:gap-10">
            {[
              { n: "01", t: "Tell us the moment", d: "Important meeting, beach trip, black-tie wedding, quiet day at home. Speak freely — no jargon required." },
              { n: "02", t: "Build your profile", d: "The consultant learns your preferences, what you already wear, what draws you, and your investment range." },
              { n: "03", t: "Get your recommendation", d: "Personalized suggestions with notes, houses, where to buy, and budget alternatives at every tier." },
            ].map((s, i) => (
              <div key={i} className="p-10 border transition hover:-translate-y-1 hover:shadow-xl" style={{ background: "#F9F6F1", borderColor: "rgba(196,168,130,0.3)" }}>
                <div className="serif font-light leading-none mb-5" style={{ fontSize: "3.25rem", color: "#E8DCC8" }}>{s.n}</div>
                <h3 className="serif text-2xl mb-3" style={{ color: "#5C4A32" }}>{s.t}</h3>
                <p className="text-sm leading-relaxed font-light" style={{ color: "#7A6650" }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="consultor" className="px-6 md:px-12 py-24" style={{ background: "#F9F6F1" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12" data-reveal>
            <p className="text-xs tracking-[0.3em] uppercase mb-4 font-medium" style={{ color: "#A67C52" }}>Olfactory intelligence</p>
            <h2 className="serif font-light mb-5" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", color: "#2C1F0F" }}>Your personal fragrance consultant</h2>
            <p className="text-base font-light max-w-xl mx-auto" style={{ color: "#7A6650" }}>
              Tell the consultant what you're looking for — an occasion, a scent you love, a feeling, or a budget — and get personalized recommendations from the world's finest houses.
            </p>
          </div>

          <DemoConsultant />
        </div>
      </section>

      <section id="brands" className="px-6 md:px-12 py-24" style={{ background: "#F5F0E8" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12" data-reveal>
            <p className="text-xs tracking-[0.3em] uppercase mb-4 font-medium" style={{ color: "#A67C52" }}>Encyclopedia</p>
            <h2 className="serif font-light mb-5" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", color: "#2C1F0F" }}>The houses</h2>
            <p className="text-base font-light max-w-lg mx-auto" style={{ color: "#7A6650" }}>
              From house history to iconic compositions — click any maison to explore its world.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-3 mb-10 max-w-3xl mx-auto">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#A89880" }} />
              <input type="text" value={brandSearch} onChange={(e) => setBrandSearch(e.target.value)} placeholder="Search house or fragrance..." className="w-full pl-11 pr-4 py-3 border bg-white outline-none text-sm font-light" style={{ borderColor: "rgba(196,168,130,0.4)", color: "#2C1F0F" }} />
            </div>
            <div className="flex gap-2">
              {[
                { id: "all", label: "All" },
                { id: "niche", label: "Niche" },
                { id: "luxury-line", label: "Luxury Lines" },
                { id: "heritage", label: "Heritage" },
              ].map((cat) => (
                <button key={cat.id} onClick={() => setCategoryFilter(cat.id)} className="px-5 py-3 text-xs uppercase tracking-widest transition" style={categoryFilter === cat.id ? { background: "#5C4A32", color: "#F5F0E8" } : { background: "white", color: "#7A6650", border: "1px solid rgba(196,168,130,0.4)" }}>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBrands.map((b) => (
              <button key={b.id} onClick={() => router.push(`/brands/${b.id}`)}
               className="text-left p-7 border bg-white hover:-translate-y-1.5 hover:shadow-2xl group" style={{ borderColor: "rgba(196,168,130,0.3)", transition: "transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s ease, border-color 0.35s ease" }} onMouseEnter={(e) => e.currentTarget.style.borderColor = "#C4A882"} onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(196,168,130,0.3)"}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] uppercase tracking-[0.3em] font-medium px-2 py-1 rounded" style={{ color: "#A67C52", background: "#F5F0E8" }}>{CATEGORY_LABELS[b.category]}</p>
                    {b.tier === "deep" && (
                      <p className="text-[10px] uppercase tracking-[0.2em] font-medium px-2 py-1 rounded" style={{ color: "#F5F0E8", background: "#5C4A32" }}>Featured</p>
                    )}
                  </div>
                  <ArrowRight size={16} className="opacity-30 group-hover:opacity-100 transition" style={{ color: "#8B6F47" }} />
                </div>
                <h3 className="serif text-2xl font-light mb-2" style={{ color: "#2C1F0F" }}>{b.name}</h3>
                <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "#A89880" }}>{b.origin}</p>
                <p className="text-sm leading-relaxed font-light" style={{ color: "#5C4A32", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{b.desc}</p>
                <p className="text-xs mt-4 italic" style={{ color: "#8B6F47" }}>
                  {b.tier === "deep"
                    ? "Full deep-dive page available"
                    : b.tier === "tier2"
                    ? "Brand profile available"
                    : "Brand profile · Deep dive coming soon"}
                </p>
              </button>
            ))}
          </div>

          {filteredBrands.length === 0 && (
            <div className="text-center py-16" style={{ color: "#A89880" }}>
              <p className="serif text-2xl mb-2">No houses found</p>
              <p className="text-sm font-light">Try a different term or category</p>
            </div>
          )}

          <div className="text-center mt-12">
            <p className="text-sm font-light" style={{ color: "#7A6650" }}>
              Coming soon: more houses, individual fragrance pages, and search by olfactory notes.
            </p>
          </div>
        </div>
      </section>

      <section id="features" className="px-6 md:px-12 py-24" style={{ background: "#2C1F0F" }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-16" data-reveal>
            <p className="text-xs tracking-[0.3em] uppercase mb-4 font-medium" style={{ color: "#C4A882" }}>What's coming</p>
            <h2 className="serif font-light mb-5" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", color: "#F5F0E8" }}>More than recommendations</h2>
            <p className="text-base font-light max-w-xl" style={{ color: "rgba(245,240,232,0.6)" }}>ScentWise is being built to be the most thoughtful niche fragrance resource on the web.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-px" style={{ background: "rgba(196,168,130,0.1)" }}>
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="p-10 transition" style={{ background: "rgba(44,31,15,0.5)" }} onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(139,111,71,0.2)")} onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(44,31,15,0.5)")}>
                  <Icon size={28} style={{ color: "#C4A882" }} className="mb-5" />
                  <h3 className="serif text-xl mb-3" style={{ color: "#F5F0E8" }}>{f.title}</h3>
                  <p className="text-sm leading-relaxed font-light" style={{ color: "rgba(245,240,232,0.55)" }}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 py-20 text-center" style={{ background: "#5C4A32" }}>
        <Sparkles size={28} style={{ color: "#C4A882" }} className="mx-auto mb-5" />
        <h3 className="serif font-light mb-5" style={{ fontSize: "clamp(1.75rem, 3vw, 2.75rem)", color: "#F5F0E8" }}>Ready to find your next signature?</h3>
        <p className="text-sm font-light mb-8 max-w-md mx-auto" style={{ color: "rgba(245,240,232,0.65)" }}>The consultant is waiting. No signup, no friction.</p>
        <button onClick={() => scrollTo("consultor")} className="inline-flex items-center gap-3 text-xs uppercase tracking-widest px-9 py-4 transition" style={{ background: "#F5F0E8", color: "#2C1F0F" }}>
          Start the conversation <ArrowRight size={16} />
        </button>
      </section>

      <footer className="text-center py-12 px-6 border-t" style={{ background: "#2C1F0F", borderColor: "rgba(196,168,130,0.15)" }}>
        <div className="serif text-3xl tracking-[0.2em] mb-4" style={{ color: "#F5F0E8" }}>
          Scent<span style={{ color: "#C4A882" }}>Wise</span>
        </div>
        <p className="text-xs tracking-widest mb-2" style={{ color: "rgba(245,240,232,0.3)" }}>Niche fragrance, intelligently curated</p>
        <p className="text-[10px] tracking-widest" style={{ color: "rgba(245,240,232,0.2)" }}>Prototype · Content in development · Reference USD pricing</p>
      </footer>
    </div>
  );
}
