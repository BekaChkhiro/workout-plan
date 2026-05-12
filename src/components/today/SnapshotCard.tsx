import { CalRing } from "./CalRing";
import { WaterTracker } from "./WaterTracker";

type Macro = {
  key: "P" | "N" | "F";
  short: string;
  value: number;
  goal: number;
  unit: string;
};

type SnapshotCardProps = {
  kcalEaten: number;
  kcalGoal: number;
  macros: readonly Macro[];
  waterGlasses: number;
  waterGlassesTotal: number;
  waterTargetL: number;
};

const MACRO_FILL = ["#7DDFA8", "#FFD66B", "#FF9EC5"] as const;
const MACRO_TRACK = ["#E7F8EE", "#FFF5DA", "#FFE6F0"] as const;

export function SnapshotCard({
  kcalEaten,
  kcalGoal,
  macros,
  waterGlasses,
  waterGlassesTotal,
  waterTargetL,
}: SnapshotCardProps) {
  return (
    <section
      className="bg-surface relative z-1 mx-[18px] mt-2 rounded-[28px] px-[22px] pt-[22px] pb-[18px]"
      style={{ boxShadow: "var(--shadow-md)" }}
    >
      <div className="flex items-center gap-[18px]">
        <CalRing pct={kcalGoal > 0 ? kcalEaten / kcalGoal : 0}>
          <div className="text-ink text-[24px] leading-none font-extrabold">{kcalEaten}</div>
          <div className="text-ink-soft mt-[3px] text-[10px] font-semibold">/ {kcalGoal} კკალ</div>
        </CalRing>
        <ul className="flex flex-1 flex-col gap-[10px]">
          {macros.map((m, i) => {
            const fill = MACRO_FILL[i] ?? MACRO_FILL[0];
            const trackColor = MACRO_TRACK[i] ?? MACRO_TRACK[0];
            const pct = Math.min(1, m.goal > 0 ? m.value / m.goal : 0);
            return (
              <li key={m.key}>
                <div className="mb-1 flex items-baseline justify-between text-[11px]">
                  <span className="font-bold">{m.short}</span>
                  <span className="text-ink-soft font-semibold">
                    {m.value}/{m.goal}
                    {m.unit}
                  </span>
                </div>
                <div className="h-[7px] rounded-full" style={{ background: trackColor }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct * 100}%`, background: fill }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <WaterTracker
        initialGlasses={waterGlasses}
        total={waterGlassesTotal}
        targetL={waterTargetL}
      />
    </section>
  );
}
