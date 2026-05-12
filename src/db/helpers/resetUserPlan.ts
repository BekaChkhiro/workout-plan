import { randomUUID } from "node:crypto";

import { and, asc, eq, inArray, notInArray, sql } from "drizzle-orm";

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
  type Meal,
  type NewMeal,
  type NewMealIngredient,
  type NewMealSwap,
  type NewWorkout,
} from "../schema";
import { defaultWorkouts } from "../seed/default-workouts";

export type ResetUserPlanResult = {
  mealsReset: number;
  workoutsReset: number;
};

/**
 * Restores a user's plan templates (meals + workouts and their children) to the
 * current defaults while preserving meal_logs / workout_logs / water_logs /
 * weight_logs / measurement_logs and user_settings.
 *
 * Strategy:
 *  - Meals: match existing rows to default rows by (dayType, sortOrder) and UPDATE
 *    in place, so meal_logs.meal_id continues to point at a valid row. Extra
 *    user-added meals (no matching default) ARE removed — their meal_logs cascade
 *    with them, which is unavoidable.
 *  - meal_ingredients / meal_swaps: no logs reference these, so wipe + re-insert.
 *  - Workouts: INSERT … ON CONFLICT (user_id, week, weekday) DO UPDATE — preserves
 *    workout IDs (and thus workout_logs) for the 4×7 grid.
 */
export async function resetUserPlan(userId: string): Promise<ResetUserPlanResult> {
  const settingsRow = await db
    .select({ userId: userSettings.userId })
    .from(userSettings)
    .where(eq(userSettings.userId, userId))
    .limit(1);

  if (settingsRow.length === 0) {
    throw new Error(`User ${userId} has no plan — call seedUserPlan first.`);
  }

  const [defaultMealRows, defaultIngredientRows, defaultSwapRows, existingMealRows] =
    await Promise.all([
      db.select().from(defaultMeals).orderBy(asc(defaultMeals.sortOrder)),
      db.select().from(defaultMealIngredients).orderBy(asc(defaultMealIngredients.sortOrder)),
      db.select().from(defaultMealSwaps).orderBy(asc(defaultMealSwaps.sortOrder)),
      db.select().from(meals).where(eq(meals.userId, userId)),
    ]);

  if (defaultMealRows.length === 0) {
    throw new Error("default_meals is empty — run `pnpm db:seed` before resetting a user plan.");
  }

  const mealKey = (dayType: Meal["dayType"], sortOrder: number) => `${dayType}:${sortOrder}`;
  const existingByKey = new Map(existingMealRows.map((m) => [mealKey(m.dayType, m.sortOrder), m]));

  const mealIdByDefault = new Map<string, string>();
  const keptUserMealIds: string[] = [];
  const updates: { id: string; values: Partial<NewMeal> }[] = [];
  const mealInserts: NewMeal[] = [];

  for (const dm of defaultMealRows) {
    const existing = existingByKey.get(mealKey(dm.dayType, dm.sortOrder));
    const target: Partial<NewMeal> = {
      dayType: dm.dayType,
      time: dm.time,
      name: dm.name,
      summary: dm.summary,
      calories: dm.calories,
      pG: dm.pG,
      nG: dm.nG,
      fG: dm.fG,
      sortOrder: dm.sortOrder,
    };

    if (existing) {
      mealIdByDefault.set(dm.id, existing.id);
      keptUserMealIds.push(existing.id);
      updates.push({ id: existing.id, values: target });
    } else {
      const newId = randomUUID();
      mealIdByDefault.set(dm.id, newId);
      keptUserMealIds.push(newId);
      mealInserts.push({ id: newId, userId, ...(target as Omit<NewMeal, "id" | "userId">) });
    }
  }

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

  for (const upd of updates) {
    await db.update(meals).set(upd.values).where(eq(meals.id, upd.id));
  }

  if (mealInserts.length > 0) {
    await db.insert(meals).values(mealInserts);
  }

  await db
    .delete(meals)
    .where(and(eq(meals.userId, userId), notInArray(meals.id, keptUserMealIds)));

  if (keptUserMealIds.length > 0) {
    await db.delete(mealIngredients).where(inArray(mealIngredients.mealId, keptUserMealIds));
    await db.delete(mealSwaps).where(inArray(mealSwaps.mealId, keptUserMealIds));
  }

  if (ingredientInserts.length > 0) {
    await db.insert(mealIngredients).values(ingredientInserts);
  }
  if (swapInserts.length > 0) {
    await db.insert(mealSwaps).values(swapInserts);
  }

  await db
    .insert(workouts)
    .values(workoutInserts)
    .onConflictDoUpdate({
      target: [workouts.userId, workouts.week, workouts.weekday],
      set: {
        type: sql`excluded.type`,
        title: sql`excluded.title`,
        focus: sql`excluded.focus`,
        durationMin: sql`excluded.duration_min`,
        intensity: sql`excluded.intensity`,
        timeStart: sql`excluded.time_start`,
        timeEnd: sql`excluded.time_end`,
        videoUrl: sql`excluded.video_url`,
        description: sql`excluded.description`,
      },
    });

  return {
    mealsReset: defaultMealRows.length,
    workoutsReset: workoutInserts.length,
  };
}
