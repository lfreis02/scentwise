"use client";

export default function Error({ error, reset }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-5" style={{ background: "var(--paper)" }}>
      <div className="max-w-md text-center">
        <p className="label mb-4">Something went wrong</p>
        <h1 className="serif font-semibold mb-4" style={{ fontSize: "2rem", color: "var(--ink)" }}>
          The house didn&apos;t open.
        </h1>
        <p className="mb-8" style={{ color: "var(--muted)" }}>
          Try again, or head back to all houses.
        </p>
        <button
          onClick={() => reset()}
          className="label px-4 py-2.5"
          style={{ background: "var(--ink)", color: "var(--paper)" }}
        >
          Try again
        </button>
      </div>
    </div>
  );
}
