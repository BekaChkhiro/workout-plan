"use client";

import { useEffect, useState } from "react";
import { usePushSubscription } from "@/hooks/usePushSubscription";
import { useUIStore } from "@/stores/ui-store";

// ─── Types ────────────────────────────────────────────────────────────────────

type StepId = "welcome" | "a2hs" | "notifications" | "ready";

type StepProps = {
  stepIdx: number;
  stepCount: number;
  onNext: () => void;
  onSkip: () => void;
};

// ─── Platform detection ───────────────────────────────────────────────────────

function detectPlatform(): { isIOS: boolean; isStandalone: boolean } {
  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as { standalone?: boolean }).standalone === true;
  return { isIOS, isStandalone };
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function ProgressDots({ active, total }: { active: number; total: number }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: 6,
        padding: "0 22px 28px",
        position: "relative",
        zIndex: 1,
      }}
    >
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            height: 8,
            width: i === active ? 22 : 8,
            borderRadius: 999,
            background:
              i === active ? "linear-gradient(135deg, #FFD66B 0%, #FF9EC5 100%)" : "#E8DFF7",
            transition: "all 250ms ease",
          }}
        />
      ))}
    </div>
  );
}

function PrimaryBtn({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%",
        height: 56,
        borderRadius: 999,
        background: "linear-gradient(135deg, #C9A8E8 0%, #FF9EC5 100%)",
        color: "#fff",
        fontSize: 15,
        fontWeight: 700,
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.7 : 1,
        boxShadow: "0 8px 24px rgba(255,158,197,0.38), 0 2px 8px rgba(201,168,232,0.22)",
        letterSpacing: "-0.01em",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
      }}
    >
      {children}
    </button>
  );
}

function TextBtn({
  children,
  onClick,
  color = "#7B4FA8",
}: {
  children: React.ReactNode;
  onClick: () => void;
  color?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: "transparent",
        border: "none",
        cursor: "pointer",
        fontSize: 12.5,
        fontWeight: 600,
        color,
        padding: "4px 8px",
        minHeight: 44,
        minWidth: 44,
      }}
    >
      {children}
    </button>
  );
}

function Blob({
  top,
  right,
  bottom,
  left,
  color,
  size = 230,
}: {
  top?: number | string;
  right?: number | string;
  bottom?: number | string;
  left?: number | string;
  color: string;
  size?: number;
}) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        top,
        right,
        bottom,
        left,
        width: size,
        height: size,
        borderRadius: 9999,
        background: `radial-gradient(circle, ${color} 0%, transparent 65%)`,
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

// ─── Step screens ──────────────────────────────────────────────────────────────

function WelcomeStep({ stepIdx, stepCount, onNext, onSkip }: StepProps) {
  return (
    <div
      style={{
        minHeight: "100%",
        paddingTop: 54,
        paddingBottom: 40,
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Blob top={90} left={-80} color="rgba(255,214,107,0.35)" size={230} />
      <Blob bottom={120} right={-90} color="rgba(125,223,168,0.30)" size={230} />

      <ProgressDots active={stepIdx} total={stepCount} />

      {/* Hero */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 28px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            width: 220,
            height: 220,
            borderRadius: 999,
            background: "linear-gradient(135deg, #FFD66B 0%, #FF9EC5 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 22px 44px rgba(255,158,197,0.35), 0 6px 16px rgba(255,214,107,0.25)",
            position: "relative",
            fontSize: 0,
          }}
        >
          <span
            aria-hidden="true"
            style={{ fontSize: 70, position: "absolute", top: 50, left: 56 }}
          >
            💪
          </span>
          <span
            aria-hidden="true"
            style={{ fontSize: 38, position: "absolute", top: 38, right: 48 }}
          >
            ✨
          </span>
          <span
            aria-hidden="true"
            style={{ fontSize: 60, position: "absolute", bottom: 36, right: 50 }}
          >
            🌸
          </span>
        </div>

        <h1
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: "#3D2C5F",
            textAlign: "center",
            marginTop: 32,
            lineHeight: 1.2,
            letterSpacing: "-0.01em",
          }}
        >
          კეთილი იყოს მობრძანება
        </h1>
        <p
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#7B6A9B",
            textAlign: "center",
            marginTop: 10,
            lineHeight: 1.5,
          }}
        >
          შენი პერსონალური 4-კვირიანი გეგმა
        </p>
      </div>

      {/* CTA */}
      <div style={{ padding: "0 22px 16px", position: "relative", zIndex: 1 }}>
        <PrimaryBtn onClick={onNext}>
          გავაგრძელოთ →{" "}
          <span aria-hidden="true" style={{ fontSize: 12 }}>
            ✨
          </span>
        </PrimaryBtn>
      </div>
      <div
        style={{
          textAlign: "center",
          padding: "0 22px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <TextBtn onClick={onSkip} color="#B7AAD0">
          გამოტოვება
        </TextBtn>
      </div>
    </div>
  );
}

function AddToHomeStep({ stepIdx, stepCount, onNext }: StepProps) {
  const steps = [
    "დააჭირე 🔼 Share ღილაკს",
    "აირჩიე ➕ Add to Home Screen",
    "დააჭირე 'Add' ზედა მარჯვენა კუთხეში",
  ];

  return (
    <div
      style={{
        minHeight: "100%",
        paddingTop: 54,
        paddingBottom: 40,
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Blob top={60} right={-90} color="rgba(255,214,107,0.32)" size={220} />
      <Blob top={380} left={-100} color="rgba(255,158,197,0.26)" size={220} />

      <ProgressDots active={stepIdx} total={stepCount} />

      {/* Title */}
      <div style={{ padding: "4px 22px 0", position: "relative", zIndex: 1 }}>
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#7B4FA8",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          📱 iPhone-ისთვის
        </p>
        <h1
          style={{
            fontSize: 24,
            fontWeight: 800,
            letterSpacing: "-0.01em",
            lineHeight: 1.15,
            color: "#3D2C5F",
          }}
        >
          დაამატე ეკრანზე
        </h1>
        <p
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "#7B6A9B",
            marginTop: 6,
            lineHeight: 1.45,
          }}
        >
          შეტყობინებების მისაღებად აპი უნდა იყოს მთავარ ეკრანზე
        </p>
      </div>

      {/* Mini phone illustration */}
      <div
        style={{
          margin: "20px auto 12px",
          width: 168,
          height: 200,
          borderRadius: 26,
          background: "#FFFFFF",
          border: "2px solid #EADCF5",
          boxShadow: "0 8px 24px rgba(201,168,232,0.18)",
          position: "relative",
          zIndex: 1,
          padding: "10px 12px",
          overflow: "hidden",
        }}
        aria-hidden="true"
      >
        {/* Address bar */}
        <div
          style={{
            height: 22,
            borderRadius: 8,
            background: "#F4ECFA",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 9,
            color: "#7B6A9B",
            fontWeight: 600,
          }}
        >
          🔒 fitplan.ge
        </div>
        {/* Faux content lines */}
        <div
          style={{
            marginTop: 10,
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <div
            style={{
              height: 6,
              borderRadius: 99,
              background: "#EADCF5",
              width: "80%",
            }}
          />
          <div
            style={{
              height: 6,
              borderRadius: 99,
              background: "#F4ECFA",
              width: "65%",
            }}
          />
          <div
            style={{
              height: 28,
              borderRadius: 8,
              background: "linear-gradient(135deg, #FFE6F0 0%, #E8DFF7 100%)",
              marginTop: 4,
            }}
          />
          <div
            style={{
              height: 6,
              borderRadius: 99,
              background: "#EADCF5",
              width: "50%",
            }}
          />
        </div>
        {/* Bottom toolbar with share button highlighted */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 34,
            background: "#F8F2FB",
            borderTop: "1px solid #EADCF5",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            padding: "0 14px",
          }}
        >
          <span style={{ fontSize: 12, opacity: 0.4 }}>‹</span>
          <span style={{ fontSize: 12, opacity: 0.4 }}>›</span>
          <div
            style={{
              position: "relative",
              width: 26,
              height: 26,
              borderRadius: 8,
              background: "#FFFFFF",
              border: "1.5px solid #FFD66B",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 0 4px rgba(255,214,107,0.35), 0 0 14px rgba(255,214,107,0.55)",
            }}
          >
            <svg width="11" height="13" viewBox="0 0 11 13" aria-hidden="true">
              <path
                d="M5.5 1.5v8M2.5 4l3-3 3 3M1.5 8.5v3h8v-3"
                fill="none"
                stroke="#7B4FA8"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span style={{ fontSize: 12, opacity: 0.4 }}>▢</span>
        </div>
        {/* Share label */}
        <div
          style={{
            position: "absolute",
            right: -4,
            bottom: 24,
            fontSize: 9.5,
            fontWeight: 800,
            color: "#A47000",
            background: "#FFF5DA",
            padding: "3px 7px",
            borderRadius: 8,
            border: "1px solid #FFD66B",
          }}
        >
          🔼 Share
        </div>
      </div>

      {/* Steps */}
      <div
        style={{
          padding: "0 18px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          position: "relative",
          zIndex: 1,
        }}
      >
        {steps.map((step, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 16px",
              borderRadius: 20,
              background: "#FFFFFF",
              boxShadow: "0 2px 8px rgba(201,168,232,0.10)",
              border: "1px solid rgba(244,236,250,0.8)",
            }}
          >
            <div
              aria-hidden="true"
              style={{
                width: 32,
                height: 32,
                borderRadius: 999,
                background: "linear-gradient(135deg, #FFD66B 0%, #FF9EC5 100%)",
                color: "#fff",
                fontSize: 14,
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 6px rgba(255,158,197,0.35)",
                flexShrink: 0,
              }}
            >
              {i + 1}
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#3D2C5F",
                lineHeight: 1.35,
              }}
            >
              {step}
            </div>
          </div>
        ))}
      </div>

      <div style={{ flex: 1 }} />

      {/* CTA */}
      <div style={{ padding: "14px 22px 8px", position: "relative", zIndex: 1 }}>
        <PrimaryBtn onClick={onNext}>გავიგე ✓</PrimaryBtn>
      </div>
      <div
        style={{
          textAlign: "center",
          padding: "0 22px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <TextBtn onClick={onNext}>მე უკვე დავამატე</TextBtn>
      </div>
    </div>
  );
}

function NotificationsStep({ stepIdx, stepCount, onNext, onSkip }: StepProps) {
  const { subscribe, loading, permission } = usePushSubscription();
  const showToast = useUIStore((s) => s.showToast);

  const handleEnable = async () => {
    try {
      await subscribe();
      showToast("🔔 შეტყობინებები ჩართულია!", "success");
    } catch {
      // permission denied or unsupported — advance anyway
    } finally {
      onNext();
    }
  };

  const timeChips = ["🍳 10:00", "🫐 12:30", "🍗 15:00", "🥜 17:30", "💪 18:30", "🥗 20:00"];

  const alreadyGranted = permission === "granted";

  return (
    <div
      style={{
        minHeight: "100%",
        paddingTop: 54,
        paddingBottom: 40,
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Blob top={90} left={-90} color="rgba(125,223,168,0.32)" size={230} />
      <Blob bottom={100} right={-90} color="rgba(255,214,107,0.32)" size={230} />

      <ProgressDots active={stepIdx} total={stepCount} />

      {/* Hero bell */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "24px 0 18px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            position: "relative",
            width: 180,
            height: 180,
            borderRadius: 999,
            background: "linear-gradient(135deg, #C9A8E8 0%, #FF9EC5 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 18px 36px rgba(201,168,232,0.4), 0 4px 12px rgba(255,158,197,0.3)",
          }}
        >
          <span aria-hidden="true" style={{ fontSize: 78 }}>
            🔔
          </span>
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              top: -4,
              right: 14,
              fontSize: 22,
            }}
          >
            ✨
          </span>
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: 4,
              left: -4,
              fontSize: 18,
            }}
          >
            ✦
          </span>
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 28,
              left: -10,
              fontSize: 16,
            }}
          >
            ✧
          </span>
        </div>
      </div>

      <div
        style={{
          padding: "0 28px",
          position: "relative",
          zIndex: 1,
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "#3D2C5F",
            lineHeight: 1.2,
            letterSpacing: "-0.01em",
          }}
        >
          შეგახსენო კვება და ვარჯიში?
        </h2>
        <p
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: "#7B6A9B",
            marginTop: 8,
            lineHeight: 1.45,
          }}
        >
          5 კვება + ვარჯიში — ყოველდღე სწორ დროზე
        </p>
      </div>

      {/* Time chips */}
      <div
        style={{
          margin: "22px 22px 0",
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          justifyContent: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {timeChips.map((c) => (
          <span
            key={c}
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "#3D2C5F",
              background: "rgba(255,255,255,0.85)",
              border: "1px solid rgba(244,236,250,0.85)",
              borderRadius: 999,
              padding: "5px 11px",
              backdropFilter: "blur(6px)",
            }}
          >
            {c}
          </span>
        ))}
      </div>

      <div
        style={{
          textAlign: "center",
          padding: "14px 22px 0",
          position: "relative",
          zIndex: 1,
        }}
      >
        <p style={{ fontSize: 11, fontWeight: 500, color: "#7B6A9B" }}>
          შეგიძლია მოგვიანებით პროფილში გამორთო
        </p>
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ padding: "14px 22px 8px", position: "relative", zIndex: 1 }}>
        <PrimaryBtn onClick={alreadyGranted ? onNext : handleEnable} disabled={loading}>
          {loading ? "..." : alreadyGranted ? "✓ შეტყობინებები ჩართულია" : "🔔 ჩართე შეტყობინებები"}
        </PrimaryBtn>
      </div>
      <div
        style={{
          textAlign: "center",
          padding: "0 22px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <TextBtn onClick={onSkip} color="#B7AAD0">
          ახლა არა
        </TextBtn>
      </div>
    </div>
  );
}

const sparkleStars = [
  { top: 10, left: 28, fontSize: 22, color: "#FFD66B" },
  { top: 30, right: 24, fontSize: 18, color: "#FF9EC5" },
  { bottom: 14, left: 18, fontSize: 20, color: "#7DDFA8" },
  { bottom: 30, right: 12, fontSize: 24, color: "#C9A8E8" },
  { top: 60, left: -6, fontSize: 16, color: "#FF9EC5" },
  { top: 80, right: -2, fontSize: 18, color: "#FFD66B" },
  { bottom: 60, left: 60, fontSize: 14, color: "#7DDFA8" },
  { bottom: 80, right: 60, fontSize: 16, color: "#C9A8E8" },
] as const;

function ReadyStep({ stepIdx, stepCount, onNext }: StepProps) {
  const stats = [
    { v: "4", c: "კვირა" },
    { v: "5", c: "კვება/დღე" },
    { v: "5", c: "ვარჯიში/კვ" },
  ];

  return (
    <div
      style={{
        minHeight: "100%",
        paddingTop: 54,
        paddingBottom: 40,
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <style>{`
        @keyframes confetti-float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(12deg); }
        }
      `}</style>

      <Blob top={60} right={-90} color="rgba(255,214,107,0.32)" size={230} />
      <Blob bottom={100} left={-90} color="rgba(255,158,197,0.30)" size={230} />
      <Blob top={360} left={120} color="rgba(125,223,168,0.22)" size={180} />

      <ProgressDots active={stepIdx} total={stepCount} />

      {/* Hero */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 28px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            position: "relative",
            width: 240,
            height: 240,
            borderRadius: 999,
            background: "radial-gradient(circle, #E7F8EE 0%, rgba(231,248,238,0) 70%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span aria-hidden="true" style={{ fontSize: 92, zIndex: 2 }}>
            🎉
          </span>
          {sparkleStars.map((s, i) => (
            <span
              key={i}
              aria-hidden="true"
              style={{
                position: "absolute",
                top: "top" in s ? s.top : undefined,
                bottom: "bottom" in s ? s.bottom : undefined,
                left: "left" in s ? s.left : undefined,
                right: "right" in s ? s.right : undefined,
                fontSize: s.fontSize,
                color: s.color,
                animation: "confetti-float 2s ease-in-out infinite",
                animationDelay: `${i * 0.3}s`,
              }}
            >
              {i % 2 === 0 ? "✨" : i % 3 === 0 ? "✦" : "✧"}
            </span>
          ))}
        </div>

        <h1
          style={{
            fontSize: 30,
            fontWeight: 800,
            color: "#3D2C5F",
            textAlign: "center",
            marginTop: 18,
            letterSpacing: "-0.01em",
          }}
        >
          მზად ხარ! ✨
        </h1>
        <p
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: "#7B6A9B",
            textAlign: "center",
            marginTop: 8,
            lineHeight: 1.45,
          }}
        >
          შენი 4-კვირიანი მოგზაურობა იწყება დღეს
        </p>

        {/* Stats preview card */}
        <div
          style={{
            marginTop: 24,
            alignSelf: "stretch",
            padding: "16px 18px",
            borderRadius: 20,
            background: "#FFFFFF",
            boxShadow: "0 4px 16px rgba(255,158,197,0.18), 0 1px 4px rgba(201,168,232,0.12)",
            display: "flex",
          }}
        >
          {stats.map((s, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                textAlign: "center",
                borderRight: i < 2 ? "1px solid #F4ECFA" : "none",
              }}
            >
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: "#3D2C5F",
                  lineHeight: 1,
                }}
              >
                {s.v}
              </div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: "#7B6A9B",
                  marginTop: 6,
                }}
              >
                {s.c}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "14px 22px 8px", position: "relative", zIndex: 1 }}>
        <PrimaryBtn onClick={onNext}>მოგზაურობა იწყება ✨</PrimaryBtn>
      </div>
      <div
        style={{
          textAlign: "center",
          padding: "0 22px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <p style={{ fontSize: 11, fontWeight: 500, color: "#7B6A9B" }}>შენ შეგიძლია 💪</p>
      </div>
    </div>
  );
}

// ─── Main flow ─────────────────────────────────────────────────────────────────

const STEP_COMPONENTS: Record<StepId, React.ComponentType<StepProps>> = {
  welcome: WelcomeStep,
  a2hs: AddToHomeStep,
  notifications: NotificationsStep,
  ready: ReadyStep,
};

export function OnboardingFlow({ onDone }: { onDone: () => void }) {
  const [steps] = useState<StepId[]>(() => {
    if (typeof window === "undefined") return ["welcome", "notifications", "ready"];
    const { isIOS, isStandalone } = detectPlatform();
    return isIOS && !isStandalone
      ? ["welcome", "a2hs", "notifications", "ready"]
      : ["welcome", "notifications", "ready"];
  });
  const [stepIdx, setStepIdx] = useState(0);

  const next = () => setStepIdx((i) => i + 1);

  useEffect(() => {
    if (stepIdx >= steps.length && steps.length > 0) {
      onDone();
    }
  }, [stepIdx, steps.length, onDone]);

  const currentStepId = steps[stepIdx];
  if (!currentStepId) return null;

  const StepComponent = STEP_COMPONENTS[currentStepId];

  return <StepComponent stepIdx={stepIdx} stepCount={steps.length} onNext={next} onSkip={onDone} />;
}
