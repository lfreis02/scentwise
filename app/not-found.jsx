export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-5" style={{ background: "var(--paper)" }}>
      <div className="max-w-md text-center">
        <p className="label mb-4">404</p>
        <h1 className="serif font-semibold mb-4" style={{ fontSize: "2rem", color: "var(--ink)" }}>
          No house here.
        </h1>
        <a href="/#houses" className="label" style={{ borderBottom: "1px solid var(--rule-firm)" }}>
          Back to all houses
        </a>
      </div>
    </div>
  );
}
