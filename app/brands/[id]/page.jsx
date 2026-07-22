import { notFound } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import { rootFamily, famFill, famText, FAMILY_LABEL } from "../../../lib/families";

export const revalidate = 60;

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
const list = (v) => (Array.isArray(v) ? v : v ? [v] : []);

export async function generateMetadata({ params }) {
  const { id } = await params;
  const { data } = await supabase.from("brands").select("name, description").eq("id", id).single();
  if (!data) return { title: "House" };
  return { title: data.name, description: data.description };
}

function Mark({ className = "" }) {
  return (
    <span className={`mark ${className}`} aria-hidden="true">
      <span className="t1" /><span className="t2" /><span className="t3" />
    </span>
  );
}

function SectionLabel({ children }) {
  return <p className="label mb-5">{children}</p>;
}

export default async function BrandPage({ params }) {
  const { id } = await params;

  const { data: brand, error } = await supabase
    .from("brands").select("*").eq("id", id).single();
  if (error || !brand) notFound();

  const { data: perfumesData } = await supabase
    .from("perfumes").select("*").eq("brand_id", id).order("sort_order", { ascending: true });
  const perfumes = perfumesData || [];

  const philosophy = brand.philosophy || {};
  const founders = brand.founders || [];
  const timeline = brand.timeline || [];
  const ingredients = brand.signature_ingredients || [];
  const retailers = brand.retailers || [];
  const perfumer = brand.signature_perfumer;
  const visual = brand.visual_identity || {};

  const noses = [...new Set(perfumes.map((p) => p.perfumer).filter(Boolean))];
  const maxNotes = Math.max(
    1,
    ...perfumes.flatMap((p) => ["top", "heart", "base"].map((k) => list(p.notes?.[k]).length))
  );

  return (
    <div className="min-h-screen" style={{ background: "var(--paper)" }}>
      {/* ---------- header ---------- */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-5 md:px-11 py-3.5"
        style={{ background: "var(--paper)", borderBottom: "1px solid var(--rule)" }}
      >
        <a href="/" className="flex items-center gap-2.5 hover:opacity-60 transition"
           style={{ color: "var(--ink)" }}>
          <Mark />
          <span className="serif text-lg font-semibold">
            Scent<span style={{ color: "var(--muted)", fontWeight: 400 }}>Wise</span>
          </span>
        </a>
        <span className="label hidden md:block">{brand.name}</span>
      </header>

      {/* ---------- hero ---------- */}
      <section
        className="px-5 md:px-11 pt-11 md:pt-14 pb-8"
        style={{
          borderBottom: "1px solid var(--rule)",
          background: "linear-gradient(180deg, var(--wash) 0%, var(--surface) 100%)",
        }}
      >
        <div className="max-w-5xl">
          <p className="label mb-6">Encyclopedia / {cap(brand.category)} house</p>
          <h1
            className="serif font-semibold leading-none mb-3"
            style={{ fontSize: "clamp(2.4rem,6vw,4.1rem)", color: "var(--ink)" }}
          >
            {brand.name}
          </h1>
          {brand.tagline && (
            <p
              className="serif italic mb-7 max-w-2xl"
              style={{ fontSize: "clamp(1.05rem,2.2vw,1.32rem)", color: "var(--muted)" }}
            >
              {brand.tagline}
            </p>
          )}

          <div
            className="flex flex-wrap gap-x-9 gap-y-5 pt-5"
            style={{ borderTop: "1px solid var(--rule)" }}
          >
            <Meta k="Founded" v={brand.origin} />
            {brand.birthplace && <Meta k="Spirit of" v={brand.birthplace} />}
            {founders[0] && <Meta k="Founder" v={founders[0].name} />}
            {perfumes.length > 0 && <Meta k="Fragrances" v={perfumes.length} />}
            {noses.length > 0 && <Meta k="Perfumers" v={noses.length} />}
          </div>

          {brand.official_url && (
            <a
              href={brand.official_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-8 label hover:opacity-60 transition"
              style={{ color: "var(--ink)", borderBottom: "1px solid var(--rule-firm)", paddingBottom: 3 }}
            >
              Visit the official site
            </a>
          )}
        </div>
      </section>

      {/* ---------- philosophy ---------- */}
      {(philosophy.headline || philosophy.body || brand.description) && (
        <Section>
          <SectionLabel>The house</SectionLabel>
          {philosophy.headline ? (
            <h2 className="serif font-semibold mb-6 max-w-2xl"
                style={{ fontSize: "clamp(1.5rem,3vw,2.1rem)", color: "var(--ink)", textWrap: "balance" }}>
              {philosophy.headline}
            </h2>
          ) : null}
          <div className="max-w-2xl space-y-4" style={{ color: "var(--muted)" }}>
            {philosophy.body ? <p>{philosophy.body}</p> : <p>{brand.description}</p>}
            {philosophy.body2 && <p>{philosophy.body2}</p>}
          </div>
          {philosophy.quote && (
            <blockquote className="mt-9 pl-6 max-w-2xl"
                        style={{ borderLeft: "2px solid var(--rule-firm)" }}>
              <p className="serif italic text-xl" style={{ color: "var(--ink-soft)" }}>
                {philosophy.quote}
              </p>
              {philosophy.quoteBy && <p className="label mt-3">{philosophy.quoteBy}</p>}
            </blockquote>
          )}
        </Section>
      )}

      {/* ---------- compositions ---------- */}
      {perfumes.length > 0 && (
        <section style={{ background: "var(--wash)", borderTop: "1px solid var(--rule)" }}>
          <div className="px-5 md:px-11 pt-11 pb-5 flex items-baseline justify-between gap-4 flex-wrap">
            <div>
              <SectionLabel>The compositions</SectionLabel>
              <h2 className="serif font-semibold" style={{ fontSize: "clamp(1.5rem,3vw,2.1rem)" }}>
                {perfumes.length} {perfumes.length === 1 ? "fragrance" : "fragrances"}
              </h2>
            </div>
            <span className="label">Open a row for the full pyramid</span>
          </div>

          <div style={{ background: "var(--surface)", borderTop: "1px solid var(--rule)" }}>
            {/* column headings, desktop only */}
            <div
              className="comp-row hidden md:grid px-11 py-2.5 label"
              style={{ borderBottom: "1px solid var(--rule)" }}
            >
              <span /><span>Fragrance</span><span className="wide">Year</span>
              <span className="wide">Family</span><span className="wide">Perfumer</span>
              <span className="wide">Pyramid</span><span />
            </div>

            {perfumes.map((p, i) => {
              const r = rootFamily(p.family);
              const tiers = [
                ["Top", list(p.notes?.top)],
                ["Heart", list(p.notes?.heart)],
                ["Base", list(p.notes?.base)],
              ];
              return (
                <details key={p.id} className="comp">
                  <summary className="comp-row px-5 md:px-11 py-3.5">
                    <span className="mono tnum text-[11px]" style={{ color: "var(--faint)" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <span className="min-w-0">
                      <span className="serif block font-semibold" style={{ fontSize: "17px" }}>
                        {p.name}
                      </span>
                      {p.inspiration && (
                        <span className="block text-[12.5px] mt-0.5" style={{ color: "var(--muted)" }}>
                          {p.inspiration}
                        </span>
                      )}
                      <span className="narrow label mt-1.5 block" style={{ color: famText(r) }}>
                        {FAMILY_LABEL[r]} · {p.year || "—"}
                      </span>
                    </span>

                    <span className="wide mono tnum text-[12px]" style={{ color: "var(--muted)" }}>
                      {p.year || "—"}
                    </span>

                    <span className="wide label" style={{ color: famText(r), fontWeight: 500 }}>
                      <i
                        className="inline-block w-2 h-2 rounded-[2px] mr-1.5 align-baseline"
                        style={{ background: famFill(r) }}
                      />
                      {FAMILY_LABEL[r]}
                    </span>

                    <span className="wide text-[12.5px] truncate" style={{ color: "var(--muted)" }}>
                      {p.perfumer || "Undisclosed"}
                    </span>

                    <span className="wide">
                      <span className="pyr" title="notes per tier">
                        {tiers.map(([t, v]) => (
                          <i
                            key={t}
                            style={{
                              background: famFill(r),
                              width: `${Math.round((v.length / maxNotes) * 26) + 4}px`,
                            }}
                          />
                        ))}
                      </span>
                    </span>

                    <span className="plus mono text-sm" style={{ color: "var(--faint)" }} />
                  </summary>

                  <div className="px-5 md:px-11 pb-7 pt-1">
                    <div
                      className="grid md:grid-cols-[1.15fr_1fr] gap-7 p-5 md:p-6"
                      style={{ background: "var(--wash)", border: "1px solid var(--rule)" }}
                    >
                      <div className="space-y-3.5">
                        {p.creation_story && (
                          <p style={{ color: "var(--muted)", fontSize: "13.5px" }}>{p.creation_story}</p>
                        )}
                        <div className="flex flex-wrap gap-x-7 gap-y-3 pt-1">
                          <Meta k="Perfumer" v={p.perfumer || "Undisclosed"} small />
                          <Meta k="Launched" v={p.year || "—"} small />
                          <Meta k="Sillage" v={p.sillage || "—"} small />
                          <Meta k="Longevity" v={p.longevity || "—"} small />
                        </div>
                        {p.best_for && (
                          <div className="pt-1">
                            <p className="label mb-1">Best for</p>
                            <p style={{ color: "var(--muted)", fontSize: "13.5px" }}>{p.best_for}</p>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        {tiers.map(([t, v]) => (
                          <div key={t} className="grid gap-3" style={{ gridTemplateColumns: "48px 1fr" }}>
                            <span className="label pt-1">{t}</span>
                            <span className="flex flex-wrap gap-1.5">
                              {v.length ? (
                                v.map((n, k) => (
                                  <span
                                    key={k}
                                    className="text-[12.5px] px-2 py-0.5 rounded-[3px]"
                                    style={{
                                      background: "var(--surface)",
                                      border: "1px solid var(--rule)",
                                      color: "var(--ink-soft)",
                                    }}
                                  >
                                    {n}
                                  </span>
                                ))
                              ) : (
                                <span className="text-[12.5px]" style={{ color: "var(--faint)" }}>
                                  Not published
                                </span>
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </details>
              );
            })}
          </div>
        </section>
      )}

      {/* ---------- founders ---------- */}
      {founders.length > 0 && (
        <Section>
          <SectionLabel>The founders</SectionLabel>
          <div className="grid md:grid-cols-2 gap-x-14 gap-y-9 max-w-5xl">
            {founders.map((f, i) => (
              <div key={i}>
                <h3 className="serif text-2xl font-semibold mb-1">{f.name}</h3>
                <p className="label mb-3">{f.role}</p>
                <p style={{ color: "var(--muted)", fontSize: "14px" }}>{f.bio}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ---------- ingredients ---------- */}
      {ingredients.length > 0 && (
        <Section wash>
          <SectionLabel>Signature materials</SectionLabel>
          <h2 className="serif font-semibold mb-8" style={{ fontSize: "clamp(1.5rem,3vw,2.1rem)" }}>
            What the house is built from.
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-9 gap-y-8">
            {ingredients.map((ing, i) => (
              <div key={i}>
                <p className="mono tnum text-[11px] mb-2" style={{ color: "var(--faint)" }}>
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h4 className="serif text-lg font-semibold mb-2">{ing.name}</h4>
                <p style={{ color: "var(--muted)", fontSize: "13.5px" }}>{ing.desc}</p>
              </div>
            ))}
          </div>
          {brand.naming_convention && (
            <div className="mt-11 pt-7 max-w-3xl" style={{ borderTop: "1px solid var(--rule)" }}>
              <p className="label mb-2">How the fragrances are named</p>
              <p style={{ color: "var(--muted)" }}>{brand.naming_convention}</p>
            </div>
          )}
        </Section>
      )}

      {/* ---------- timeline ---------- */}
      {timeline.length > 0 && (
        <Section>
          <SectionLabel>A history, in moments</SectionLabel>
          <div className="max-w-3xl">
            {timeline.map((tl, i) => (
              <div
                key={i}
                className="grid gap-6 py-4"
                style={{
                  gridTemplateColumns: "72px 1fr",
                  borderTop: i === 0 ? "none" : "1px solid var(--rule)",
                }}
              >
                <span className="mono tnum text-[13px] font-medium" style={{ color: "var(--ink)" }}>
                  {tl.year}
                </span>
                <span style={{ color: "var(--muted)" }}>{tl.event}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ---------- principal nose ---------- */}
      {perfumer?.name && (
        <Section wash>
          <SectionLabel>Principal nose</SectionLabel>
          <div className="max-w-3xl">
            <h3 className="serif text-2xl font-semibold mb-1">{perfumer.name}</h3>
            {perfumer.title && <p className="label mb-4">{perfumer.title}</p>}
            <p style={{ color: "var(--muted)" }}>{perfumer.bio}</p>
          </div>
        </Section>
      )}

      {/* ---------- visual identity ---------- */}
      {visual.description && (
        <Section>
          <SectionLabel>The look of the house</SectionLabel>
          <p className="max-w-2xl" style={{ color: "var(--muted)" }}>{visual.description}</p>
        </Section>
      )}

      {/* ---------- retailers ---------- */}
      {retailers.length > 0 && (
        <Section wash>
          <SectionLabel>Where to find it</SectionLabel>
          <div className="max-w-3xl">
            {retailers.map((r, i) => (
              <a
                key={i}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-baseline justify-between gap-5 py-3.5 hover:opacity-60 transition"
                style={{ borderBottom: "1px solid var(--rule)" }}
              >
                <span className="serif text-lg font-semibold">{r.name}</span>
                <span className="label">{r.note}</span>
              </a>
            ))}
          </div>
        </Section>
      )}

      {/* ---------- footer ---------- */}
      <footer
        className="px-5 md:px-11 py-11"
        style={{ borderTop: "1px solid var(--rule)", background: "var(--surface)" }}
      >
        <a href="/" className="inline-flex items-center gap-2.5 mb-4" style={{ color: "var(--ink)" }}>
          <Mark />
          <span className="serif text-lg font-semibold">
            Scent<span style={{ color: "var(--muted)", fontWeight: 400 }}>Wise</span>
          </span>
        </a>
        <p className="label max-w-xl" style={{ lineHeight: 1.8 }}>
          Reference only. ScentWise is independent and not affiliated with the houses it documents.
          Prices, where shown, are in USD and change without notice.
        </p>
      </footer>
    </div>
  );
}

function Section({ children, wash = false }) {
  return (
    <section
      className="px-5 md:px-11 py-11 md:py-14"
      style={{
        background: wash ? "var(--wash)" : "var(--paper)",
        borderTop: "1px solid var(--rule)",
      }}
    >
      <div className="max-w-6xl">{children}</div>
    </section>
  );
}

function Meta({ k, v, small = false }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="label">{k}</span>
      <span style={{ fontSize: small ? "13px" : "14px", color: "var(--ink)" }}>{v}</span>
    </div>
  );
}
