import { randomUUID } from "node:crypto";

import { and, eq, inArray, sql } from "drizzle-orm";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

import { db } from "../../src/db";
import { resetUserPlan } from "../../src/db/helpers/resetUserPlan";
import { seedUserPlan } from "../../src/db/helpers/seedUserPlan";
import {
  defaultMeals,
  mealIngredients,
  mealLogs,
  mealSwaps,
  meals,
  userSettings,
  users,
  workouts,
} from "../../src/db/schema";

import { createTestUser, truncateUserData } from "./helpers";

const PLAN_START = "2026-01-05";
const EXPECTED_MEAL_COUNT = 10;
const EXPECTED_WORKOUT_COUNT = 28;

describe("seedUserPlan / resetUserPlan (integration)", () => {
  beforeEach(async () => {
    await truncateUserData();
  });

  afterAll(async () => {
    await truncateUserData();
  });

  describe("seedUserPlan", () => {
    it("inserts the expected meal/workout/settings counts on a fresh user", async () => {
      const user = await createTestUser({ planStartDate: PLAN_START, seedPlan: false });

      const result = await seedUserPlan(user.id, { planStartDate: PLAN_START });

      expect(result).toEqual({
        inserted: true,
        mealsCount: EXPECTED_MEAL_COUNT,
        workoutsCount: EXPECTED_WORKOUT_COUNT,
      });

      const userMeals = await db.select().from(meals).where(eq(meals.userId, user.id));
      const userWorkouts = await db.select().from(workouts).where(eq(workouts.userId, user.id));
      const settings = await db.select().from(userSettings).where(eq(userSettings.userId, user.id));

      expect(userMeals).toHaveLength(EXPECTED_MEAL_COUNT);
      expect(userWorkouts).toHaveLength(EXPECTED_WORKOUT_COUNT);
      expect(settings).toHaveLength(1);
      expect(settings[0]!.planStartDate).toBe(PLAN_START);

      // Workout grid spans 4 weeks × 7 weekdays.
      const weeks = new Set(userWorkouts.map((w) => w.week));
      const weekdays = new Set(userWorkouts.map((w) => w.weekday));
      expect([...weeks].sort()).toEqual([1, 2, 3, 4]);
      expect([...weekdays].sort()).toEqual([0, 1, 2, 3, 4, 5, 6]);

      // Ingredients + swaps are populated for the seeded meals.
      const mealIds = userMeals.map((m) => m.id);
      const [ingredientRows] = await Promise.all([
        db.select().from(mealIngredients).where(inArray(mealIngredients.mealId, mealIds)),
      ]);
      const swapRows = await db.select().from(mealSwaps).where(inArray(mealSwaps.mealId, mealIds));
      expect(ingredientRows.length).toBeGreaterThan(0);
      expect(swapRows.length).toBeGreaterThan(0);
    });

    it("is idempotent — a second call inserts nothing and reports inserted:false", async () => {
      const user = await createTestUser({ planStartDate: PLAN_START, seedPlan: false });

      const first = await seedUserPlan(user.id, { planStartDate: PLAN_START });
      expect(first.inserted).toBe(true);

      const second = await seedUserPlan(user.id, { planStartDate: PLAN_START });
      expect(second).toEqual({ inserted: false, mealsCount: 0, workoutsCount: 0 });

      const mealCount = await db.$count(meals, eq(meals.userId, user.id));
      const workoutCount = await db.$count(workouts, eq(workouts.userId, user.id));
      expect(mealCount).toBe(EXPECTED_MEAL_COUNT);
      expect(workoutCount).toBe(EXPECTED_WORKOUT_COUNT);
    });

    it("is user-scoped — seeding user A does not touch user B's data", async () => {
      const userA = await createTestUser({ planStartDate: PLAN_START, seedPlan: false });
      const userB = await createTestUser({ planStartDate: PLAN_START });

      const mealsBBefore = await db.select().from(meals).where(eq(meals.userId, userB.id));
      const workoutsBBefore = await db.select().from(workouts).where(eq(workouts.userId, userB.id));

      await seedUserPlan(userA.id, { planStartDate: PLAN_START });

      const mealsAAfter = await db.select().from(meals).where(eq(meals.userId, userA.id));
      const mealsBAfter = await db.select().from(meals).where(eq(meals.userId, userB.id));
      const workoutsBAfter = await db.select().from(workouts).where(eq(workouts.userId, userB.id));

      expect(mealsAAfter).toHaveLength(EXPECTED_MEAL_COUNT);
      expect(mealsAAfter.every((m) => m.userId === userA.id)).toBe(true);

      // User B's rows are byte-for-byte unchanged.
      expect(mealsBAfter).toEqual(mealsBBefore);
      expect(workoutsBAfter).toEqual(workoutsBBefore);
    });

    it("throws when default_meals is empty", async () => {
      // Snapshot defaults so we can restore them — globalSetup seeded once for the run.
      const defaults = await db.select().from(defaultMeals);
      const user = await createTestUser({ planStartDate: PLAN_START, seedPlan: false });

      await db.execute(sql`TRUNCATE TABLE default_meals CASCADE`);

      try {
        await expect(seedUserPlan(user.id, { planStartDate: PLAN_START })).rejects.toThrow(
          /default_meals is empty/,
        );
      } finally {
        // Restore so subsequent tests still see the seeded defaults.
        const { seedDefaultMeals } = await import("../../src/db/seed");
        await seedDefaultMeals();
        // Sanity: re-seed restored the same row count.
        const restored = await db.$count(defaultMeals);
        expect(restored).toBe(defaults.length);
      }
    });
  });

  describe("resetUserPlan", () => {
    it("restores default meal/workout templates after the user has edited them", async () => {
      const user = await createTestUser({ planStartDate: PLAN_START });

      // Mutate a meal and a workout, and add a stray user-only meal.
      const userMeals = await db.select().from(meals).where(eq(meals.userId, user.id));
      const targetMeal = userMeals[0]!;
      await db
        .update(meals)
        .set({ name: "EDITED MEAL", calories: 9999 })
        .where(eq(meals.id, targetMeal.id));

      const targetWorkout = (
        await db
          .select()
          .from(workouts)
          .where(and(eq(workouts.userId, user.id), eq(workouts.week, 1), eq(workouts.weekday, 0)))
      )[0]!;
      await db
        .update(workouts)
        .set({ title: "EDITED WORKOUT" })
        .where(eq(workouts.id, targetWorkout.id));

      const strayMealId = randomUUID();
      await db.insert(meals).values({
        id: strayMealId,
        userId: user.id,
        dayType: "workout",
        time: "23:00",
        name: "Stray",
        summary: "stray",
        calories: 1,
        pG: 0,
        nG: 0,
        fG: 0,
        sortOrder: 9999,
      });

      const result = await resetUserPlan(user.id);
      expect(result).toEqual({
        mealsReset: EXPECTED_MEAL_COUNT,
        workoutsReset: EXPECTED_WORKOUT_COUNT,
      });

      // Mutated meal restored.
      const restoredMeal = (await db.select().from(meals).where(eq(meals.id, targetMeal.id)))[0];
      expect(restoredMeal?.name).not.toBe("EDITED MEAL");
      expect(restoredMeal?.calories).not.toBe(9999);

      // Stray meal removed.
      const strayAfter = await db.select().from(meals).where(eq(meals.id, strayMealId));
      expect(strayAfter).toHaveLength(0);

      // Mutated workout restored, ID preserved (same (user,week,weekday) slot).
      const restoredWorkout = (
        await db.select().from(workouts).where(eq(workouts.id, targetWorkout.id))
      )[0];
      expect(restoredWorkout?.title).not.toBe("EDITED WORKOUT");

      // Counts back to the canonical defaults.
      const mealCount = await db.$count(meals, eq(meals.userId, user.id));
      const workoutCount = await db.$count(workouts, eq(workouts.userId, user.id));
      expect(mealCount).toBe(EXPECTED_MEAL_COUNT);
      expect(workoutCount).toBe(EXPECTED_WORKOUT_COUNT);
    });

    it("preserves the user row, user_settings, and meal_logs for matched meals", async () => {
      const user = await createTestUser({ planStartDate: PLAN_START });

      // Customise settings so we can confirm the row survives untouched.
      await db
        .update(userSettings)
        .set({ calorieTarget: 1500, currentWeekOverride: 2 })
        .where(eq(userSettings.userId, user.id));

      const userMealRows = await db.select().from(meals).where(eq(meals.userId, user.id));
      const loggedMealId = userMealRows[0]!.id;
      await db.insert(mealLogs).values({
        userId: user.id,
        mealId: loggedMealId,
        date: PLAN_START,
      });

      await resetUserPlan(user.id);

      // User row still present.
      const userRow = await db.select().from(users).where(eq(users.id, user.id));
      expect(userRow).toHaveLength(1);

      // Settings row preserved with customised values.
      const settingsAfter = (
        await db.select().from(userSettings).where(eq(userSettings.userId, user.id))
      )[0]!;
      expect(settingsAfter.calorieTarget).toBe(1500);
      expect(settingsAfter.currentWeekOverride).toBe(2);

      // meal_log for a default-matched meal survives — that's the whole point
      // of update-in-place instead of wipe-and-reinsert.
      const logsAfter = await db
        .select()
        .from(mealLogs)
        .where(and(eq(mealLogs.userId, user.id), eq(mealLogs.mealId, loggedMealId)));
      expect(logsAfter).toHaveLength(1);
    });

    it("is user-scoped — resetting user A leaves user B's data untouched", async () => {
      const userA = await createTestUser({ planStartDate: PLAN_START });
      const userB = await createTestUser({ planStartDate: PLAN_START });

      // Mutate B so we can detect any cross-user write.
      const userBMealRows = await db.select().from(meals).where(eq(meals.userId, userB.id));
      const bTarget = userBMealRows[0]!;
      await db.update(meals).set({ name: "USER_B_CUSTOM" }).where(eq(meals.id, bTarget.id));

      const mealsBBefore = await db
        .select()
        .from(meals)
        .where(eq(meals.userId, userB.id))
        .orderBy(meals.sortOrder, meals.dayType);
      const workoutsBBefore = await db
        .select()
        .from(workouts)
        .where(eq(workouts.userId, userB.id))
        .orderBy(workouts.week, workouts.weekday);
      const settingsBBefore = (
        await db.select().from(userSettings).where(eq(userSettings.userId, userB.id))
      )[0];

      await resetUserPlan(userA.id);

      const mealsBAfter = await db
        .select()
        .from(meals)
        .where(eq(meals.userId, userB.id))
        .orderBy(meals.sortOrder, meals.dayType);
      const workoutsBAfter = await db
        .select()
        .from(workouts)
        .where(eq(workouts.userId, userB.id))
        .orderBy(workouts.week, workouts.weekday);
      const settingsBAfter = (
        await db.select().from(userSettings).where(eq(userSettings.userId, userB.id))
      )[0];

      expect(mealsBAfter).toEqual(mealsBBefore);
      expect(workoutsBAfter).toEqual(workoutsBBefore);
      expect(settingsBAfter).toEqual(settingsBBefore);
    });

    it("throws when called on a user with no plan (no user_settings row)", async () => {
      const user = await createTestUser({ planStartDate: PLAN_START, seedPlan: false });

      await expect(resetUserPlan(user.id)).rejects.toThrow(/has no plan/);
    });
  });
});
