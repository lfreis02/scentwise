import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, FlaskConical, Quote } from "lucide-react";
import { supabase } from "../../../lib/supabase";

export const revalidate = 60;

const THEMES = {
  kraft: {
    bg: "#F4EFE6", ink: "#1A1A1A", body: "#3A3A3A",
    dark: "#1A1A1A", onDark: "#F4EFE6", onDarkMuted: "rgba(244,239,230,0.70)",
    accent: "#A67C52", altBg: "#E8DFD0", mono: "mono",
  },
  gold: {
    bg: "#FAF6EE", ink: "#1A1A1A", body: "#3A3026",
    dark: "#141109", onDark: "#F8F4ED", onDarkMuted: "rgba(248,244,237,0.70)",
    accent: "#B8954A", altBg: "#F0E9DA", mono: "mono-luxury",
  },
  creed: {
    bg: "#F2EEE4", ink: "#1C2620", body: "#3A3F38",
    dark: "#15241C", onDark: "#EFEADD", onDarkMuted: "rgba(239,234,221,0.72)",
    accent: "#A8894E", altBg: "#E4E2D4", mono: "mono-luxury",
  },
};

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

export async function generateMetadata({ params }) {
  const { id } = await params;
  const { data } = await supabase.from("brands").select("name").eq("id", id).single();
  return { title: data ? `${data.name} · ScentWise` : "Brand · ScentWise" };
}

export default async function BrandPage({ params }) {
  const { id } = await params;

  const { data: brand, error } = await supabase
    .from("brands").select("*").eq("id", id).single();
  if (error || !brand) notFound();

  const { data: perfumesData } = await supabase
    .from("perfumes").select("*").eq("brand_id", id).order("sort_order", { ascending: true });
  const perfumes = perfumesData || [];

  const t = THEMES[brand.aesthetic_theme] || THEMES.kraft;
  const philosophy = brand.philosophy || {};
  const founders = brand.founders || [];
  const timeline = brand.timeline || [];
  const ingredients = brand.signature_ingredients || [];
  const retailers = brand.retailers || [];
  const perfumer = brand.signature_perfumer;
  const visual = brand.visual_identity || {};
  const m = t.mono;

  return (
    <div style={{ minHeight: "100vh", background: t.bg, color: t.ink, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Cormorant:wght@300;400&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        .serif { font-family: 'Cormorant Garamond', Georgia, serif; }
        .mono { font-family: 'JetBrains Mono', 'Courier New', monospace; }
        .mono-luxury { font-family: 'Cormorant', 'Cormorant Garamond', serif; letter-spacing: 0.18em; }
        .label-line { background-image: repeating-linear-gradient(90deg, currentColor 0, currentColor 4px, transparent 4px, transparent 8px); height: 1px; }
        details > summary { list-style: none; cursor: pointer; }
        details > summary::-webkit-details-marker { display: none; }
        .acc-ind::after { content: "+"; }
        details[open] .acc-ind::after { content: "\\2014"; }
      `}</style>

      <div className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-5 flex items-center justify-between"
        style={{ background: t.bg, backdropFilter: "blur(10px)", borderBottom: `1px solid ${t.ink}1A` }}>
        <a href="/" className={`flex items-center gap-2 text-xs uppercase tracking-[0.2em] hover:opacity-60 transition ${m}`}>
          <ArrowLeft size={14} /> back to scentwise
        </a>
        <span className={`text-xs uppercase tracking-[0.2em] opacity-50 hidden md:block ${m}`}>
          brand · {brand.name}
        </span>
      </div>

      <section className="pt-28 md:pt-32 pb-16 md:pb-24 px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="border-2 inline-block px-8 py-6 mb-10" style={{ borderColor: t.ink, background: t.bg }}>
            <p className={`${m} text-[10px] uppercase tracking-[0.3em] mb-2 opacity-60`}>{cap(brand.category)} house</p>
            <h1 className="serif font-light leading-none mb-3" style={{ fontSize: "clamp(3rem, 9vw, 7rem)", letterSpacing: "0.02em" }}>{brand.name}</h1>
            <div className="label-line mb-3"></div>
            <p className={`${m} text-[11px] uppercase tracking-[0.2em] opacity-70`}>{brand.origin}</p>
          </div>

          {brand.tagline && (
            <p className="serif italic font-light max-w-3xl mb-12" style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", lineHeight: 1.4, color: t.body }}>
              "{brand.tagline}"
            </p>
          )}

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl">
            <div className="border-l-2 pl-4" style={{ borderColor: t.ink }}>
              <p className={`${m} text-[10px] uppercase tracking-[0.2em] opacity-50 mb-2`}>founded</p>
              <p className="text-base">{brand.origin}</p>
            </div>
            {brand.birthplace && (
              <div className="border-l-2 pl-4" style={{ borderColor: t.ink }}>
                <p className={`${m} text-[10px] uppercase tracking-[0.2em] opacity-50 mb-2`}>spirit of</p>
                <p className="text-base">{brand.birthplace}</p>
              </div>
            )}
            <div className="border-l-2 pl-4" style={{ borderColor: t.ink }}>
              <p className={`${m} text-[10px] uppercase tracking-[0.2em] opacity-50 mb-2`}>collection</p>
              <p className="text-base">{perfumes.length} signature scents</p>
            </div>
          </div>

          {brand.official_url && (
            <a href={brand.official_url} target="_blank" rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 mt-12 ${m} text-xs uppercase tracking-[0.2em] border-b pb-1 hover:opacity-60 transition`}
              style={{ borderColor: t.ink }}>
              visit official site <ExternalLink size={12} />
            </a>
          )}
        </div>
      </section>

       {!philosophy.headline && !philosophy.body && brand.description && (
       <section className="px-6 md:px-10 pb-16 md:pb-24" style={{ background: t.bg }}>
           <div className="max-w-3xl mx-auto">
            <p className={`${m} text-[10px] uppercase tracking-[0.3em] opacity-50 mb-6`}>— about the house</p>
            <p className="text-base md:text-lg font-light leading-relaxed" style={{ color: t.body }}>{brand.description}</p>
           </div>
       </section>
      )}

      {(philosophy.headline || philosophy.body) && (
        <section className="px-6 md:px-10 py-20 md:py-28" style={{ background: t.dark, color: t.onDark }}>
          <div className="max-w-4xl mx-auto">
            <p className={`${m} text-[10px] uppercase tracking-[0.3em] opacity-50 mb-6`}>— philosophy</p>
            {philosophy.headline && (
              <h2 className="serif font-light mb-12" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", lineHeight: 1.2 }}>
                {philosophy.headline}
              </h2>
            )}
            <div className="space-y-6 text-base md:text-lg font-light leading-relaxed" style={{ color: t.onDarkMuted }}>
              {philosophy.body && <p>{philosophy.body}</p>}
              {philosophy.body2 && <p>{philosophy.body2}</p>}
            </div>
            {philosophy.quote && (
              <blockquote className="mt-16 pl-8 border-l-2" style={{ borderColor: t.accent }}>
                <Quote size={20} style={{ color: t.accent }} className="mb-3" />
                <p className="serif italic font-light text-xl md:text-2xl mb-3" style={{ color: t.onDark, lineHeight: 1.5 }}>
                  "{philosophy.quote}"
                </p>
                {philosophy.quoteBy && (
                  <p className={`${m} text-xs uppercase tracking-[0.2em]`} style={{ color: t.onDarkMuted }}>— {philosophy.quoteBy}</p>
                )}
              </blockquote>
            )}
          </div>
        </section>
      )}

      {founders.length > 0 && (
        <section className="px-6 md:px-10 py-20 md:py-28" style={{ background: t.bg }}>
          <div className="max-w-6xl mx-auto">
            <p className={`${m} text-[10px] uppercase tracking-[0.3em] opacity-50 mb-6`}>— the founders</p>
            <h2 className="serif font-light mb-16" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>The people behind the house.</h2>
            <div className="grid md:grid-cols-2 gap-12 md:gap-20">
              {founders.map((f, i) => (
                <div key={i}>
                  <p className={`${m} text-[10px] uppercase tracking-[0.2em] opacity-50 mb-3`}>{String(i + 1).padStart(2, "0")} / {String(founders.length).padStart(2, "0")}</p>
                  <h3 className="serif text-3xl md:text-4xl mb-2 font-light">{f.name}</h3>
                  <p className={`${m} text-xs uppercase tracking-[0.15em] mb-6 opacity-70`}>{f.role}</p>
                  <div className="label-line mb-6"></div>
                  <p className="text-base font-light leading-relaxed" style={{ color: t.body }}>{f.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {timeline.length > 0 && (
        <section className="px-6 md:px-10 py-20 md:py-28" style={{ background: t.altBg }}>
          <div className="max-w-4xl mx-auto">
            <p className={`${m} text-[10px] uppercase tracking-[0.3em] opacity-50 mb-6`}>— timeline</p>
            <h2 className="serif font-light mb-16" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>A history, in moments.</h2>
            <div className="space-y-10">
              {timeline.map((tl, i) => (
                <div key={i} className="grid grid-cols-[100px_1fr] md:grid-cols-[140px_1fr] gap-6 md:gap-10 items-start">
                  <p className={`${m} text-base md:text-lg font-medium`} style={{ color: t.ink }}>{tl.year}</p>
                  <div className="border-l-2 pl-6" style={{ borderColor: t.ink }}>
                    <p className="text-base md:text-lg font-light leading-relaxed">{tl.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {perfumer && perfumer.name && (
        <section className="px-6 md:px-10 py-20 md:py-28" style={{ background: t.bg }}>
          <div className="max-w-5xl mx-auto">
            <p className={`${m} text-[10px] uppercase tracking-[0.3em] opacity-50 mb-6`}>— principal nose</p>
            <h2 className="serif font-light mb-16" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>The nose behind the work.</h2>
            <div className="border-2 p-8 md:p-12" style={{ borderColor: t.ink }}>
              <div className="flex items-start gap-4 mb-6">
                <FlaskConical size={32} style={{ color: t.ink }} />
                <div>
                  <h3 className="serif text-3xl md:text-4xl font-light mb-2">{perfumer.name}</h3>
                  {perfumer.title && <p className={`${m} text-xs uppercase tracking-[0.15em] opacity-70`}>{perfumer.title}</p>}
                </div>
              </div>
              <div className="label-line mb-6"></div>
              <p className="text-base md:text-lg font-light leading-relaxed" style={{ color: t.body }}>{perfumer.bio}</p>
            </div>
          </div>
        </section>
      )}

      {ingredients.length > 0 && (
        <section className="px-6 md:px-10 py-20 md:py-28" style={{ background: t.dark, color: t.onDark }}>
          <div className="max-w-6xl mx-auto">
            <p className={`${m} text-[10px] uppercase tracking-[0.3em] mb-6`} style={{ color: t.onDarkMuted }}>— signature ingredients</p>
            <h2 className="serif font-light mb-16" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>The materials that define the house.</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
              {ingredients.map((ing, i) => (
                <div key={i}>
                  <p className={`${m} text-[10px] uppercase tracking-[0.2em] mb-2`} style={{ color: t.onDarkMuted }}>{String(i + 1).padStart(2, "0")}</p>
                  <h4 className="serif text-2xl mb-3 font-light" style={{ color: t.onDark }}>{ing.name}</h4>
                  <p className="text-sm font-light leading-relaxed" style={{ color: t.onDarkMuted }}>{ing.desc}</p>
                </div>
              ))}
            </div>
            {brand.naming_convention && (
              <div className="mt-20 pt-10 border-t" style={{ borderColor: "rgba(255,255,255,0.15)" }}>
                <p className={`${m} text-[10px] uppercase tracking-[0.2em] mb-4`} style={{ color: t.onDarkMuted }}>— naming convention</p>
                <p className="text-base md:text-lg font-light leading-relaxed max-w-3xl" style={{ color: t.onDarkMuted }}>{brand.naming_convention}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {perfumes.length > 0 && (
        <section className="px-6 md:px-10 py-20 md:py-28" style={{ background: t.bg }}>
          <div className="max-w-6xl mx-auto">
            <p className={`${m} text-[10px] uppercase tracking-[0.3em] opacity-50 mb-6`}>— the compositions</p>
            <h2 className="serif font-light mb-6" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>The compositions.</h2>
            <p className="text-base md:text-lg font-light max-w-2xl mb-16" style={{ color: t.body }}>
              Each fragrance is a story. Open any composition to read its origin, its perfumer's intent, and the full pyramid.
            </p>

            <div className="space-y-3">
              {perfumes.map((p, i) => {
                const notes = p.notes || {};
                return (
                  <details key={p.id} style={{ borderWidth: 2, borderStyle: "solid", borderColor: t.ink, background: t.bg }}>
                    <summary className="p-6 md:p-8">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-baseline gap-4 md:gap-8 flex-wrap">
                          <span className={`${m} text-xs md:text-sm opacity-50`}>{String(i + 1).padStart(2, "0")}</span>
                          <h3 className="serif text-2xl md:text-4xl font-light tracking-wide">{p.name}</h3>
                          <span className={`${m} text-xs uppercase tracking-[0.15em] opacity-60 hidden md:inline`}>{p.family} · {p.year}</span>
                        </div>
                        <span className={`acc-ind ${m} text-xs`}></span>
                      </div>
                      <p className={`${m} text-xs uppercase tracking-[0.15em] opacity-60 md:hidden mt-2`}>{p.family} · {p.year}</p>
                    </summary>

                    <div className="p-6 md:p-10 border-t-2" style={{ borderColor: t.ink, background: "#ffffff", color: "#1A1A1A" }}>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10 pb-8 border-b" style={{ borderColor: "rgba(0,0,0,0.15)" }}>
                        <div><p className={`${m} text-[10px] uppercase tracking-[0.15em] opacity-50 mb-1`}>perfumer</p><p className="text-sm font-medium">{p.perfumer}</p></div>
                        <div><p className={`${m} text-[10px] uppercase tracking-[0.15em] opacity-50 mb-1`}>launched</p><p className="text-sm font-medium">{p.year}</p></div>
                        <div><p className={`${m} text-[10px] uppercase tracking-[0.15em] opacity-50 mb-1`}>sillage</p><p className="text-sm font-medium">{p.sillage}</p></div>
                        <div><p className={`${m} text-[10px] uppercase tracking-[0.15em] opacity-50 mb-1`}>longevity</p><p className="text-sm font-medium">{p.longevity}</p></div>
                      </div>

                      {p.inspiration && (
                        <div className="mb-10">
                          <p className={`${m} text-[10px] uppercase tracking-[0.2em] opacity-50 mb-3`}>— inspiration</p>
                          <p className="serif italic text-lg md:text-xl font-light leading-relaxed" style={{ color: "#3A3A3A" }}>{p.inspiration}</p>
                        </div>
                      )}

                      {p.creation_story && (
                        <div className="mb-10">
                          <p className={`${m} text-[10px] uppercase tracking-[0.2em] opacity-50 mb-3`}>— the creation</p>
                          <p className="text-base font-light leading-relaxed" style={{ color: "#3A3A3A" }}>{p.creation_story}</p>
                        </div>
                      )}

                      <div className="mb-10">
                        <p className={`${m} text-[10px] uppercase tracking-[0.2em] opacity-50 mb-4`}>— olfactive pyramid</p>
                        <div className="border-l-2 pl-6 space-y-5" style={{ borderColor: t.ink }}>
                          <div><p className={`${m} text-[10px] uppercase tracking-[0.15em] opacity-60 mb-1`}>top notes</p><p className="serif text-lg font-light italic">{notes.top}</p></div>
                          <div><p className={`${m} text-[10px] uppercase tracking-[0.15em] opacity-60 mb-1`}>heart notes</p><p className="serif text-lg font-light italic">{notes.heart}</p></div>
                          <div><p className={`${m} text-[10px] uppercase tracking-[0.15em] opacity-60 mb-1`}>base notes</p><p className="serif text-lg font-light italic">{notes.base}</p></div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-8 pt-8 border-t" style={{ borderColor: "rgba(0,0,0,0.15)" }}>
                        <div>
                          <p className={`${m} text-[10px] uppercase tracking-[0.2em] opacity-50 mb-3`}>— best for</p>
                          <p className="text-base font-light leading-relaxed" style={{ color: "#3A3A3A" }}>{p.best_for}</p>
                        </div>
                        <div>
                          <p className={`${m} text-[10px] uppercase tracking-[0.2em] opacity-50 mb-3`}>— price</p>
                          <p className="serif text-2xl font-light">{p.price}</p>
                          <p className={`${m} text-[10px] uppercase tracking-[0.15em] opacity-50 mt-2`}>eau de parfum</p>
                        </div>
                      </div>
                    </div>
                  </details>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {visual.description && (
        <section className="px-6 md:px-10 py-20 md:py-28" style={{ background: t.altBg }}>
          <div className="max-w-4xl mx-auto">
            <p className={`${m} text-[10px] uppercase tracking-[0.3em] opacity-50 mb-6`}>— visual identity</p>
            <h2 className="serif font-light mb-12" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>The world of the house.</h2>
            <p className="text-base md:text-lg font-light leading-relaxed" style={{ color: t.body }}>{visual.description}</p>
          </div>
        </section>
      )}

      {retailers.length > 0 && (
        <section className="px-6 md:px-10 py-20 md:py-28" style={{ background: t.bg }}>
          <div className="max-w-4xl mx-auto">
            <p className={`${m} text-[10px] uppercase tracking-[0.3em] opacity-50 mb-6`}>— where to find it</p>
            <h2 className="serif font-light mb-12" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>Authorized retailers.</h2>
            <div className="space-y-2">
              {retailers.map((r, i) => (
                <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-between gap-4 p-5 border-2 transition hover:opacity-80 group" style={{ borderColor: t.ink }}>
                  <div className="flex-1">
                    <p className="serif text-xl font-light mb-1">{r.name}</p>
                    <p className={`${m} text-xs uppercase tracking-[0.15em] opacity-60`}>{r.note}</p>
                  </div>
                  <ExternalLink size={16} className="opacity-40 group-hover:opacity-100 transition" />
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <footer className="px-6 md:px-10 py-12 text-center" style={{ background: t.dark, color: t.onDark }}>
        <div className="max-w-4xl mx-auto">
          <div className="border-2 inline-block px-8 py-4" style={{ borderColor: t.onDark }}>
            <p className={`${m} text-[10px] uppercase tracking-[0.3em] opacity-50 mb-1`}>{brand.name} · brand profile</p>
            <p className="serif text-xl font-light">curated by ScentWise</p>
          </div>
          <p className={`${m} text-[10px] uppercase tracking-[0.2em] opacity-40 mt-6`}>all prices in usd · reference only · check official retailers for current pricing</p>
        </div>
      </footer>
    </div>
  );
}