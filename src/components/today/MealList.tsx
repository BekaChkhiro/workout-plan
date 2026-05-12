import type { MealWithDetails } from "@/db/queries";

type MealState = "done" | "active" | "upcoming";

type MealRow = MealWithDetails & {
  state: MealState;
  emoji: string;
};

type MealListProps = {
  meals: readonly MealRow[];
  completedCount: number;
};

export function MealList({ meals, completedCount }: MealListProps) {
  return (
    <>
      <div className="relative z-1 flex items-baseline justify-between px-[22px] pt-6 pb-2.5">
        <h2 className="text-[18px] font-bold">🍽 დღევანდელი კვება</h2>
        <span className="text-ink-soft text-[11px] font-semibold">
          {completedCount} / {meals.length}
        </span>
      </div>
      <ul className="relative z-1 flex flex-col gap-2.5 px-[18px]">
        {meals.map((m) => (
          <MealCard key={m.id} meal={m} />
        ))}
      </ul>
    </>
  );
}

function MealCard({ meal }: { meal: MealRow }) {
  const { state } = meal;
  const isDone = state === "done";
  const isActive = state === "active";
  const isUpcoming = state === "upcoming";

  return (
    <li
      className="relative flex items-center gap-3 rounded-[22px] px-[14px] py-[13px]"
      style={{
        background: isActive ? "var(--gradient-active-meal)" : "var(--color-surface)",
        boxShadow: isActive
          ? "0 6px 20px rgba(255,158,197,0.28)"
          : "0 2px 8px rgba(201,168,232,0.10)",
        border: isActive
          ? "2px solid var(--color-brand-yellow)"
          : "1px solid rgba(244,236,250,0.8)",
        opacity: isUpcoming ? 0.55 : 1,
      }}
    >
      <span
        className="relative flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full text-lg"
        style={{
          background: isDone
            ? "var(--color-track-mint)"
            : isActive
              ? "#FFFFFF"
              : "var(--color-surface-2)",
          boxShadow: isActive ? "0 2px 8px rgba(255,214,107,0.4)" : "none",
        }}
      >
        <span style={{ opacity: isDone ? 0.7 : 1 }}>{meal.emoji}</span>
        {isDone && (
          <span
            aria-hidden
            className="absolute -right-0.5 -bottom-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white"
            style={{ background: "var(--color-brand-mint)" }}
          >
            <svg width="8" height="8" viewBox="0 0 8 8">
              <path
                d="M1.5 4l1.7 1.7L6.5 2.3"
                fill="none"
                stroke="#fff"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        )}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span
            className="text-[11.5px] font-bold"
            style={{ color: isActive ? "#A47000" : "var(--color-ink-soft)" }}
          >
            {meal.time}
          </span>
          <span
            className="truncate text-[14px] font-bold"
            style={{
              color: isDone ? "var(--color-ink-mute)" : "var(--color-ink)",
              textDecoration: isDone ? "line-through" : "none",
            }}
          >
            {meal.name}
          </span>
        </div>
        <p className="text-ink-soft mt-0.5 truncate text-[11.5px] font-medium">{meal.summary}</p>
      </div>
      <span
        className="text-[14px] font-bold"
        style={{ color: isDone ? "var(--color-ink-mute)" : "var(--color-ink)" }}
      >
        {meal.calories}
      </span>
      {isActive && (
        <span
          aria-hidden
          className="absolute -top-2.5 left-[14px] rounded-full px-[9px] py-[3px] text-[9.5px] font-extrabold tracking-wider"
          style={{
            background: "var(--color-brand-yellow)",
            color: "#5A3A0A",
            boxShadow: "0 2px 6px rgba(255,214,107,0.5)",
          }}
        >
          ⏰ ახლა
        </span>
      )}
    </li>
  );
}
