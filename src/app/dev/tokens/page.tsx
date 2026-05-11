import type { CSSProperties } from "react";

type ColorToken = {
  name: string;
  hex: string;
  cssVar: string;
  ink?: "light" | "dark";
};

const COLOR_GROUPS: { title: string; tokens: ColorToken[] }[] = [
  {
    title: "Backgrounds & surfaces",
    tokens: [
      { name: "bg-lilac", hex: "#F4E5FA", cssVar: "--color-bg-lilac" },
      { name: "bg-pink", hex: "#FCE4EC", cssVar: "--color-bg-pink" },
      { name: "surface", hex: "#FFFFFF", cssVar: "--color-surface" },
      { name: "surface-2", hex: "#F4ECFA", cssVar: "--color-surface-2" },
    ],
  },
  {
    title: "Ink (text)",
    tokens: [
      { name: "ink", hex: "#3D2C5F", cssVar: "--color-ink", ink: "light" },
      { name: "ink-soft", hex: "#7B6A9B", cssVar: "--color-ink-soft", ink: "light" },
      { name: "ink-mute", hex: "#B7AAD0", cssVar: "--color-ink-mute", ink: "light" },
    ],
  },
  {
    title: "Brand",
    tokens: [
      { name: "brand-lilac", hex: "#C9A8E8", cssVar: "--color-brand-lilac" },
      { name: "brand-pink", hex: "#FF9EC5", cssVar: "--color-brand-pink" },
      { name: "brand-mint", hex: "#7DDFA8", cssVar: "--color-brand-mint" },
      { name: "brand-yellow", hex: "#FFD66B", cssVar: "--color-brand-yellow" },
    ],
  },
  {
    title: "Semantic",
    tokens: [
      { name: "water", hex: "#7CC7FF", cssVar: "--color-water" },
      { name: "water-soft", hex: "#BCE3FF", cssVar: "--color-water-soft" },
      { name: "track-mint", hex: "#E7F8EE", cssVar: "--color-track-mint" },
      { name: "track-yellow", hex: "#FFF5DA", cssVar: "--color-track-yellow" },
      { name: "track-pink", hex: "#FFE6F0", cssVar: "--color-track-pink" },
    ],
  },
];

const GRADIENTS: { name: string; cssVar: string }[] = [
  { name: "page (lilac → pink)", cssVar: "--gradient-page" },
  { name: "brand (lilac → pink, 135deg)", cssVar: "--gradient-brand" },
  { name: "active meal (yellow → pink, 120deg)", cssVar: "--gradient-active-meal" },
  { name: "workout (lilac → pink, 135deg)", cssVar: "--gradient-workout" },
  { name: "water (top → bottom)", cssVar: "--gradient-water" },
  { name: "tab active (yellow → pink, 135deg)", cssVar: "--gradient-tab-active" },
];

const BLOBS: { name: string; cssVar: string }[] = [
  { name: "blob-yellow", cssVar: "--blob-yellow" },
  { name: "blob-mint", cssVar: "--blob-mint" },
  { name: "blob-lilac", cssVar: "--blob-lilac" },
];

const TYPE_SAMPLES: {
  name: string;
  tailwindClass: string;
  spec: string;
}[] = [
  { name: "Display", tailwindClass: "text-display", spec: "30px / 700 / -0.01em" },
  { name: "H1", tailwindClass: "text-h1", spec: "22px / 800" },
  { name: "H2", tailwindClass: "text-h2", spec: "16px / 700" },
  { name: "Body", tailwindClass: "text-body", spec: "14px / 500" },
  { name: "Caption", tailwindClass: "text-caption", spec: "11.5px / 600" },
];

const RADII: { name: string; px: number; cssVar: string }[] = [
  { name: "sm", px: 12, cssVar: "--radius-sm" },
  { name: "md", px: 20, cssVar: "--radius-md" },
  { name: "lg", px: 28, cssVar: "--radius-lg" },
  { name: "pill", px: 999, cssVar: "--radius-pill" },
];

const SHADOWS: { name: string; cssVar: string; description: string }[] = [
  { name: "sm", cssVar: "--shadow-sm", description: "list items" },
  { name: "md", cssVar: "--shadow-md", description: "cards" },
  { name: "lg", cssVar: "--shadow-lg", description: "elevated CTA / modal" },
];

export default function TokensPage() {
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
            /dev/tokens · Style C
          </div>
          <h1 className="text-display" style={{ marginTop: 6 }}>
            Soft Pastel Feminine
          </h1>
          <p className="text-body" style={{ color: "var(--color-ink-soft)", marginTop: 6 }}>
            Locked tokens from <code>design-prompts/_TOKENS.md</code>. Match these visually
            against <code>week-plan/screens/style-c.jsx</code>.
          </p>
        </header>

        {COLOR_GROUPS.map((group) => (
          <Section key={group.title} title={`🎨 Colors — ${group.title}`}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                gap: 12,
              }}
            >
              {group.tokens.map((t) => (
                <Swatch key={t.name} {...t} />
              ))}
            </div>
          </Section>
        ))}

        <Section title="🌈 Gradients">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: 12,
            }}
          >
            {GRADIENTS.map((g) => (
              <GradientSwatch key={g.name} name={g.name} cssVar={g.cssVar} />
            ))}
          </div>
        </Section>

        <Section title="✨ Decorative blobs (radial)">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: 12,
            }}
          >
            {BLOBS.map((b) => (
              <Card key={b.name}>
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "1 / 1",
                    borderRadius: "var(--radius-md)",
                    background: `var(${b.cssVar})`,
                  }}
                />
                <SwatchMeta name={b.name} hex={`var(${b.cssVar})`} cssVar={b.cssVar} />
              </Card>
            ))}
          </div>
        </Section>

        <Section title="🔤 Typography">
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {TYPE_SAMPLES.map((t) => (
              <Card key={t.name}>
                <div className="text-caption" style={{ color: "var(--color-ink-soft)" }}>
                  {t.name} · {t.spec} · <code>{t.tailwindClass}</code>
                </div>
                <div className={t.tailwindClass} style={{ marginTop: 6 }}>
                  გამარჯობა Hello მეი
                </div>
              </Card>
            ))}
          </div>
        </Section>

        <Section title="📐 Radii">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
              gap: 12,
            }}
          >
            {RADII.map((r) => (
              <Card key={r.name}>
                <div
                  style={{
                    width: "100%",
                    height: 64,
                    background: "var(--gradient-brand)",
                    borderRadius: `var(${r.cssVar})`,
                  }}
                />
                <SwatchMeta name={r.name} hex={`${r.px}px`} cssVar={r.cssVar} />
              </Card>
            ))}
          </div>
        </Section>

        <Section title="🌫 Shadows">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: 18,
            }}
          >
            {SHADOWS.map((s) => (
              <div key={s.name}>
                <div
                  style={{
                    width: "100%",
                    height: 88,
                    background: "var(--color-surface)",
                    borderRadius: "var(--radius-md)",
                    boxShadow: `var(${s.cssVar})`,
                  }}
                />
                <SwatchMeta name={s.name} hex={s.description} cssVar={s.cssVar} />
              </div>
            ))}
          </div>
        </Section>

        <Section title="🎬 Motion">
          <Card>
            <div className="text-body">
              Spring: stiffness <strong>260</strong>, damping <strong>18</strong> ·
              Fade: <strong>220ms</strong> ease-out · Press scale: <strong>0.97</strong>
            </div>
            <div
              className="text-caption"
              style={{ color: "var(--color-ink-soft)", marginTop: 6 }}
            >
              Consumed by Framer Motion via <code>MotionConfig</code> in T1.6. CSS animations
              and transitions are short-circuited under <code>prefers-reduced-motion</code>.
            </div>
          </Card>
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

function Swatch({ name, hex, cssVar, ink }: ColorToken) {
  return (
    <Card style={{ padding: 0, overflow: "hidden" }}>
      <div
        style={{
          height: 88,
          background: `var(${cssVar})`,
          display: "flex",
          alignItems: "flex-end",
          padding: 10,
          color: ink === "light" ? "#fff" : "var(--color-ink)",
          fontWeight: 600,
          fontSize: 11,
        }}
      >
        {hex}
      </div>
      <SwatchMeta name={name} hex={hex} cssVar={cssVar} />
    </Card>
  );
}

function GradientSwatch({ name, cssVar }: { name: string; cssVar: string }) {
  return (
    <Card style={{ padding: 0, overflow: "hidden" }}>
      <div
        style={{
          height: 88,
          background: `var(${cssVar})`,
        }}
      />
      <SwatchMeta name={name} hex={`var(${cssVar})`} cssVar={cssVar} />
    </Card>
  );
}

function SwatchMeta({ name, hex, cssVar }: { name: string; hex: string; cssVar: string }) {
  return (
    <div style={{ padding: "10px 12px 12px" }}>
      <div className="text-caption" style={{ fontWeight: 700 }}>
        {name}
      </div>
      <div
        className="text-caption"
        style={{ color: "var(--color-ink-soft)", marginTop: 2 }}
      >
        {hex}
      </div>
      <code
        style={{
          display: "block",
          marginTop: 4,
          fontSize: 10,
          color: "var(--color-ink-mute)",
        }}
      >
        {cssVar}
      </code>
    </div>
  );
}
