"use client";

import { useState } from "react";

import type { WeightPoint } from "@/db/queries";

import { WeightChart } from "./WeightChart";
import { WeightLogModal } from "./WeightLogModal";

const MONTHS_KA_SHORT = [
  "იან", "თებ", "მარ", "აპრ", "მაი", "ივნ",
  "ივლ", "აგვ", "სექ", "ოქტ", "ნოე", "დეკ",
] as const;

function parseDateBlock(date: string): { day: string; month: string } {
  const [, mm, dd] = date.split("-");
  return {
    day: String(Number(dd)),
    month: MONTHS_KA_SHORT[Number(mm) - 1] ?? "",
  };
}

function daysBetweenDates(a: string, b: string): number {
  const msPerDay = 86_400_000;
  return Math.round(
    (new Date(`${b}T00:00:00Z`).getTime() - new Date(`${a}T00:00:00Z`).getTime()) / msPerDay,
  );
}

type Props = {
  entries: WeightPoint[];
  today: string;
  targetKg?: number | null;
};

export function WeightTab({ entries, today, targetKg }: Props) {
  const [modalOpen, setModalOpen] = useState(false);

  const reversed = [...entries].reverse();
  const currentKg = entries[entries.length - 1]?.kg ?? null;
  const startKg = entries[0]?.kg ?? null;

  const deltaKg = currentKg != null && startKg != null ? currentKg - startKg : null;
  const daysSinceStart =
    entries.length >= 2 && entries[0] && entries[entries.length - 1]
      ? daysBetweenDates(entries[0].date, entries[entries.length - 1]!.date)
      : null;

  const progressPct =
    currentKg != null && startKg != null && targetKg != null && startKg !== targetKg
      ? Math.min(100, Math.max(0, ((startKg - currentKg) / (startKg - targetKg)) * 100))
      : null;

  const remainingKg =
    currentKg != null && targetKg != null ? Math.abs(currentKg - targetKg) : null;

  return (
    <div className="flex flex-col gap-3 px-5">
      {/* Hero stats card */}
      {currentKg != null && (
        <div
          className="rounded-[var(--radius-lg)] bg-white px-5 py-4"
          style={{ boxShadow: "var(--shadow-md)" }}
        >
          <div
            className="flex items-stretch gap-4"
            style={{ borderBottom: "none" }}
          >
            {/* Left — current weight */}
            <div className="flex flex-1 flex-col gap-1">
              <span
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: "#7B4FA8", letterSpacing: "0.08em" }}
              >
                მიმდინარე წონა
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-[36px] leading-none font-extrabold" style={{ color: "#3D2C5F" }}>
                  {currentKg.toFixed(1)}
                </span>
                <span className="text-body font-semibold" style={{ color: "#7B6A9B" }}>
                  კგ
                </span>
              </div>
              {deltaKg != null && daysSinceStart != null && daysSinceStart > 0 && (
                <span
                  className="self-start rounded-pill px-2.5 py-1 text-[11px] font-bold"
                  style={{ background: "#E7F8EE", color: "#2E8B57" }}
                >
                  ✨ {deltaKg <= 0 ? "−" : "+"}{Math.abs(deltaKg).toFixed(1)} კგ {daysSinceStart} დღეში
                </span>
              )}
            </div>

            {/* Divider */}
            <div className="w-px self-stretch" style={{ background: "#F4ECFA" }} />

            {/* Right — target */}
            {targetKg != null ? (
              <div className="flex w-[40%] flex-col gap-1.5">
                <span
                  className="text-[10px] font-bold uppercase tracking-widest"
                  style={{ color: "#7B4FA8", letterSpacing: "0.08em" }}
                >
                  სამიზნე
                </span>
                <span className="text-h2 font-bold" style={{ color: "#3D2C5F" }}>
                  {targetKg.toFixed(1)} კგ
                </span>
                {progressPct != null && (
                  <>
                    <div
                      className="relative h-1.5 w-full overflow-hidden rounded-pill"
                      style={{ background: "#F4ECFA" }}
                    >
                      <div
                        className="h-full rounded-pill"
                        style={{
                          width: `${progressPct}%`,
                          background: "linear-gradient(90deg, #7DDFA8, #FFD66B)",
                        }}
                      />
                      <div
                        className="absolute top-1/2 -translate-y-1/2 h-2 w-2 rounded-full border border-white"
                        style={{
                          left: `calc(${progressPct}% - 4px)`,
                          background: "#FFD66B",
                        }}
                      />
                    </div>
                    {remainingKg != null && (
                      <span className="text-[11px] font-semibold" style={{ color: "#7B6A9B" }}>
                        კიდევ {remainingKg.toFixed(1)} კგ
                      </span>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div className="flex w-[40%] flex-col justify-center">
                <span className="text-caption" style={{ color: "#B7AAD0" }}>
                  სამიზნე არ არის
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Chart card */}
      {entries.length >= 2 && <WeightChart entries={entries} />}

      {/* Log button */}
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="rounded-pill mt-1 w-full py-4 text-[14.5px] font-bold text-white"
        style={{
          background: "var(--gradient-brand)",
          boxShadow: "0 12px 32px rgba(255,158,197,0.28), 0 4px 12px rgba(201,168,232,0.18)",
        }}
      >
        ⚖️ + წონის ჩაწერა
      </button>

      {/* Recent entries */}
      <div className="mt-1 flex items-center justify-between">
        <h2 className="text-h2 text-ink font-bold">📒 ბოლო ჩანაწერები</h2>
        {entries.length > 0 && (
          <span className="text-caption text-ink-soft">{entries.length} ჩანაწერი</span>
        )}
      </div>

      {entries.length === 0 ? (
        <p className="text-body text-ink-soft py-8 text-center">ჩანაწერები არ არის</p>
      ) : (
        <div className="flex flex-col gap-3">
          {reversed.map((entry, i) => {
            const prev = reversed[i + 1];
            const change = prev != null ? entry.kg - prev.kg : null;
            const { day, month } = parseDateBlock(entry.date);
            const isToday = entry.date === today;

            return (
              <div
                key={entry.date}
                className="flex items-center gap-3 rounded-md bg-white px-4 py-3.5 shadow-sm"
              >
                <div
                  className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-[14px]"
                  style={{ background: isToday ? "#FFE6F0" : "#F0E5F9" }}
                >
                  <span
                    className="text-[15px] leading-tight font-bold"
                    style={{ color: isToday ? "#E06095" : "#9B6AC8" }}
                  >
                    {day}
                  </span>
                  <span
                    className="text-[9px] font-semibold"
                    style={{ color: isToday ? "#E06095" : "#9B6AC8" }}
                  >
                    {month}
                  </span>
                </div>

                <div className="flex flex-1 flex-col">
                  <span className="text-h2 text-ink font-bold">{entry.kg} კგ</span>
                </div>

                {change !== null && (
                  <div
                    className="rounded-pill px-2.5 py-1 text-[11px] font-bold"
                    style={{
                      background: change <= 0 ? "#E7F8EE" : "#FFE6F0",
                      color: change <= 0 ? "#2E8B57" : "#E06095",
                    }}
                  >
                    {change <= 0 ? "↓" : "↑"} {Math.abs(change).toFixed(1)} კგ
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <WeightLogModal open={modalOpen} onOpenChange={setModalOpen} today={today} />
    </div>
  );
}
