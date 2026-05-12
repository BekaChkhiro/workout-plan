"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";

import type { FourWeekPlan, PlanDay } from "@/db/queries";

const WEEKDAY_LABELS_KA = [
  "ორშაბათი",
  "სამშაბათი",
  "ოთხშაბათი",
  "ხუთშაბათი",
  "პარასკევი",
  "შაბათი",
  "კვირა",
] as const;

type WeekMeta = { label: string; pct: number; color: string };

const WEEK_META: Record<1 | 2 | 3 | 4, WeekMeta> = {
  1: { label: "მსუბუქი", pct: 35, color: "#7DDFA8" },
  2: { label: "საშუალო", pct: 60, color: "#FFD66B" },
  3: { label: "ძლიერი", pct: 80, color: "#C9A8E8" },
  4: { label: "მძიმე", pct: 100, color: "#FF9EC5" },
};

function emojiForType(type: string | null | undefined): string {
  switch (type) {
    case "pilates":
      return "🧘";
    case "cardio":
      return "🏃";
    case "combo":
      return "🔥";
    case "rest":
    default:
      return "😴";
  }
}

function chipsForWorkout(day: PlanDay): string[] {
  const w = day.workout;
  if (!w || w.type === "rest") return [];
  const chips: string[] = [];
  if (w.durationMin) chips.push(`⏱ ${w.durationMin} წთ`);
  if (day.state === "peak") chips.push("🔥 ყველაზე ინტენს.");
  return chips;
}

function focusForDay(day: PlanDay): string {
  const w = day.workout;
  if (!w) return "სრული დასვენება";
  if (w.type === "rest") return "სრული დასვენება";
  return w.focus ?? "";
}

type PlanScreenProps = {
  plan: FourWeekPlan;
};

export function PlanScreen({ plan }: PlanScreenProps) {
  const initialWeek = (plan.currentWeekOverride ?? plan.todayAutoWeek) as 1 | 2 | 3 | 4;
  const [selectedWeek, setSelectedWeek] = useState<1 | 2 | 3 | 4>(initialWeek);

  const week = useMemo(
    () => plan.weeks.find((w) => w.week === selectedWeek) ?? plan.weeks[0]!,
    [plan.weeks, selectedWeek],
  );

  return (
    <div className="relative flex flex-1 flex-col">
      <header className="relative z-1 flex items-center justify-between px-[22px] pt-2 pb-3.5">
        <h1 className="text-display text-ink font-bold">
          გეგმა <span className="text-[22px]">📅</span>
        </h1>
        <button
          type="button"
          className="text-[12px] font-bold text-[#5A3A8B]"
          style={{
            background: "rgba(255,255,255,0.65)",
            border: "1.5px solid #C9A8E8",
            padding: "7px 13px",
            borderRadius: 999,
            backdropFilter: "blur(8px)",
          }}
        >
          ✨ რედაქტირება
        </button>
      </header>

      <nav aria-label="კვირები" className="relative z-1 px-[18px]">
        <div
          role="tablist"
          className="flex gap-1 rounded-full p-[5px] backdrop-blur-md"
          style={{
            background: "rgba(255,255,255,0.55)",
            border: "1px solid rgba(255,255,255,0.7)",
            boxShadow: "0 2px 10px rgba(201,168,232,0.15)",
          }}
        >
          {([1, 2, 3, 4] as const).map((n) => {
            const active = n === selectedWeek;
            return (
              <button
                key={n}
                role="tab"
                type="button"
                aria-selected={active}
                onClick={() => setSelectedWeek(n)}
                className="relative flex-1 rounded-full px-1 py-2 text-center text-[12.5px] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-pink)]"
                style={{
                  background: active ? "var(--gradient-tab-active)" : "transparent",
                  color: active ? "#fff" : "#7B6A9B",
                  fontWeight: active ? 800 : 600,
                  letterSpacing: "0.01em",
                  boxShadow: active ? "0 3px 10px rgba(255,158,197,0.4)" : "none",
                  textShadow: active ? "0 1px 1px rgba(90,58,10,0.18)" : "none",
                }}
              >
                კვირა {n}
                {active && <span className="ml-1">✨</span>}
              </button>
            );
          })}
        </div>
      </nav>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={selectedWeek}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
          className="relative z-1 flex flex-col"
        >
          <WeekSummary plan={plan} selectedWeek={selectedWeek} />

          <div className="relative z-1 flex items-baseline justify-between px-[22px] pt-6 pb-2.5">
            <h2 className="text-h2 text-ink font-bold">📋 კვირის ცხრილი</h2>
            <span className="text-[11px] font-semibold text-[#7B6A9B]">
              {week.completedCount} / {week.workoutCount} ვარჯიში დასრულდა
            </span>
          </div>

          <ul className="relative z-1 flex flex-col gap-2.5 px-[18px]">
            {week.days.map((day) => (
              <li key={`${day.week}:${day.weekday}`}>
                <DayCard day={day} />
              </li>
            ))}
          </ul>

          <div
            className="relative z-1 mx-[18px] mt-[18px] flex items-start gap-2.5 rounded-[20px] p-[14px_16px]"
            style={{
              background: "#E7F8EE",
              border: "1px solid rgba(125,223,168,0.35)",
            }}
          >
            <span className="text-[18px] leading-tight">💡</span>
            <p className="text-[11.5px] leading-[1.45] font-medium text-[#2E6B47]">
              ხუთშაბათი და კვირა — სრული დასვენება სავალდებულოა. კუნთი დასვენებისას იზრდება.
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

type WeekSummaryProps = {
  plan: FourWeekPlan;
  selectedWeek: 1 | 2 | 3 | 4;
};

function WeekSummary({ plan, selectedWeek }: WeekSummaryProps) {
  const meta = WEEK_META[selectedWeek];
  const headerCopy = selectedWeek <= 2 ? "ინტენსიობა იზრდება" : "მაქს. გამოწვევა";

  const week = plan.weeks.find((w) => w.week === selectedWeek);
  const sample = week?.days.find((d) => d.workout && d.workout.type !== "rest");
  const sampleDur = sample?.workout?.durationMin ?? null;

  return (
    <div
      className="relative z-1 mx-[18px] mt-5 overflow-hidden rounded-[28px] px-[22px] pt-5 pb-[18px]"
      style={{
        background: "var(--gradient-workout)",
        boxShadow: "var(--shadow-md)",
      }}
    >
      <div
        className="pointer-events-none absolute -top-[22px] -right-[18px] text-[110px] leading-none opacity-[0.18]"
        aria-hidden
      >
        📈
      </div>

      <div className="mb-1.5 text-[10.5px] font-bold tracking-[0.08em] text-[#7B4FA8] uppercase">
        ამ კვირის ფოკუსი
      </div>

      <div className="mb-3 text-[21px] leading-tight font-extrabold">
        {headerCopy}{" "}
        <span className="text-[18px] text-[#3FB475]" aria-hidden>
          ↗
        </span>
      </div>

      <div className="mb-[18px] flex flex-wrap gap-1.5">
        {sampleDur && <SummaryChip>🧘 პილატესი {sampleDur} წთ</SummaryChip>}
        <SummaryChip>⚡ {meta.label} დონე</SummaryChip>
      </div>

      <div className="flex h-24 items-end gap-1.5">
        {([1, 2, 3, 4] as const).map((n) => {
          const m = WEEK_META[n];
          const active = n === selectedWeek;
          return (
            <div
              key={n}
              className="relative flex flex-1 flex-col justify-end rounded-[14px] p-1.5"
              style={{
                height: "100%",
                background: active ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.32)",
                border: active ? "1.5px solid #FF9EC5" : "1px solid rgba(255,255,255,0.55)",
                boxShadow: active ? "0 2px 8px rgba(255,158,197,0.3)" : "none",
              }}
            >
              <div
                className="w-full rounded-lg"
                style={{
                  height: `${m.pct}%`,
                  background: active
                    ? `linear-gradient(180deg, ${m.color} 0%, #FFB347 100%)`
                    : m.color,
                  opacity: active ? 1 : 0.85,
                }}
              />
              <span
                className="absolute top-1.5 right-0 left-0 text-center text-[11px] font-extrabold"
                style={{ color: active ? "#5A3A0A" : "#5A4275" }}
              >
                {n}
              </span>
              <span
                className="absolute right-0 -bottom-4 left-0 text-center text-[9.5px] font-bold tracking-[0.02em]"
                style={{ color: active ? "#5A3A0A" : "#7B6A9B" }}
              >
                {m.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="h-3.5" />
    </div>
  );
}

function SummaryChip({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap text-[#3D2C5F]"
      style={{
        background: "rgba(255,255,255,0.7)",
        borderRadius: 999,
      }}
    >
      {children}
    </span>
  );
}

function DayCard({ day }: { day: PlanDay }) {
  const ka = WEEKDAY_LABELS_KA[day.weekday];
  const w = day.workout;
  const isDone = day.state === "done";
  const isActive = day.state === "active";
  const isRest = day.state === "rest";
  const isPeak = day.state === "peak";
  const isPending = day.state === "pending";

  const bg = isActive ? "var(--gradient-active-meal)" : isRest ? "#F4ECFA" : "#FFFFFF";
  const border = isActive ? "2px solid #FFD66B" : "1px solid rgba(244,236,250,0.8)";
  const shadow = isActive
    ? "0 6px 20px rgba(255,158,197,0.28)"
    : isRest
      ? "none"
      : "0 2px 8px rgba(201,168,232,0.10)";

  const avatarBg = isRest
    ? "#EADCF5"
    : isDone
      ? "#E7F8EE"
      : isActive
        ? "#FFFFFF"
        : isPeak
          ? "#FFE6F0"
          : "#F4ECFA";

  const title = w?.title ?? "დასვენება";
  const sub = focusForDay(day);
  const chips = chipsForWorkout(day);

  return (
    <article
      className="relative flex items-start gap-3 overflow-hidden rounded-[20px] px-3.5 py-3.5"
      style={{ background: bg, border, boxShadow: shadow, opacity: isDone ? 0.88 : 1 }}
    >
      {isPeak && (
        <span
          aria-hidden
          className="absolute top-0 bottom-0 left-0 w-1"
          style={{
            background: "linear-gradient(180deg, #FF9EC5 0%, #C9A8E8 100%)",
          }}
        />
      )}

      <div
        className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl"
        style={{
          background: avatarBg,
          boxShadow: isActive ? "0 2px 8px rgba(255,214,107,0.4)" : "none",
        }}
      >
        <span style={{ opacity: isDone || isRest ? 0.85 : 1 }}>{emojiForType(w?.type)}</span>
        {isDone && (
          <span
            aria-hidden
            className="absolute -right-0.5 -bottom-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 border-white bg-[#7DDFA8]"
          >
            <svg width="9" height="9" viewBox="0 0 8 8" aria-hidden>
              <path
                d="M1.5 4l1.7 1.7L6.5 2.3"
                fill="none"
                stroke="#fff"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div
          className="mb-0.5 text-[12px] font-bold tracking-[0.01em]"
          style={{ color: isActive ? "#A47000" : isRest ? "#9785B5" : "#7B6A9B" }}
        >
          {ka}
        </div>
        <div
          className="text-[15px] leading-tight font-extrabold"
          style={{ color: isRest ? "#7B6A9B" : "#3D2C5F" }}
        >
          {title}
        </div>
        {sub && (
          <p className="mt-1 line-clamp-2 text-[11.5px] leading-snug font-medium text-[#7B6A9B]">
            {sub}
          </p>
        )}
        {chips.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {chips.map((c) => (
              <span
                key={c}
                className="rounded-full px-2.5 py-0.5 text-[10.5px] font-semibold text-[#5A4275]"
                style={{ background: isActive ? "rgba(255,255,255,0.8)" : "#F4ECFA" }}
              >
                {c}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2">
        {isDone && (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#E7F8EE] px-2.5 py-1.5 text-[10.5px] font-bold text-[#2E8B57]">
            ✓ დასრულდა
          </span>
        )}
        {isActive && (
          <button
            type="button"
            className="rounded-full px-3 py-1.5 text-[11px] font-extrabold whitespace-nowrap text-white"
            style={{
              background: "var(--gradient-brand)",
              boxShadow: "0 3px 10px rgba(255,158,197,0.45)",
            }}
          >
            დაიწყე →
          </button>
        )}
        {isRest && (
          <span className="rounded-full bg-[#EADCF5] px-2.5 py-1.5 text-[10.5px] font-bold text-[#7B4FA8]">
            ღია
          </span>
        )}
        {isPeak && (
          <span className="rounded-full bg-[#FFE6F0] px-2.5 py-1.5 text-[10.5px] font-bold text-[#C04A7E]">
            მაქს. დატვ.
          </span>
        )}
        {isPending && (
          <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-[#B7AAD0]">
            <svg width="11" height="11" viewBox="0 0 11 11" aria-hidden>
              <circle cx="5.5" cy="5.5" r="4.5" fill="none" stroke="#B7AAD0" strokeWidth="1.3" />
            </svg>
            მოლოდინში
          </span>
        )}
      </div>

      {isActive && (
        <span
          className="absolute -top-[9px] left-3.5 rounded-full px-2.5 py-0.5 text-[9.5px] font-extrabold tracking-[0.04em] text-[#5A3A0A]"
          style={{
            background: "#FFD66B",
            boxShadow: "0 2px 6px rgba(255,214,107,0.5)",
          }}
        >
          ⏰ დღეს
        </span>
      )}
    </article>
  );
}
