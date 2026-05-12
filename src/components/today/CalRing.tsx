import type { ReactNode } from "react";

type CalRingProps = {
  size?: number;
  stroke?: number;
  pct: number;
  track?: string;
  gradientId?: string;
  gradFrom?: string;
  gradTo?: string;
  children?: ReactNode;
};

export function CalRing({
  size = 114,
  stroke = 13,
  pct,
  track = "#F4ECFA",
  gradientId = "ringGradC",
  gradFrom = "#FF9EC5",
  gradTo = "#C9A8E8",
  children,
}: CalRingProps) {
  const clamped = Math.max(0, Math.min(1, pct));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - clamped);
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={gradFrom} />
            <stop offset="100%" stopColor={gradTo} />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={off}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
    </div>
  );
}
