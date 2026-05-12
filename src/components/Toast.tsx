"use client";

import { useEffect } from "react";

import { useUIStore } from "@/stores/ui-store";

const TOAST_DURATION_MS = 3000;

export function Toast() {
  const toasts = useUIStore((s) => s.toasts);
  const dismissToast = useUIStore((s) => s.dismissToast);

  const oldest = toasts[0];

  useEffect(() => {
    if (!oldest) return;
    const timer = setTimeout(() => dismissToast(oldest.id), TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [oldest, dismissToast]);

  if (!oldest) return null;

  const icon = oldest.type === "success" ? "✓" : oldest.type === "error" ? "✕" : "ℹ";

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed bottom-32 left-1/2 z-50 -translate-x-1/2 px-4"
    >
      <div
        className="flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold shadow-lg"
        style={{
          background:
            oldest.type === "success" ? "#e7f8ee" : oldest.type === "error" ? "#ffe6f0" : "#f4ecfa",
          color: "#3d2c5f",
          border: "1px solid",
          borderColor:
            oldest.type === "success" ? "#7ddfa8" : oldest.type === "error" ? "#ff9ec5" : "#c9a8e8",
        }}
      >
        <span>{icon}</span>
        <span>{oldest.message}</span>
      </div>
    </div>
  );
}
