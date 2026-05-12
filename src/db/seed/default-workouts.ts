import type { NewWorkout } from "../schema/workouts";

export type DefaultWorkout = Omit<NewWorkout, "id" | "userId">;

const WEEK_INTENSITY = {
  1: "light",
  2: "medium",
  3: "strong",
  4: "heavy",
} as const satisfies Record<1 | 2 | 3 | 4, NewWorkout["intensity"]>;

type DaySpec =
  | {
      type: "pilates" | "cardio" | "combo";
      title: string;
      focus: string;
      durationMin: number;
    }
  | { type: "rest" };

type WeekSpec = Record<0 | 1 | 2 | 3 | 4 | 5 | 6, DaySpec>;

const REST: DaySpec = { type: "rest" };

const WEEKS: Record<1 | 2 | 3 | 4, WeekSpec> = {
  1: {
    0: { type: "pilates", title: "პილატესი", focus: "საფუძვლები, ბირთვი", durationMin: 30 },
    1: { type: "cardio", title: "კარდიო", focus: "მსუბუქი სიარული", durationMin: 25 },
    2: { type: "pilates", title: "პილატესი", focus: "მკლავები, მხრები", durationMin: 30 },
    3: REST,
    4: {
      type: "combo",
      title: "კომბო დღე",
      focus: "15 წთ პილატესი + 20 წთ სიარული",
      durationMin: 35,
    },
    5: { type: "cardio", title: "კარდიო", focus: "მსუბუქი სიარული", durationMin: 30 },
    6: REST,
  },
  2: {
    0: { type: "pilates", title: "პილატესი", focus: "ბირთვი, ზურგი, დუნდულო", durationMin: 40 },
    1: { type: "cardio", title: "კარდიო", focus: "სიარული + ლახტი", durationMin: 35 },
    2: { type: "pilates", title: "პილატესი", focus: "მკლავები + გვერდები", durationMin: 45 },
    3: REST,
    4: {
      type: "combo",
      title: "კომბო დღე",
      focus: "20 წთ პილატესი + 20 წთ ლახტი",
      durationMin: 45,
    },
    5: { type: "cardio", title: "კარდიო", focus: "სიარული + ლახტი", durationMin: 40 },
    6: REST,
  },
  3: {
    0: { type: "pilates", title: "პილატესი", focus: "ბირთვი + ფეხები", durationMin: 45 },
    1: { type: "cardio", title: "კარდიო", focus: "სიარული + ლახტი ↑", durationMin: 40 },
    2: { type: "pilates", title: "პილატესი", focus: "სრული სხეული", durationMin: 50 },
    3: REST,
    4: {
      type: "combo",
      title: "კომბო დღე",
      focus: "25 წთ პილატესი + 25 წთ ლახტი",
      durationMin: 50,
    },
    5: { type: "cardio", title: "კარდიო", focus: "ინტერვალები", durationMin: 45 },
    6: REST,
  },
  4: {
    0: { type: "pilates", title: "პილატესი", focus: "მაქს. ბირთვი", durationMin: 50 },
    1: { type: "cardio", title: "კარდიო", focus: "ინტერვალები", durationMin: 45 },
    2: { type: "pilates", title: "პილატესი", focus: "სრული სხეული, მძიმე", durationMin: 55 },
    3: REST,
    4: {
      type: "combo",
      title: "კომბო დღე",
      focus: "25 წთ პილატესი + 30 წთ ლახტი",
      durationMin: 55,
    },
    5: { type: "cardio", title: "კარდიო", focus: "მაქს. ტემპი", durationMin: 50 },
    6: REST,
  },
};

function buildRow(
  week: 1 | 2 | 3 | 4,
  weekday: 0 | 1 | 2 | 3 | 4 | 5 | 6,
  day: DaySpec,
): DefaultWorkout {
  const intensity = WEEK_INTENSITY[week];
  if (day.type === "rest") {
    return {
      week,
      weekday,
      type: "rest",
      title: "დასვენება",
      focus: null,
      durationMin: null,
      intensity,
      timeStart: null,
      timeEnd: null,
      videoUrl: null,
      description: null,
    };
  }
  return {
    week,
    weekday,
    type: day.type,
    title: day.title,
    focus: day.focus,
    durationMin: day.durationMin,
    intensity,
    timeStart: null,
    timeEnd: null,
    videoUrl: null,
    description: null,
  };
}

export const defaultWorkouts: readonly DefaultWorkout[] = ([1, 2, 3, 4] as const).flatMap((week) =>
  ([0, 1, 2, 3, 4, 5, 6] as const).map((weekday) => buildRow(week, weekday, WEEKS[week][weekday])),
);
