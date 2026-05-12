"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { setWaterGlassesAction } from "@/app/(app)/today/actions";

type WaterTrackerProps = {
  initialGlasses: number;
  total?: number;
  targetL: number;
};

export function WaterTracker({ initialGlasses, total = 8, targetL }: WaterTrackerProps) {
  const [glasses, setGlasses] = useState(initialGlasses);

  const mutation = useMutation({
    mutationFn: (count: number) => setWaterGlassesAction(count),
    onError: () => setGlasses(initialGlasses),
  });

  function handleClick(index: number) {
    const next = index < glasses ? index : index + 1;
    setGlasses(next);
    mutation.mutate(next);
  }

  const liters = ((glasses / total) * targetL).toFixed(2);

  return (
    <div className="border-surface-2 mt-[18px] flex items-center justify-between border-t pt-4">
      <div>
        <div className="text-ink-soft mb-0.5 text-[11px] font-semibold">💧 წყალი</div>
        <div className="text-[17px] font-bold">
          {liters} <span className="text-ink-soft text-[11px] font-medium">/ {targetL} ლ</span>
        </div>
      </div>
      <div role="group" aria-label={`წყალი: ${glasses}/${total} ჭიქა`} className="flex gap-1">
        {Array.from({ length: total }).map((_, i) => {
          const filled = i < glasses;
          return (
            <button
              key={i}
              type="button"
              aria-pressed={filled}
              aria-label={`ჭიქა ${i + 1}`}
              onClick={() => handleClick(i)}
              className="block w-4 rounded-t-lg rounded-b-[5px]"
              style={{
                height: 22,
                background: filled ? "var(--gradient-water)" : "var(--color-surface-2)",
                border: filled ? "1px solid rgba(124,199,255,0.5)" : "1px solid #EADCF5",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
