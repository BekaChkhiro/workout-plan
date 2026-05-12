import { type DayType, getMealsByDayType } from "@/db/queries";
import { getOwnerUser } from "@/lib/auth";
import { getTodayInTimeZone } from "@/lib/date";

import { DayTypeToggle } from "./_components/DayTypeToggle";
import { MealsList } from "./_components/MealsList";

export const dynamic = "force-dynamic";

function parseDayType(value: string | string[] | undefined): DayType {
  return value === "rest" ? "rest" : "workout";
}

const MACRO_TARGETS = [
  { label: "ცილა", key: "pG" as const, color: "#7DDFA8", bg: "#E7F8EE" },
  { label: "ნახშირწყლები", key: "nG" as const, color: "#FFD66B", bg: "#FFF5DA" },
  { label: "ცხიმი", key: "fG" as const, color: "#FF9EC5", bg: "#FFE6F0" },
];

export default async function MealsPage({
  searchParams,
}: {
  searchParams: Promise<{ day?: string | string[] }>;
}) {
  const { day } = await searchParams;
  const dayType = parseDayType(day);

  const owner = await getOwnerUser();
  const today = getTodayInTimeZone(owner.timezone);
  const data = await getMealsByDayType(owner.id, dayType, today);

  const completed = data.meals.filter((m) => m.completed);
  const consumedCalories = completed.reduce((acc, m) => acc + m.calories, 0);
  const consumedByKey: Record<"pG" | "nG" | "fG", number> = {
    pG: completed.reduce((acc, m) => acc + m.pG, 0),
    nG: completed.reduce((acc, m) => acc + m.nG, 0),
    fG: completed.reduce((acc, m) => acc + m.fG, 0),
  };
  const lastMealTime = data.meals.length > 0 ? data.meals[data.meals.length - 1]!.time : null;

  return (
    <div className="relative flex-1 pt-[54px]">
      <div
        className="pointer-events-none absolute top-[240px] -right-[90px] h-[220px] w-[220px] rounded-full"
        style={{ background: "var(--blob-mint)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-[580px] -left-[100px] h-[240px] w-[240px] rounded-full"
        style={{ background: "var(--blob-yellow)" }}
        aria-hidden
      />

      <header className="relative z-1 flex items-center justify-between px-[22px] pt-2 pb-3.5">
        <h1 className="text-display text-ink font-extrabold">
          კვება <span className="text-[22px]">🍽</span>
        </h1>
        <button
          type="button"
          className="rounded-full border-[1.5px] border-[var(--color-brand-lilac)] bg-white/65 px-3 py-[7px] text-[12px] font-bold backdrop-blur-md"
          style={{ color: "#5A3A8B" }}
        >
          ✨ რედაქტირება
        </button>
      </header>

      <DayTypeToggle dayType={dayType} mealCount={data.meals.length} />

      <section
        className="bg-surface relative z-1 mx-[18px] mt-3.5 rounded-[28px] px-[22px] pt-[22px] pb-4"
        style={{ boxShadow: "var(--shadow-md)" }}
        aria-label="დღის შემაჯამება"
      >
        <div className="flex items-center gap-[18px]">
          <DayCaloriesRing total={consumedCalories} target={data.targets.calories} />
          <div className="flex flex-1 flex-col gap-2.5">
            {MACRO_TARGETS.map((m) => {
              const target = data.targets[m.key];
              const current = consumedByKey[m.key];
              const pct = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
              return (
                <div key={m.key}>
                  <div className="mb-1 flex items-baseline justify-between text-[10.5px]">
                    <span className="text-ink font-bold">{m.label}</span>
                    <span className="text-ink-soft font-bold">{target} გ</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: m.bg }} aria-hidden>
                    <div
                      className="h-full rounded-full"
                      style={{ background: m.color, width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-[18px] flex justify-between gap-1.5 border-t border-[#F4ECFA] pt-3.5">
          <StatPill bg="#F4ECFA" color="#3D2C5F">
            💧 {data.targets.waterL} ლ წყალი
          </StatPill>
          <StatPill bg="#FFF5DA" color="#5A3A0A">
            🍽 {data.meals.length} კვება
          </StatPill>
          {lastMealTime ? (
            <StatPill bg="#FFE6F0" color="#7B4FA8">
              🕗 {lastMealTime}-მდე
            </StatPill>
          ) : null}
        </div>
      </section>

      <div className="relative z-1 flex items-baseline justify-between px-[22px] pt-6 pb-3">
        <div className="text-h2 font-bold">🍽 დღის რაციონი</div>
        <button
          type="button"
          className="text-[12px] font-bold underline underline-offset-2"
          style={{ color: "#7B4FA8", textDecorationColor: "rgba(123,79,168,0.4)" }}
        >
          ყველას რედაქტირება
        </button>
      </div>

      <MealsList meals={data.meals} />

      <div
        className="relative z-1 mx-[18px] mt-4.5 flex items-start gap-2.5 rounded-[20px] border px-4 py-3.5"
        style={{
          background: "#E7F8EE",
          borderColor: "rgba(125,223,168,0.35)",
        }}
      >
        <div className="text-[18px] leading-tight">💡</div>
        <p className="text-[11.5px] leading-snug font-medium" style={{ color: "#2E6B47" }}>
          ბოლო კვება {lastMealTime ?? "20:00"}-მდე. ძილამდე 2.5-3 საათი მინიმუმ.
        </p>
      </div>

      <div className="h-6" />
    </div>
  );
}

function StatPill({
  bg,
  color,
  children,
}: {
  bg: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className="rounded-full px-[11px] py-[6px] text-[11.5px] font-semibold whitespace-nowrap"
      style={{
        background: bg,
        color,
        boxShadow: "0 1px 3px rgba(201,168,232,0.10)",
      }}
    >
      {children}
    </span>
  );
}

function DayCaloriesRing({ total, target }: { total: number; target: number }) {
  const size = 118;
  const stroke = 13;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = target > 0 ? Math.min(1, total / target) : 0;
  const dash = circumference * pct;

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden focusable={false}>
        <defs>
          <linearGradient id="ringGradMeals" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FF9EC5" />
            <stop offset="100%" stopColor="#C9A8E8" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#F4ECFA"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#ringGradMeals)"
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${dash} ${circumference - dash}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-ink text-[22px] leading-none font-extrabold">{total}</div>
        <div className="text-ink-soft mt-[3px] text-[9.5px] font-semibold">/ {target} კკალ</div>
      </div>
    </div>
  );
}
