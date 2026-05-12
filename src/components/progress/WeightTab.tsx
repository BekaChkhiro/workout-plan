"use client";

import { useState } from "react";

import type { WeightPoint } from "@/db/queries";

import { WeightLogModal } from "./WeightLogModal";

const MONTHS_KA_SHORT = [
  "იან",
  "თებ",
  "მარ",
  "აპრ",
  "მაი",
  "ივნ",
  "ივლ",
  "აგვ",
  "სექ",
  "ოქტ",
  "ნოე",
  "დეკ",
] as const;

function parseDateBlock(date: string): { day: string; month: string } {
  const [, mm, dd] = date.split("-");
  return {
    day: String(Number(dd)),
    month: MONTHS_KA_SHORT[Number(mm) - 1] ?? "",
  };
}

type Props = {
  entries: WeightPoint[];
  today: string;
};

export function WeightTab({ entries, today }: Props) {
  const [modalOpen, setModalOpen] = useState(false);

  const reversed = [...entries].reverse();

  return (
    <div className="flex flex-col gap-3 px-5">
      <div className="mt-2 flex items-center justify-between">
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

      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="rounded-pill mt-2 w-full py-4 text-[14.5px] font-bold text-white"
        style={{
          background: "var(--gradient-brand)",
          boxShadow: "0 12px 32px rgba(255,158,197,0.28), 0 4px 12px rgba(201,168,232,0.18)",
        }}
      >
        ⚖️ + წონის ჩაწერა
      </button>

      <WeightLogModal open={modalOpen} onOpenChange={setModalOpen} today={today} />
    </div>
  );
}
