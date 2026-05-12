import { and, eq } from "drizzle-orm";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

import { db } from "../../src/db";
import {
  dayTypeFromWorkout,
  getAdherenceStats,
  getDayTypeForUser,
  getTodayPlan,
  getWeekProgression,
  getWeightHistory,
  logMealComplete,
  logWater,
  logWeight,
  logWorkoutComplete,
  resolveWeekAndWeekday,
  unlogMealComplete,
} from "../../src/db/queries";
import {
  mealLogs,
  meals,
  userSettings,
  waterLogs,
  weightLogs,
  workoutLogs,
  workouts,
} from "../../src/db/schema";

import { createTestUser, truncateUserData } from "./helpers";

// Anchor plan start to a Monday so weekday math is intuitive (week=1, weekday=0).
const PLAN_START = "2026-01-05"; // Monday, UTC

function addDaysUTC(date: string, days: number): string {
  const ms = new Date(`${date}T00:00:00Z`).getTime() + days * 86_400_000;
  return new Date(ms).toISOString().slice(0, 10);
}

describe("query helpers (integration)", () => {
  beforeEach(async () => {
    await truncateUserData();
  });

  afterAll(async () => {
    // Final cleanup so the test branch is left tidy.
    await truncateUserData();
  });

  describe("resolveWeekAndWeekday", () => {
    it("returns week=1, weekday=0 on the plan start date", () => {
      expect(resolveWeekAndWeekday(PLAN_START, null, PLAN_START)).toEqual({ week: 1, weekday: 0 });
    });

    it("wraps to week 1 after 28 days (4-week cycle)", () => {
      const day28 = addDaysUTC(PLAN_START, 28);
      expect(resolveWeekAndWeekday(PLAN_START, null, day28)).toEqual({ week: 1, weekday: 0 });
    });

    it("honours currentWeekOverride", () => {
      const day10 = addDaysUTC(PLAN_START, 10);
      expect(resolveWeekAndWeekday(PLAN_START, 3, day10)).toEqual({ week: 3, weekday: 3 });
    });
  });

  describe("dayTypeFromWorkout", () => {
    it("returns 'rest' for null/undefined", () => {
      expect(dayTypeFromWorkout(null)).toBe("rest");
      expect(dayTypeFromWorkout(undefined)).toBe("rest");
    });

    it("returns 'rest' for a rest-type workout row", () => {
      expect(dayTypeFromWorkout({ type: "rest" })).toBe("rest");
    });

    it("returns 'workout' for non-rest workout types", () => {
      expect(dayTypeFromWorkout({ type: "pilates" })).toBe("workout");
      expect(dayTypeFromWorkout({ type: "cardio" })).toBe("workout");
      expect(dayTypeFromWorkout({ type: "combo" })).toBe("workout");
    });
  });

  describe("getDayTypeForUser", () => {
    it("returns 'workout' on the plan start (week 1, weekday 0 is pilates)", async () => {
      const user = await createTestUser({ planStartDate: PLAN_START });
      await expect(getDayTypeForUser(user.id, PLAN_START)).resolves.toBe("workout");
    });

    it("returns 'rest' on a seeded rest weekday (week 1, weekday 3)", async () => {
      const user = await createTestUser({ planStartDate: PLAN_START });
      const thursday = addDaysUTC(PLAN_START, 3);
      await expect(getDayTypeForUser(user.id, thursday)).resolves.toBe("rest");
    });

    it("swaps day-type when a workout is moved to a previously-rest weekday", async () => {
      // Acceptance: if the Thursday rest day gets a combo workout moved into it,
      // and Friday's combo is changed to rest, the day-types swap accordingly.
      const user = await createTestUser({ planStartDate: PLAN_START });
      const thursday = addDaysUTC(PLAN_START, 3); // weekday 3 — seeded as rest
      const friday = addDaysUTC(PLAN_START, 4); // weekday 4 — seeded as combo

      expect(await getDayTypeForUser(user.id, thursday)).toBe("rest");
      expect(await getDayTypeForUser(user.id, friday)).toBe("workout");

      // Swap: Thursday → combo, Friday → rest.
      await db
        .update(workouts)
        .set({ type: "combo" })
        .where(and(eq(workouts.userId, user.id), eq(workouts.week, 1), eq(workouts.weekday, 3)));
      await db
        .update(workouts)
        .set({ type: "rest" })
        .where(and(eq(workouts.userId, user.id), eq(workouts.week, 1), eq(workouts.weekday, 4)));

      expect(await getDayTypeForUser(user.id, thursday)).toBe("workout");
      expect(await getDayTypeForUser(user.id, friday)).toBe("rest");
    });

    it("respects currentWeekOverride when resolving the weekday's workout", async () => {
      const user = await createTestUser({ planStartDate: PLAN_START });

      // Force week=3 even on the plan start date.
      await db
        .update(userSettings)
        .set({ currentWeekOverride: 3 })
        .where(eq(userSettings.userId, user.id));

      // Override week 3's Monday (weekday 0) to rest; expect helper to follow override.
      await db
        .update(workouts)
        .set({ type: "rest" })
        .where(and(eq(workouts.userId, user.id), eq(workouts.week, 3), eq(workouts.weekday, 0)));

      await expect(getDayTypeForUser(user.id, PLAN_START)).resolves.toBe("rest");
    });

    it("returns 'rest' for users with no workouts seeded", async () => {
      const user = await createTestUser({ planStartDate: PLAN_START });
      await db.delete(workouts).where(eq(workouts.userId, user.id));
      await expect(getDayTypeForUser(user.id, PLAN_START)).resolves.toBe("rest");
    });

    it("isolates day-type lookup by user_id", async () => {
      const userA = await createTestUser({ planStartDate: PLAN_START });
      const userB = await createTestUser({ planStartDate: PLAN_START });

      // Wipe userA's workouts so their plan-start is 'rest'; userB's stays 'workout'.
      await db.delete(workouts).where(eq(workouts.userId, userA.id));

      expect(await getDayTypeForUser(userA.id, PLAN_START)).toBe("rest");
      expect(await getDayTypeForUser(userB.id, PLAN_START)).toBe("workout");
    });
  });

  describe("getTodayPlan", () => {
    it("returns meals + workout for a workout day on plan start", async () => {
      const user = await createTestUser({ planStartDate: PLAN_START });

      const plan = await getTodayPlan(user.id, PLAN_START);

      expect(plan.date).toBe(PLAN_START);
      expect(plan.week).toBe(1);
      expect(plan.weekday).toBe(0);
      expect(plan.dayType).toBe("workout");
      expect(plan.workout).not.toBeNull();
      expect(plan.workoutCompleted).toBe(false);
      expect(plan.meals.length).toBeGreaterThan(0);
      expect(plan.meals.every((m) => m.dayType === "workout")).toBe(true);
      expect(plan.meals.every((m) => m.completed === false)).toBe(true);
      // Ingredients are eagerly joined.
      expect(plan.meals.some((m) => m.ingredients.length > 0)).toBe(true);
    });

    it("returns rest-day meals on a rest day", async () => {
      const user = await createTestUser({ planStartDate: PLAN_START });

      // Find a weekday with type=rest from the seeded plan.
      const restRow = await db
        .select({ weekday: workouts.weekday })
        .from(workouts)
        .where(and(eq(workouts.userId, user.id), eq(workouts.week, 1), eq(workouts.type, "rest")))
        .limit(1);

      expect(restRow[0]).toBeDefined();
      const restDate = addDaysUTC(PLAN_START, restRow[0]!.weekday);

      const plan = await getTodayPlan(user.id, restDate);
      expect(plan.dayType).toBe("rest");
      expect(plan.meals.every((m) => m.dayType === "rest")).toBe(true);
    });

    it("marks a meal completed after logMealComplete", async () => {
      const user = await createTestUser({ planStartDate: PLAN_START });
      const before = await getTodayPlan(user.id, PLAN_START);
      const targetMeal = before.meals[0]!;

      await logMealComplete(user.id, targetMeal.id, PLAN_START);
      const after = await getTodayPlan(user.id, PLAN_START);

      const reloaded = after.meals.find((m) => m.id === targetMeal.id);
      expect(reloaded?.completed).toBe(true);

      // Idempotency: second call must not throw or duplicate.
      await logMealComplete(user.id, targetMeal.id, PLAN_START);
      const rows = await db
        .select()
        .from(mealLogs)
        .where(
          and(
            eq(mealLogs.userId, user.id),
            eq(mealLogs.mealId, targetMeal.id),
            eq(mealLogs.date, PLAN_START),
          ),
        );
      expect(rows).toHaveLength(1);
    });

    it("unlogMealComplete removes the log", async () => {
      const user = await createTestUser({ planStartDate: PLAN_START });
      const plan = await getTodayPlan(user.id, PLAN_START);
      const mealId = plan.meals[0]!.id;

      await logMealComplete(user.id, mealId, PLAN_START);
      await unlogMealComplete(user.id, mealId, PLAN_START);

      const after = await getTodayPlan(user.id, PLAN_START);
      expect(after.meals.find((m) => m.id === mealId)?.completed).toBe(false);
    });

    it("reflects workoutCompleted after logWorkoutComplete", async () => {
      const user = await createTestUser({ planStartDate: PLAN_START });
      const plan = await getTodayPlan(user.id, PLAN_START);
      expect(plan.workout).not.toBeNull();

      await logWorkoutComplete(user.id, plan.workout!.id, PLAN_START);
      const after = await getTodayPlan(user.id, PLAN_START);
      expect(after.workoutCompleted).toBe(true);
    });
  });

  describe("getWeekProgression", () => {
    it("returns all 7 weekdays for the requested week", async () => {
      const user = await createTestUser({ planStartDate: PLAN_START });

      const weekRows = await getWeekProgression(user.id, 2);
      expect(weekRows).toHaveLength(7);
      expect(weekRows.map((w) => w.weekday)).toEqual([0, 1, 2, 3, 4, 5, 6]);
      expect(weekRows.every((w) => w.userId === user.id)).toBe(true);
      expect(weekRows.every((w) => w.week === 2)).toBe(true);
    });
  });

  describe("logWater", () => {
    it("inserts and then upserts the same (user_id, date) row", async () => {
      const user = await createTestUser({ planStartDate: PLAN_START });

      await logWater(user.id, PLAN_START, 3);
      let rows = await db
        .select()
        .from(waterLogs)
        .where(and(eq(waterLogs.userId, user.id), eq(waterLogs.date, PLAN_START)));
      expect(rows).toHaveLength(1);
      expect(rows[0]!.glassesCount).toBe(3);

      await logWater(user.id, PLAN_START, 7);
      rows = await db
        .select()
        .from(waterLogs)
        .where(and(eq(waterLogs.userId, user.id), eq(waterLogs.date, PLAN_START)));
      expect(rows).toHaveLength(1);
      expect(rows[0]!.glassesCount).toBe(7);
    });
  });

  describe("logWeight + getWeightHistory", () => {
    it("upserts by (user_id, date) and returns history in ascending order", async () => {
      const user = await createTestUser({ planStartDate: PLAN_START });

      const d1 = PLAN_START;
      const d2 = addDaysUTC(PLAN_START, 1);
      const d3 = addDaysUTC(PLAN_START, 2);

      await logWeight(user.id, d2, 80.5);
      await logWeight(user.id, d1, 81);
      await logWeight(user.id, d3, 79.8);
      // Same-date overwrite:
      await logWeight(user.id, d2, 80.2);

      const history = await getWeightHistory(user.id);
      expect(history).toEqual([
        { date: d1, kg: 81 },
        { date: d2, kg: 80.2 },
        { date: d3, kg: 79.8 },
      ]);

      const filtered = await getWeightHistory(user.id, { from: d2, to: d3 });
      expect(filtered).toEqual([
        { date: d2, kg: 80.2 },
        { date: d3, kg: 79.8 },
      ]);
    });
  });

  describe("getAdherenceStats", () => {
    it("computes totals over a 7-day window and 0% completion before any logs", async () => {
      const user = await createTestUser({ planStartDate: PLAN_START });
      const weekEnd = addDaysUTC(PLAN_START, 6);

      const stats = await getAdherenceStats(user.id, PLAN_START, weekEnd);

      expect(stats.meals.total).toBeGreaterThan(0);
      expect(stats.meals.completed).toBe(0);
      expect(stats.meals.pct).toBe(0);

      expect(stats.workouts.total).toBeGreaterThan(0);
      expect(stats.workouts.completed).toBe(0);
      expect(stats.workouts.pct).toBe(0);
    });

    it("reflects logged completions and reaches 100% when fully adhered", async () => {
      const user = await createTestUser({ planStartDate: PLAN_START });
      const weekEnd = addDaysUTC(PLAN_START, 6);

      // Log every meal and workout in week 1.
      const userMeals = await db.select().from(meals).where(eq(meals.userId, user.id));
      const userWorkouts = await db
        .select()
        .from(workouts)
        .where(and(eq(workouts.userId, user.id), eq(workouts.week, 1)));

      for (let day = 0; day < 7; day += 1) {
        const date = addDaysUTC(PLAN_START, day);
        const workout = userWorkouts.find((w) => w.weekday === day);
        const dayType = workout && workout.type !== "rest" ? "workout" : "rest";
        const mealsForDay = userMeals.filter((m) => m.dayType === dayType);
        for (const m of mealsForDay) {
          await logMealComplete(user.id, m.id, date);
        }
        if (workout && workout.type !== "rest") {
          await logWorkoutComplete(user.id, workout.id, date);
        }
      }

      const stats = await getAdherenceStats(user.id, PLAN_START, weekEnd);
      expect(stats.meals.completed).toBe(stats.meals.total);
      expect(stats.meals.pct).toBe(100);
      expect(stats.workouts.completed).toBe(stats.workouts.total);
      expect(stats.workouts.pct).toBe(100);
    });
  });

  describe("ownership scoping (cross-user leak guard)", () => {
    it("getTodayPlan, getWeekProgression, getWeightHistory, getAdherenceStats only see the requesting user's data", async () => {
      const userA = await createTestUser({ planStartDate: PLAN_START });
      const userB = await createTestUser({ planStartDate: PLAN_START });

      // Both users now have full plans seeded.
      const planA = await getTodayPlan(userA.id, PLAN_START);
      expect(planA.meals.every((m) => m.userId === userA.id)).toBe(true);
      expect(planA.workout?.userId).toBe(userA.id);

      const weekB = await getWeekProgression(userB.id, 1);
      expect(weekB.every((w) => w.userId === userB.id)).toBe(true);

      // Logs are scoped: write for A only.
      await logWater(userA.id, PLAN_START, 5);
      await logWeight(userA.id, PLAN_START, 70);
      await logMealComplete(userA.id, planA.meals[0]!.id, PLAN_START);

      const weekEnd = addDaysUTC(PLAN_START, 6);
      const statsB = await getAdherenceStats(userB.id, PLAN_START, weekEnd);
      expect(statsB.meals.completed).toBe(0);
      expect(statsB.workouts.completed).toBe(0);

      const historyB = await getWeightHistory(userB.id);
      expect(historyB).toEqual([]);
    });

    it("logMealComplete writes are isolated by user_id", async () => {
      const userA = await createTestUser({ planStartDate: PLAN_START });
      const userB = await createTestUser({ planStartDate: PLAN_START });

      const planA = await getTodayPlan(userA.id, PLAN_START);
      await logMealComplete(userA.id, planA.meals[0]!.id, PLAN_START);

      const planBAfter = await getTodayPlan(userB.id, PLAN_START);
      expect(planBAfter.meals.every((m) => m.completed === false)).toBe(true);

      const logsForB = await db.select().from(mealLogs).where(eq(mealLogs.userId, userB.id));
      expect(logsForB).toHaveLength(0);
    });

    it("logWorkoutComplete writes are isolated by user_id", async () => {
      const userA = await createTestUser({ planStartDate: PLAN_START });
      const userB = await createTestUser({ planStartDate: PLAN_START });

      const planA = await getTodayPlan(userA.id, PLAN_START);
      await logWorkoutComplete(userA.id, planA.workout!.id, PLAN_START);

      const planB = await getTodayPlan(userB.id, PLAN_START);
      expect(planB.workoutCompleted).toBe(false);

      const logsForB = await db.select().from(workoutLogs).where(eq(workoutLogs.userId, userB.id));
      expect(logsForB).toHaveLength(0);
    });

    it("logWater / logWeight upserts do not leak across users with the same date", async () => {
      const userA = await createTestUser({ planStartDate: PLAN_START });
      const userB = await createTestUser({ planStartDate: PLAN_START });

      await logWater(userA.id, PLAN_START, 4);
      await logWater(userB.id, PLAN_START, 9);
      await logWeight(userA.id, PLAN_START, 70);
      await logWeight(userB.id, PLAN_START, 65);

      const waterA = await db
        .select()
        .from(waterLogs)
        .where(and(eq(waterLogs.userId, userA.id), eq(waterLogs.date, PLAN_START)));
      const waterB = await db
        .select()
        .from(waterLogs)
        .where(and(eq(waterLogs.userId, userB.id), eq(waterLogs.date, PLAN_START)));
      expect(waterA[0]!.glassesCount).toBe(4);
      expect(waterB[0]!.glassesCount).toBe(9);

      const weightA = await db
        .select({ kg: weightLogs.kg })
        .from(weightLogs)
        .where(and(eq(weightLogs.userId, userA.id), eq(weightLogs.date, PLAN_START)));
      const weightB = await db
        .select({ kg: weightLogs.kg })
        .from(weightLogs)
        .where(and(eq(weightLogs.userId, userB.id), eq(weightLogs.date, PLAN_START)));
      expect(Number(weightA[0]!.kg)).toBe(70);
      expect(Number(weightB[0]!.kg)).toBe(65);
    });
  });
});
