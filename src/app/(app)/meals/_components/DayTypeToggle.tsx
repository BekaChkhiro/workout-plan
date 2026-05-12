import Link from "next/link";

import type { DayType } from "@/db/queries";

const TABS: { value: DayType; label: string }[] = [
  { value: "workout", label: "💪 ვარჯიშის დღე ✨" },
  { value: "rest", label: "😴 დასვენების დღე" },
];

export function DayTypeToggle({ dayType, mealCount }: { dayType: DayType; mealCount: number }) {
  return (
    <div className="relative z-1 px-[18px]">
      <div
        role="tablist"
        aria-label="დღის ტიპი"
        className="border-surface/70 flex gap-1 rounded-full border bg-white/55 p-[5px] backdrop-blur-md"
        style={{ boxShadow: "0 2px 10px rgba(201,168,232,0.15)" }}
      >
        {TABS.map((tab) => {
          const active = tab.value === dayType;
          return (
            <Link
              key={tab.value}
              role="tab"
              aria-selected={active}
              href={`/meals?day=${tab.value}`}
              scroll={false}
              prefetch={false}
              className={`flex-1 rounded-full px-1 py-2.5 text-center text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-pink)] ${
                active ? "font-extrabold text-white" : "text-ink-soft font-semibold"
              }`}
              style={
                active
                  ? {
                      background: "var(--gradient-tab-active)",
                      boxShadow: "0 3px 10px rgba(255,158,197,0.4)",
                      textShadow: "0 1px 1px rgba(90,58,10,0.18)",
                    }
                  : undefined
              }
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
      <div className="text-ink-mute mt-2 text-center text-[10.5px] font-semibold tracking-wide">
        {mealCount} კვება · საათობრივად
      </div>
    </div>
  );
}
