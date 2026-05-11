import type { CSSProperties, ReactNode } from "react";

export default function ComponentsDevPage() {
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
            /dev/components
          </div>
          <h1 className="text-display" style={{ marginTop: 6 }}>
            Components
          </h1>
          <p className="text-body" style={{ color: "var(--color-ink-soft)", marginTop: 6 }}>
            Primitive previews assembled from design tokens. Real components will replace these as
            they land.
          </p>
        </header>

        <Section title="Buttons">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <button type="button" style={primaryBtn}>
              Primary
            </button>
            <button type="button" style={secondaryBtn}>
              Secondary
            </button>
            <button type="button" style={ghostBtn}>
              Ghost
            </button>
            <button type="button" style={pillBtn}>
              Pill / chip
            </button>
          </div>
        </Section>

        <Section title="Cards">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: 12,
            }}
          >
            <Card>
              <div className="text-h2">Meal · breakfast</div>
              <div
                className="text-caption"
                style={{ color: "var(--color-ink-soft)", marginTop: 4 }}
              >
                09:00 · 420 kcal
              </div>
            </Card>
            <Card style={{ background: "var(--gradient-active-meal)" }}>
              <div className="text-h2">Active meal</div>
              <div className="text-caption" style={{ color: "var(--color-ink)", marginTop: 4 }}>
                Highlighted state
              </div>
            </Card>
            <Card style={{ background: "var(--gradient-workout)" }}>
              <div className="text-h2">Workout</div>
              <div
                className="text-caption"
                style={{ color: "var(--color-ink-soft)", marginTop: 4 }}
              >
                Lower body · 35 min
              </div>
            </Card>
          </div>
        </Section>

        <Section title="Pills & badges">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <Pill bg="var(--color-track-mint)">Done</Pill>
            <Pill bg="var(--color-track-yellow)">In progress</Pill>
            <Pill bg="var(--color-track-pink)">Skipped</Pill>
            <Pill bg="var(--color-water-soft)">Water</Pill>
          </div>
        </Section>

        <Section title="Progress track">
          <div
            style={{
              height: 10,
              borderRadius: "var(--radius-pill)",
              background: "var(--color-surface-2)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: "62%",
                background: "var(--gradient-brand)",
              }}
            />
          </div>
          <div className="text-caption" style={{ color: "var(--color-ink-soft)", marginTop: 6 }}>
            62% complete
          </div>
        </Section>
      </div>
    </div>
  );
}

const primaryBtn: CSSProperties = {
  background: "var(--gradient-brand)",
  color: "var(--color-ink)",
  border: "none",
  borderRadius: "var(--radius-pill)",
  padding: "10px 18px",
  fontWeight: 700,
  fontSize: 14,
  cursor: "pointer",
};

const secondaryBtn: CSSProperties = {
  background: "var(--color-surface)",
  color: "var(--color-ink)",
  border: "1px solid var(--color-ink-mute)",
  borderRadius: "var(--radius-pill)",
  padding: "10px 18px",
  fontWeight: 600,
  fontSize: 14,
  cursor: "pointer",
};

const ghostBtn: CSSProperties = {
  background: "transparent",
  color: "var(--color-ink-soft)",
  border: "none",
  borderRadius: "var(--radius-pill)",
  padding: "10px 14px",
  fontWeight: 600,
  fontSize: 14,
  cursor: "pointer",
};

const pillBtn: CSSProperties = {
  background: "var(--color-track-yellow)",
  color: "var(--color-ink)",
  border: "none",
  borderRadius: "var(--radius-pill)",
  padding: "6px 12px",
  fontWeight: 600,
  fontSize: 12,
  cursor: "pointer",
};

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ marginBottom: 28 }}>
      <h2 className="text-h2" style={{ marginBottom: 12 }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Card({ children, style }: { children: ReactNode; style?: CSSProperties }) {
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

function Pill({ children, bg }: { children: ReactNode; bg: string }) {
  return (
    <span
      style={{
        background: bg,
        color: "var(--color-ink)",
        borderRadius: "var(--radius-pill)",
        padding: "6px 12px",
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      {children}
    </span>
  );
}
