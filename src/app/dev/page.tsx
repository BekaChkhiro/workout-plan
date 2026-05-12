import Link from "next/link";

type DevRoute = {
  href: string;
  title: string;
  description: string;
};

const ROUTES: DevRoute[] = [
  {
    href: "/dev/push-test",
    title: "Push notification test",
    description:
      "Fire test notifications to the owner account. Open on a subscribed device to verify delivery and deep-links.",
  },
  {
    href: "/dev/tokens",
    title: "Design tokens",
    description: "Colors, gradients, typography, radii, shadows, motion — Style C source of truth.",
  },
  {
    href: "/dev/providers",
    title: "Providers smoke test",
    description: "TanStack Query + Zustand + Framer Motion sanity check.",
  },
  {
    href: "/dev/components",
    title: "Components",
    description: "UI primitives & composed pieces as they land.",
  },
];

export default function DevIndexPage() {
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
            /dev · development-only gallery
          </div>
          <h1 className="text-display" style={{ marginTop: 6 }}>
            Workout Plan — dev gallery
          </h1>
          <p className="text-body" style={{ color: "var(--color-ink-soft)", marginTop: 6 }}>
            Visual verification surfaces. These routes return 404 in production builds.
          </p>
        </header>

        <ul
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 12,
            listStyle: "none",
            padding: 0,
            margin: 0,
          }}
        >
          {ROUTES.map((r) => (
            <li key={r.href}>
              <Link
                href={r.href}
                style={{
                  display: "block",
                  background: "var(--color-surface)",
                  borderRadius: "var(--radius-md)",
                  boxShadow: "var(--shadow-sm)",
                  padding: "16px 18px",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <div className="text-h2" style={{ marginBottom: 4 }}>
                  {r.title}
                </div>
                <div className="text-body" style={{ color: "var(--color-ink-soft)" }}>
                  {r.description}
                </div>
                <code
                  className="text-caption"
                  style={{
                    display: "block",
                    marginTop: 8,
                    color: "var(--color-ink-mute)",
                  }}
                >
                  {r.href}
                </code>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
