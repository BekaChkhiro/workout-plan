"use client";

import { useState } from "react";

type Kind = "meal" | "workout" | "water" | "weight";

const KINDS: { kind: Kind; label: string; preview: string }[] = [
  { kind: "meal", label: "🍳 Meal", preview: "კვერცხის ომლეტი — ბოსტნეული (280 კკალ)" },
  { kind: "workout", label: "💪 Workout", preview: "18:30-ზე — პილატესი 45 წთ" },
  { kind: "water", label: "💧 Water", preview: "წყლის დროა! 3/8 ჭიქა." },
  { kind: "weight", label: "⚖️ Weight", preview: "დილის წონის ჩაწერა" },
];

type Status = { kind: Kind; ok: boolean; error?: string } | null;

export default function PushTestPage() {
  const [status, setStatus] = useState<Status>(null);
  const [loading, setLoading] = useState<Kind | null>(null);

  async function fire(kind: Kind) {
    setLoading(kind);
    setStatus(null);
    try {
      const res = await fetch("/api/dev/push-test", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ kind }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      setStatus(
        json.error ? { kind, ok: false, error: json.error } : { kind, ok: json.ok === true },
      );
    } catch (e) {
      setStatus({ kind, ok: false, error: String(e) });
    } finally {
      setLoading(null);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--gradient-page)",
        padding: "32px 22px 64px",
        color: "var(--color-ink)",
      }}
    >
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        <header style={{ marginBottom: 28 }}>
          <div className="text-caption" style={{ color: "var(--color-ink-soft)" }}>
            /dev · development-only
          </div>
          <h1 className="text-display" style={{ marginTop: 6 }}>
            Push notification test
          </h1>
          <p className="text-body" style={{ color: "var(--color-ink-soft)", marginTop: 6 }}>
            Fires a test push to the owner account. Open on a subscribed device to verify delivery
            and deep-link behaviour.
          </p>
        </header>

        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 12 }}>
          {KINDS.map(({ kind, label, preview }) => (
            <li key={kind}>
              <button
                onClick={() => void fire(kind)}
                disabled={loading !== null}
                style={{
                  width: "100%",
                  textAlign: "left",
                  background: "var(--color-surface)",
                  border:
                    status?.kind === kind
                      ? `2px solid ${status.ok ? "var(--color-success, #22c55e)" : "var(--color-danger, #ef4444)"}`
                      : "2px solid transparent",
                  borderRadius: "var(--radius-md)",
                  boxShadow: "var(--shadow-sm)",
                  padding: "14px 16px",
                  cursor: loading !== null ? "not-allowed" : "pointer",
                  opacity: loading !== null && loading !== kind ? 0.5 : 1,
                }}
              >
                <div className="text-h2" style={{ marginBottom: 2 }}>
                  {loading === kind ? "Sending…" : label}
                </div>
                <div className="text-caption" style={{ color: "var(--color-ink-soft)" }}>
                  {preview}
                </div>
                {status?.kind === kind && (
                  <div
                    className="text-caption"
                    style={{
                      marginTop: 6,
                      color: status.ok
                        ? "var(--color-success, #22c55e)"
                        : "var(--color-danger, #ef4444)",
                    }}
                  >
                    {status.ok ? "✓ sent" : `✗ ${status.error ?? "failed"}`}
                  </div>
                )}
              </button>
            </li>
          ))}
        </ul>

        <p
          className="text-caption"
          style={{ marginTop: 24, color: "var(--color-ink-mute)", textAlign: "center" }}
        >
          Returns 403 in production builds.
        </p>
      </div>
    </div>
  );
}
