"use client";

import { useOptimistic, useTransition } from "react";

import { setWeekOverrideAction } from "@/app/(app)/plan/actions";

type Props = {
  currentWeekOverride: number | null;
  todayAutoWeek: number;
};

export function WeekModeSection({ currentWeekOverride, todayAutoWeek }: Props) {
  const [optimisticOverride, setOptimisticOverride] = useOptimistic(currentWeekOverride);
  const [isPending, startTransition] = useTransition();
  const isManual = optimisticOverride !== null;

  const switchToAuto = () => {
    startTransition(async () => {
      setOptimisticOverride(null);
      await setWeekOverrideAction(null);
    });
  };

  const switchToManual = (week: 1 | 2 | 3 | 4) => {
    startTransition(async () => {
      setOptimisticOverride(week);
      await setWeekOverrideAction(week);
    });
  };

  return (
    <div
      className="mx-[18px] rounded-[22px] p-5"
      style={{
        background: "#fff",
        border: "1px solid rgba(201,168,232,0.35)",
        boxShadow: "0 2px 10px rgba(201,168,232,0.10)",
      }}
    >
      <div className="mb-1 text-[10.5px] font-bold tracking-[0.07em] text-[#7B4FA8] uppercase">
        კვირის რეჟიმი
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-[15px] font-extrabold text-[#3D2C5F]">
            {isManual ? `✋ ხელით — კვირა ${optimisticOverride}` : `🤖 ავტო — კვირა ${todayAutoWeek}`}
          </div>
          <div className="mt-0.5 text-[11.5px] text-[#7B6A9B]">
            {isManual
              ? "ავტომატური პროგრესი გამორთულია"
              : "კვირა ავტომატურად განისაზღვრება"}
          </div>
        </div>

        <button
          type="button"
          disabled={isPending}
          onClick={isManual ? switchToAuto : () => switchToManual(todayAutoWeek as 1 | 2 | 3 | 4)}
          className="rounded-full px-3.5 py-2 text-[12px] font-bold disabled:opacity-60"
          style={
            isManual
              ? { background: "#F4ECFA", color: "#7B4FA8" }
              : { background: "var(--gradient-brand)", color: "#fff" }
          }
        >
          {isManual ? "ავტო-ზე" : "ხელით"}
        </button>
      </div>

      {isManual && (
        <div>
          <div className="mb-2 text-[11px] font-semibold text-[#7B6A9B]">კვირის არჩევა:</div>
          <div className="flex gap-2">
            {([1, 2, 3, 4] as const).map((n) => {
              const active = n === optimisticOverride;
              return (
                <button
                  key={n}
                  type="button"
                  disabled={isPending}
                  onClick={() => switchToManual(n)}
                  className="flex-1 rounded-full py-2 text-[12px] font-bold disabled:opacity-60"
                  style={
                    active
                      ? {
                          background: "var(--gradient-brand)",
                          color: "#fff",
                          boxShadow: "0 2px 8px rgba(255,158,197,0.4)",
                        }
                      : { background: "#F4ECFA", color: "#7B4FA8" }
                  }
                >
                  {n}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
