import { and, eq } from "drizzle-orm";

import { MealList } from "@/components/today/MealList";
import { SnapshotCard } from "@/components/today/SnapshotCard";
import { TodayHeader } from "@/components/today/TodayHeader";
import { WorkoutCard } from "@/components/today/WorkoutCard";
import { db } from "@/db";
import { getTodayPlan, type MealWithDetails } from "@/db/queries";
import { userSettings, waterLogs } from "@/db/schema";
import { getOwnerUser } from "@/lib/auth";
import {
  formatGeorgianDateLine,
  getCurrentMinutesInTimeZone,
  getTodayInTimeZone,
  parseTimeToMinutes,
} from "@/lib/date";

export const dynamic = "force-dynamic";

const PLAN_WEEKS = 4;
const WATER_GLASSES_TOTAL = 8;
const MEAL_EMOJIS = ["🍳", "🫐", "🍗", "🥜", "🥗"] as const;

type MealState = "done" | "active" | "upcoming";

function deriveMealStates(
  meals: readonly MealWithDetails[],
  nowMinutes: number,
): { state: MealState; emoji: string }[] {
  let activeAssigned = false;
  const sorted = meals
    .map((m, i) => ({ idx: i, minutes: parseTimeToMinutes(m.time) ?? 0, meal: m }))
    .sort((a, b) => a.minutes - b.minutes);

  const stateByIdx = new Map<number, MealState>();
  for (const { idx, minutes, meal } of sorted) {
    if (meal.completed) {
      stateByIdx.set(idx, "done");
      continue;
    }
    if (!activeAssigned && minutes >= nowMinutes - 30) {
      stateByIdx.set(idx, "active");
      activeAssigned = true;
      continue;
    }
    stateByIdx.set(idx, "upcoming");
  }

  if (!activeAssigned) {
    for (const { idx, meal } of sorted) {
      if (!meal.completed) {
        stateByIdx.set(idx, "active");
        break;
      }
    }
  }

  return meals.map((_, i) => ({
    state: stateByIdx.get(i) ?? "upcoming",
    emoji: MEAL_EMOJIS[i] ?? "🍽",
  }));
}

export default async function TodayPage() {
  const owner = await getOwnerUser();
  const today = getTodayInTimeZone(owner.timezone);

  const [settingsRow] = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.userId, owner.id))
    .limit(1);

  if (!settingsRow) {
    throw new Error(`Missing user_settings for ${owner.email}. Re-run seed.`);
  }

  const [waterRow] = await db
    .select({ glassesCount: waterLogs.glassesCount })
    .from(waterLogs)
    .where(and(eq(waterLogs.userId, owner.id), eq(waterLogs.date, today)))
    .limit(1);

  const plan = await getTodayPlan(owner.id, today);

  const completedMeals = plan.meals.filter((m) => m.completed);
  const kcalEaten = completedMeals.reduce((sum, m) => sum + m.calories, 0);
  const proteinEaten = completedMeals.reduce((sum, m) => sum + m.pG, 0);
  const carbsEaten = completedMeals.reduce((sum, m) => sum + m.nG, 0);
  const fatEaten = completedMeals.reduce((sum, m) => sum + m.fG, 0);

  const nowMinutes = getCurrentMinutesInTimeZone(owner.timezone);
  const states = deriveMealStates(plan.meals, nowMinutes);
  const mealsWithState = plan.meals.map((meal, i) => ({
    ...meal,
    state: states[i]?.state ?? "upcoming",
    emoji: states[i]?.emoji ?? "🍽",
  }));

  const subtitle = plan.dayType === "workout" ? "დღეს ვარჯიშის დღეა" : "დღეს დასვენების დღეა";
  const waterGlasses = Math.min(WATER_GLASSES_TOTAL, waterRow?.glassesCount ?? 0);
  const waterTargetL = Number(settingsRow.waterTargetL);

  return (
    <>
      <TodayHeader
        dateLine={formatGeorgianDateLine(today, owner.timezone)}
        week={plan.week}
        totalWeeks={PLAN_WEEKS}
        name={owner.name}
        subtitle={subtitle}
      />
      <SnapshotCard
        kcalEaten={kcalEaten}
        kcalGoal={settingsRow.calorieTarget}
        macros={[
          { key: "P", short: "P", value: proteinEaten, goal: settingsRow.pTarget, unit: "გ" },
          { key: "N", short: "ნ", value: carbsEaten, goal: settingsRow.nTarget, unit: "გ" },
          { key: "F", short: "ც", value: fatEaten, goal: settingsRow.fTarget, unit: "გ" },
        ]}
        waterGlasses={waterGlasses}
        waterGlassesTotal={WATER_GLASSES_TOTAL}
        waterTargetL={waterTargetL}
      />
      <MealList meals={mealsWithState} completedCount={completedMeals.length} />
      <WorkoutCard workout={plan.workout} completed={plan.workoutCompleted} />
      <div className="h-[110px]" />
    </>
  );
}
