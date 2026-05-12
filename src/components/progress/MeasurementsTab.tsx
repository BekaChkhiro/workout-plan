"use client";

import { useState } from "react";

import type { MeasurementPoint } from "@/db/queries";

import { MeasurementLogModal } from "./MeasurementLogModal";

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

function MeasurementValue({ label, value }: { label: string; value: number | null }) {
  if (value == null) return null;
  return (
    <div className="flex flex-col">
      <span className="text-[10px] font-semibold text-[#9B8BB5]">{label}</span>
      <span className="text-body text-ink font-bold">{value} სმ</span>
    </div>
  );
}

type Props = {
  entries: MeasurementPoint[];
  today: string;
};

export function MeasurementsTab({ entries, today }: Props) {
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
          {reversed.map((entry) => {
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

                <div className="flex flex-1 items-center gap-4">
                  <MeasurementValue label="წელი" value={entry.waistCm} />
                  <MeasurementValue label="მკლავი" value={entry.armCm} />
                  <MeasurementValue label="ბარძაყი" value={entry.thighCm} />
                </div>
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
        📏 + გაზომვა
      </button>

      <MeasurementLogModal open={modalOpen} onOpenChange={setModalOpen} today={today} />
    </div>
  );
}
