import type { CSSProperties } from "react";

const SAMPLE = "გამარჯობა Hello მეი";

const WEIGHTS: { label: string; weight: number }[] = [
  { label: "400 · Regular", weight: 400 },
  { label: "500 · Medium", weight: 500 },
  { label: "600 · SemiBold", weight: 600 },
  { label: "700 · Bold", weight: 700 },
  { label: "800 · ExtraBold", weight: 800 },
];

export default function FontsPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--gradient-page)",
        padding: "32px 22px 64px",
        color: "var(--color-ink)",
      }}
    >
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <header style={{ marginBottom: 28 }}>
          <div className="text-caption" style={{ color: "var(--color-ink-soft)" }}>
            /dev/fonts · T1.7
          </div>
          <h1 className="text-display" style={{ marginTop: 6 }}>
            DM Sans + Noto Sans Georgian
          </h1>
          <p className="text-body" style={{ color: "var(--color-ink-soft)", marginTop: 6 }}>
            <code>--font-sans</code> chains DM Sans (Latin) → Noto Sans Georgian
            (Georgian). Loaded via <code>next/font/google</code>, self-hosted, no
            runtime CDN.
          </p>
        </header>

        <Section title="🔤 Combined stack (default body font)">
          <Card>
            <div className="text-caption" style={{ color: "var(--color-ink-soft)" }}>
              font-family: var(--font-sans)
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, marginTop: 8 }}>{SAMPLE}</div>
            <div className="text-body" style={{ color: "var(--color-ink-soft)", marginTop: 6 }}>
              Latin should render in DM Sans; Georgian in Noto Sans Georgian — same baseline.
            </div>
          </Card>
        </Section>

        <Section title="🇬🇧 DM Sans only (Latin)">
          <Card>
            <div className="text-caption" style={{ color: "var(--color-ink-soft)" }}>
              font-family: var(--font-dm-sans)
            </div>
            <div
              style={{
                fontFamily: "var(--font-dm-sans), sans-serif",
                fontSize: 28,
                fontWeight: 700,
                marginTop: 8,
              }}
            >
              The quick brown fox · 0123456789
            </div>
            <div
              style={{
                fontFamily: "var(--font-dm-sans), sans-serif",
                fontSize: 28,
                fontWeight: 700,
                marginTop: 4,
              }}
            >
              {SAMPLE}
            </div>
            <div className="text-caption" style={{ color: "var(--color-ink-mute)", marginTop: 8 }}>
              Georgian glyphs are missing from DM Sans → browser uses Noto fallback.
            </div>
          </Card>
        </Section>

        <Section title="🇬🇪 Noto Sans Georgian only">
          <Card>
            <div className="text-caption" style={{ color: "var(--color-ink-soft)" }}>
              font-family: var(--font-noto-georgian)
            </div>
            <div
              style={{
                fontFamily: "var(--font-noto-georgian), sans-serif",
                fontSize: 28,
                fontWeight: 700,
                marginTop: 8,
              }}
            >
              გამარჯობა მსოფლიო · ქართული
            </div>
            <div
              style={{
                fontFamily: "var(--font-noto-georgian), sans-serif",
                fontSize: 28,
                fontWeight: 700,
                marginTop: 4,
              }}
            >
              {SAMPLE}
            </div>
          </Card>
        </Section>

        <Section title="⚖️ Weight ladder (combined stack)">
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {WEIGHTS.map((w) => (
              <Card key={w.weight}>
                <div className="text-caption" style={{ color: "var(--color-ink-soft)" }}>
                  {w.label}
                </div>
                <div style={{ fontSize: 22, fontWeight: w.weight, marginTop: 6 }}>
                  {SAMPLE}
                </div>
              </Card>
            ))}
          </div>
        </Section>

        <Section title="📐 Type scale (theme tokens, real copy)">
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {(["text-display", "text-h1", "text-h2", "text-body", "text-caption"] as const).map(
              (cls) => (
                <Card key={cls}>
                  <div className="text-caption" style={{ color: "var(--color-ink-soft)" }}>
                    <code>{cls}</code>
                  </div>
                  <div className={cls} style={{ marginTop: 6 }}>
                    {SAMPLE}
                  </div>
                </Card>
              ),
            )}
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 28 }}>
      <h2 className="text-h2" style={{ marginBottom: 12 }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        background: "var(--color-surface)",
        borderRadius: "var(--radius-md)",
        boxShadow: "var(--shadow-sm)",
        padding: 14,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
