import { randomUUID } from "node:crypto";

import { asc, eq } from "drizzle-orm";

import { db } from "../index";
import {
  defaultMealIngredients,
  defaultMeals,
  defaultMealSwaps,
  mealIngredients,
  meals,
  mealSwaps,
  userSettings,
  workouts,
  type NewMeal,
  type NewMealIngredient,
  type NewMealSwap,
  type NewWorkout,
} from "../schema";
import { defaultWorkouts } from "../seed/default-workouts";

export type SeedUserPlanOptions = {
  /** ISO `YYYY-MM-DD`. Defaults to today (UTC). */
  planStartDate?: string;
};

export type SeedUserPlanResult = {
  inserted: boolean;
  mealsCount: number;
  workoutsCount: number;
};

export async function seedUserPlan(
  userId: string,
  options: SeedUserPlanOptions = {},
): Promise<SeedUserPlanResult> {
  const existing = await db
    .select({ userId: userSettings.userId })
    .from(userSettings)
    .where(eq(userSettings.userId, userId))
    .limit(1);

  if (existing.length > 0) {
    return { inserted: false, mealsCount: 0, workoutsCount: 0 };
  }

  const planStartDate = options.planStartDate ?? new Date().toISOString().slice(0, 10);

  const [defaultMealRows, defaultIngredientRows, defaultSwapRows] = await Promise.all([
    db.select().from(defaultMeals).orderBy(asc(defaultMeals.sortOrder)),
    db.select().from(defaultMealIngredients).orderBy(asc(defaultMealIngredients.sortOrder)),
    db.select().from(defaultMealSwaps).orderBy(asc(defaultMealSwaps.sortOrder)),
  ]);

  if (defaultMealRows.length === 0) {
    throw new Error("default_meals is empty — run `pnpm db:seed` before seeding a user plan.");
  }

  const mealIdByDefault = new Map<string, string>();
  const mealInserts: NewMeal[] = defaultMealRows.map((m) => {
    const newId = randomUUID();
    mealIdByDefault.set(m.id, newId);
    return {
      id: newId,
      userId,
      dayType: m.dayType,
      time: m.time,
      name: m.name,
      summary: m.summary,
      calories: m.calories,
      pG: m.pG,
      nG: m.nG,
      fG: m.fG,
      sortOrder: m.sortOrder,
    };
  });

  const ingredientInserts: NewMealIngredient[] = defaultIngredientRows.flatMap((row) => {
    const mealId = mealIdByDefault.get(row.defaultMealId);
    return mealId ? [{ mealId, name: row.name, amount: row.amount, sortOrder: row.sortOrder }] : [];
  });

  const swapInserts: NewMealSwap[] = defaultSwapRows.flatMap((row) => {
    const mealId = mealIdByDefault.get(row.defaultMealId);
    return mealId ? [{ mealId, name: row.name, sortOrder: row.sortOrder }] : [];
  });

  const workoutInserts: NewWorkout[] = defaultWorkouts.map((w) => ({
    userId,
    week: w.week,
    weekday: w.weekday,
    type: w.type,
    title: w.title,
    focus: w.focus,
    durationMin: w.durationMin,
    intensity: w.intensity,
    timeStart: w.timeStart,
    timeEnd: w.timeEnd,
    videoUrl: w.videoUrl,
    description: w.description,
  }));

  await db.batch([
    db.insert(userSettings).values({ userId, planStartDate }),
    db.insert(meals).values(mealInserts),
    db.insert(mealIngredients).values(ingredientInserts),
    db.insert(mealSwaps).values(swapInserts),
    db.insert(workouts).values(workoutInserts),
  ]);

  return {
    inserted: true,
    mealsCount: mealInserts.length,
    workoutsCount: workoutInserts.length,
  };
}
