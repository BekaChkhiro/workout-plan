import type { Workout } from "@/db/schema";

type WorkoutCardProps = {
  workout: Workout | null;
  completed: boolean;
};

const TYPE_LABEL: Record<Workout["type"], string> = {
  pilates: "პილატესი",
  cardio: "კარდიო",
  combo: "კომბო",
  rest: "დასვენების დღე",
};

const INTENSITY_LABEL: Record<Workout["intensity"], string> = {
  light: "მსუბუქი",
  medium: "საშუალო",
  strong: "ძლიერი",
  heavy: "მძიმე",
};

export function WorkoutCard({ workout, completed }: WorkoutCardProps) {
  if (!workout || workout.type === "rest") {
    return (
      <section
        className="relative z-1 mx-[18px] mt-[22px] overflow-hidden rounded-[28px] px-[22px] pt-[22px] pb-[18px]"
        style={{
          background: "var(--gradient-workout)",
          boxShadow: "0 8px 24px rgba(201,168,232,0.25)",
        }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute -top-7 -right-7 text-[110px] opacity-[0.18]"
        >
          🛌
        </span>
        <div className="mb-2.5 text-[11px] font-bold tracking-wide" style={{ color: "#7B4FA8" }}>
          💜 დღევანდელი დასვენება
        </div>
        <h2 className="text-[22px] leading-tight font-extrabold">დასვენების დღე</h2>
        <p className="text-ink-soft mt-0.5 text-[12.5px] font-medium">
          აღდგენა · დაისვენე და მოემზადე ხვალისთვის
        </p>
      </section>
    );
  }

  const tags: string[] = [];
  if (workout.durationMin) tags.push(`⏱ ${workout.durationMin} წთ`);
  tags.push(`🔥 ${INTENSITY_LABEL[workout.intensity]}`);
  if (workout.timeStart) tags.push(`🕡 ${workout.timeStart}`);

  return (
    <section
      className="relative z-1 mx-[18px] mt-[22px] overflow-hidden rounded-[28px] px-[22px] pt-[22px] pb-[18px]"
      style={{
        background: "var(--gradient-workout)",
        boxShadow: "0 8px 24px rgba(201,168,232,0.25)",
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -top-7 -right-7 text-[110px] opacity-[0.18]"
      >
        🧘
      </span>
      <div className="mb-2.5 text-[11px] font-bold tracking-wide" style={{ color: "#7B4FA8" }}>
        💪 დღევანდელი ვარჯიში
      </div>
      <h2 className="text-[22px] leading-tight font-extrabold">{TYPE_LABEL[workout.type]}</h2>
      {workout.focus && (
        <p className="text-ink-soft mt-0.5 mb-3.5 text-[12.5px] font-medium">{workout.focus}</p>
      )}
      <ul className="mb-[18px] flex flex-wrap gap-2">
        {tags.map((tag) => (
          <li
            key={tag}
            className="rounded-full bg-white/70 px-[11px] py-[5px] text-[11.5px] font-semibold"
          >
            {tag}
          </li>
        ))}
      </ul>
      <button
        type="button"
        disabled
        className="w-full rounded-full border-none px-4 py-[15px] text-[14.5px] font-bold tracking-wide text-white"
        style={{
          background: completed ? "var(--color-brand-mint)" : "var(--gradient-brand)",
          boxShadow: "0 6px 18px rgba(201,168,232,0.5)",
        }}
      >
        {completed ? "შესრულდა ✓" : "დასრულდა ✨"}
      </button>
    </section>
  );
}
