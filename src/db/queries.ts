import { and, asc, eq, gte, inArray, lte, sql } from "drizzle-orm";

import { db } from "./index";
import {
  mealIngredients,
  mealLogs,
  mealSwaps,
  meals,
  measurementLogs,
  userSettings,
  users,
  waterLogs,
  weightLogs,
  workoutLogs,
  workouts,
  type Meal,
  type MealIngredient,
  type MealSwap,
  type Workout,
} from "./schema";

const MS_PER_DAY = 86_400_000;
const PLAN_WEEKS = 4;
const DAYS_PER_WEEK = 7;

export type DayType = "workout" | "rest";

export type MealWithDetails = Meal & {
  ingredients: MealIngredient[];
  swaps: MealSwap[];
  completed: boolean;
};

export type TodayPlan = {
  date: string;
  week: number;
  weekday: number;
  dayType: DayType;
  workout: Workout | null;
  workoutCompleted: boolean;
  meals: MealWithDetails[];
};

export type MealsDayTargets = {
  calories: number;
  pG: number;
  nG: number;
  fG: number;
  waterL: number;
};

export type MealsDay = {
  dayType: DayType;
  meals: MealWithDetails[];
  targets: MealsDayTargets;
};

export type WeightPoint = { date: string; kg: number };

export type MeasurementPoint = {
  date: string;
  waistCm: number | null;
  armCm: number | null;
  thighCm: number | null;
};

export type AdherenceStats = {
  meals: { completed: number; total: number; pct: number };
  workouts: { completed: number; total: number; pct: number };
  water: { days: number; total: number; pct: number };
  streak: number;
  weightDeltaKg: number | null;
};

function parseDateUTC(date: string): Date {
  return new Date(`${date}T00:00:00Z`);
}

function formatDateUTC(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function daysBetween(from: string, to: string): number {
  return Math.floor((parseDateUTC(to).getTime() - parseDateUTC(from).getTime()) / MS_PER_DAY);
}

export function resolveWeekAndWeekday(
  planStartDate: string,
  currentWeekOverride: number | null,
  date: string,
): { week: number; weekday: number } {
  const diff = daysBetween(planStartDate, date);
  const weekday = ((diff % DAYS_PER_WEEK) + DAYS_PER_WEEK) % DAYS_PER_WEEK;
  const cycleWeek = ((Math.floor(diff / DAYS_PER_WEEK) % PLAN_WEEKS) + PLAN_WEEKS) % PLAN_WEEKS;
  const week = currentWeekOverride ?? cycleWeek + 1;
  return { week, weekday };
}

export function dayTypeFromWorkout(workout: Pick<Workout, "type"> | null | undefined): DayType {
  return workout && workout.type !== "rest" ? "workout" : "rest";
}

function groupBy<T>(items: readonly T[], key: (item: T) => string): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const k = key(item);
    const arr = map.get(k);
    if (arr) arr.push(item);
    else map.set(k, [item]);
  }
  return map;
}

async function getUserPlanAnchor(
  userId: string,
): Promise<{ planStartDate: string; currentWeekOverride: number | null }> {
  const rows = await db
    .select({
      planStartDate: userSettings.planStartDate,
      currentWeekOverride: userSettings.currentWeekOverride,
    })
    .from(userSettings)
    .where(eq(userSettings.userId, userId))
    .limit(1);

  const row = rows[0];
  if (!row) {
    throw new Error(`No user_settings row for user ${userId}`);
  }
  return row;
}

export async function getTodayPlan(userId: string, date: string): Promise<TodayPlan> {
  const anchor = await getUserPlanAnchor(userId);
  const { week, weekday } = resolveWeekAndWeekday(
    anchor.planStartDate,
    anchor.currentWeekOverride,
    date,
  );

  const workoutRows = await db
    .select()
    .from(workouts)
    .where(and(eq(workouts.userId, userId), eq(workouts.week, week), eq(workouts.weekday, weekday)))
    .limit(1);

  const workout = workoutRows[0] ?? null;
  const dayType = dayTypeFromWorkout(workout);

  const mealRows = await db
    .select()
    .from(meals)
    .where(and(eq(meals.userId, userId), eq(meals.dayType, dayType)))
    .orderBy(asc(meals.sortOrder));

  const mealIds = mealRows.map((m) => m.id);

  const [ingredientRows, swapRows, mealLogRows, workoutLogRows] = await Promise.all([
    mealIds.length > 0
      ? db
          .select()
          .from(mealIngredients)
          .where(inArray(mealIngredients.mealId, mealIds))
          .orderBy(asc(mealIngredients.sortOrder))
      : Promise.resolve<MealIngredient[]>([]),
    mealIds.length > 0
      ? db
          .select()
          .from(mealSwaps)
          .where(inArray(mealSwaps.mealId, mealIds))
          .orderBy(asc(mealSwaps.sortOrder))
      : Promise.resolve<MealSwap[]>([]),
    mealIds.length > 0
      ? db
          .select({ mealId: mealLogs.mealId })
          .from(mealLogs)
          .where(
            and(
              eq(mealLogs.userId, userId),
              eq(mealLogs.date, date),
              inArray(mealLogs.mealId, mealIds),
            ),
          )
      : Promise.resolve<{ mealId: string }[]>([]),
    workout
      ? db
          .select({ workoutId: workoutLogs.workoutId })
          .from(workoutLogs)
          .where(
            and(
              eq(workoutLogs.userId, userId),
              eq(workoutLogs.date, date),
              eq(workoutLogs.workoutId, workout.id),
            ),
          )
      : Promise.resolve<{ workoutId: string }[]>([]),
  ]);

  const ingredientsByMeal = groupBy(ingredientRows, (i) => i.mealId);
  const swapsByMeal = groupBy(swapRows, (s) => s.mealId);
  const completedMealIds = new Set(mealLogRows.map((r) => r.mealId));

  return {
    date,
    week,
    weekday,
    dayType,
    workout,
    workoutCompleted: workoutLogRows.length > 0,
    meals: mealRows.map((m) => ({
      ...m,
      ingredients: ingredientsByMeal.get(m.id) ?? [],
      swaps: swapsByMeal.get(m.id) ?? [],
      completed: completedMealIds.has(m.id),
    })),
  };
}

export async function getDayTypeForUser(userId: string, date: string): Promise<DayType> {
  const anchor = await getUserPlanAnchor(userId);
  const { week, weekday } = resolveWeekAndWeekday(
    anchor.planStartDate,
    anchor.currentWeekOverride,
    date,
  );

  const rows = await db
    .select({ type: workouts.type })
    .from(workouts)
    .where(and(eq(workouts.userId, userId), eq(workouts.week, week), eq(workouts.weekday, weekday)))
    .limit(1);

  return dayTypeFromWorkout(rows[0]);
}

export async function getOwnerUserId(): Promise<string> {
  const rows = await db.select({ id: users.id }).from(users).orderBy(asc(users.createdAt)).limit(1);
  const row = rows[0];
  if (!row) {
    throw new Error("No user found — run `pnpm seed:owner` to create the owner account.");
  }
  return row.id;
}

export async function getMealsByDayType(
  userId: string,
  dayType: DayType,
  date: string,
): Promise<MealsDay> {
  const [mealRows, settingsRows] = await Promise.all([
    db
      .select()
      .from(meals)
      .where(and(eq(meals.userId, userId), eq(meals.dayType, dayType)))
      .orderBy(asc(meals.sortOrder)),
    db
      .select({
        calorieTarget: userSettings.calorieTarget,
        pTarget: userSettings.pTarget,
        nTarget: userSettings.nTarget,
        fTarget: userSettings.fTarget,
        waterTargetL: userSettings.waterTargetL,
      })
      .from(userSettings)
      .where(eq(userSettings.userId, userId))
      .limit(1),
  ]);

  const settings = settingsRows[0];
  if (!settings) {
    throw new Error(`No user_settings row for user ${userId}`);
  }

  const mealIds = mealRows.map((m) => m.id);

  const [ingredientRows, swapRows, mealLogRows] = await Promise.all([
    mealIds.length > 0
      ? db
          .select()
          .from(mealIngredients)
          .where(inArray(mealIngredients.mealId, mealIds))
          .orderBy(asc(mealIngredients.sortOrder))
      : Promise.resolve<MealIngredient[]>([]),
    mealIds.length > 0
      ? db
          .select()
          .from(mealSwaps)
          .where(inArray(mealSwaps.mealId, mealIds))
          .orderBy(asc(mealSwaps.sortOrder))
      : Promise.resolve<MealSwap[]>([]),
    mealIds.length > 0
      ? db
          .select({ mealId: mealLogs.mealId })
          .from(mealLogs)
          .where(
            and(
              eq(mealLogs.userId, userId),
              eq(mealLogs.date, date),
              inArray(mealLogs.mealId, mealIds),
            ),
          )
      : Promise.resolve<{ mealId: string }[]>([]),
  ]);

  const ingredientsByMeal = groupBy(ingredientRows, (i) => i.mealId);
  const swapsByMeal = groupBy(swapRows, (s) => s.mealId);
  const completedMealIds = new Set(mealLogRows.map((r) => r.mealId));

  return {
    dayType,
    meals: mealRows.map((m) => ({
      ...m,
      ingredients: ingredientsByMeal.get(m.id) ?? [],
      swaps: swapsByMeal.get(m.id) ?? [],
      completed: completedMealIds.has(m.id),
    })),
    targets: {
      calories: settings.calorieTarget,
      pG: settings.pTarget,
      nG: settings.nTarget,
      fG: settings.fTarget,
      waterL: Number(settings.waterTargetL),
    },
  };
}

export async function getWeekProgression(userId: string, week: number): Promise<Workout[]> {
  return db
    .select()
    .from(workouts)
    .where(and(eq(workouts.userId, userId), eq(workouts.week, week)))
    .orderBy(asc(workouts.weekday));
}

export type PlanDayState = "done" | "active" | "rest" | "peak" | "pending";

export type PlanDay = {
  week: number;
  weekday: number;
  workout: Workout | null;
  completed: boolean;
  state: PlanDayState;
};

export type PlanWeek = {
  week: number;
  days: PlanDay[];
  workoutCount: number;
  completedCount: number;
};

export type FourWeekPlan = {
  weeks: PlanWeek[];
  todayWeek: number;
  todayAutoWeek: number;
  todayWeekday: number;
  todayDate: string;
  planStartDate: string;
  currentWeekOverride: number | null;
};

function addDaysUTC(date: string, days: number): string {
  return formatDateUTC(new Date(parseDateUTC(date).getTime() + days * MS_PER_DAY));
}

export async function getFourWeekPlan(userId: string, date: string): Promise<FourWeekPlan> {
  const anchor = await getUserPlanAnchor(userId);
  const { week: todayWeek, weekday: todayWeekday } = resolveWeekAndWeekday(
    anchor.planStartDate,
    anchor.currentWeekOverride,
    date,
  );
  const { week: todayAutoWeek } = resolveWeekAndWeekday(anchor.planStartDate, null, date);

  const diff = daysBetween(anchor.planStartDate, date);
  const cycleLength = PLAN_WEEKS * DAYS_PER_WEEK;
  const cycleOffset = ((diff % cycleLength) + cycleLength) % cycleLength;
  const cycleStartDate = addDaysUTC(date, -cycleOffset);
  const cycleEndDate = addDaysUTC(cycleStartDate, cycleLength - 1);

  const [workoutRows, logRows] = await Promise.all([
    db
      .select()
      .from(workouts)
      .where(eq(workouts.userId, userId))
      .orderBy(asc(workouts.week), asc(workouts.weekday)),
    db
      .select({ workoutId: workoutLogs.workoutId })
      .from(workoutLogs)
      .where(
        and(
          eq(workoutLogs.userId, userId),
          gte(workoutLogs.date, cycleStartDate),
          lte(workoutLogs.date, cycleEndDate),
        ),
      ),
  ]);

  const completedIds = new Set(logRows.map((r) => r.workoutId));
  const workoutByKey = new Map<string, Workout>();
  for (const w of workoutRows) {
    workoutByKey.set(`${w.week}:${w.weekday}`, w);
  }

  const weeks: PlanWeek[] = [];
  for (let w = 1; w <= PLAN_WEEKS; w++) {
    const days: PlanDay[] = [];
    let workoutCount = 0;
    let completedCount = 0;

    for (let wd = 0; wd < DAYS_PER_WEEK; wd++) {
      const workout = workoutByKey.get(`${w}:${wd}`) ?? null;
      const isRest = !workout || workout.type === "rest";
      const completed = workout ? completedIds.has(workout.id) : false;
      const isToday = w === todayWeek && wd === todayWeekday;

      let state: PlanDayState;
      if (isRest) {
        state = "rest";
      } else if (completed) {
        state = "done";
      } else if (isToday) {
        state = "active";
      } else if (workout && workout.type === "combo") {
        state = "peak";
      } else {
        state = "pending";
      }

      if (!isRest) workoutCount += 1;
      if (state === "done") completedCount += 1;

      days.push({ week: w, weekday: wd, workout, completed, state });
    }

    weeks.push({ week: w, days, workoutCount, completedCount });
  }

  return {
    weeks,
    todayWeek,
    todayAutoWeek,
    todayWeekday,
    todayDate: date,
    planStartDate: anchor.planStartDate,
    currentWeekOverride: anchor.currentWeekOverride,
  };
}

export async function updateWorkout(
  userId: string,
  workoutId: string,
  patch: Partial<
    Pick<
      Workout,
      | "type"
      | "title"
      | "focus"
      | "durationMin"
      | "intensity"
      | "timeStart"
      | "timeEnd"
      | "videoUrl"
      | "description"
    >
  >,
): Promise<void> {
  await db
    .update(workouts)
    .set(patch)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)));
}

export async function logMealComplete(userId: string, mealId: string, date: string): Promise<void> {
  await db
    .insert(mealLogs)
    .values({ userId, mealId, date })
    .onConflictDoNothing({
      target: [mealLogs.userId, mealLogs.mealId, mealLogs.date],
    });
}

export async function unlogMealComplete(
  userId: string,
  mealId: string,
  date: string,
): Promise<void> {
  await db
    .delete(mealLogs)
    .where(and(eq(mealLogs.userId, userId), eq(mealLogs.mealId, mealId), eq(mealLogs.date, date)));
}

export async function logWorkoutComplete(
  userId: string,
  workoutId: string,
  date: string,
): Promise<void> {
  await db
    .insert(workoutLogs)
    .values({ userId, workoutId, date })
    .onConflictDoNothing({
      target: [workoutLogs.userId, workoutLogs.workoutId, workoutLogs.date],
    });
}

export async function logWater(userId: string, date: string, glasses: number): Promise<void> {
  await db
    .insert(waterLogs)
    .values({ userId, date, glassesCount: glasses })
    .onConflictDoUpdate({
      target: [waterLogs.userId, waterLogs.date],
      set: { glassesCount: glasses },
    });
}

export async function logWeight(userId: string, date: string, kg: number): Promise<void> {
  const value = kg.toString();
  await db
    .insert(weightLogs)
    .values({ userId, date, kg: value })
    .onConflictDoUpdate({
      target: [weightLogs.userId, weightLogs.date],
      set: { kg: value },
    });
}

export async function getWeightHistory(
  userId: string,
  range: { from?: string; to?: string } = {},
): Promise<WeightPoint[]> {
  const filters = [eq(weightLogs.userId, userId)];
  if (range.from) filters.push(gte(weightLogs.date, range.from));
  if (range.to) filters.push(lte(weightLogs.date, range.to));

  const rows = await db
    .select({ date: weightLogs.date, kg: weightLogs.kg })
    .from(weightLogs)
    .where(and(...filters))
    .orderBy(asc(weightLogs.date));

  return rows.map((r) => ({ date: r.date, kg: Number(r.kg) }));
}

export async function logMeasurement(
  userId: string,
  date: string,
  data: {
    waistCm?: number | null | undefined;
    armCm?: number | null | undefined;
    thighCm?: number | null | undefined;
  },
): Promise<void> {
  const toValue = (v: number | null | undefined) => (v != null ? v.toString() : null);

  await db
    .insert(measurementLogs)
    .values({
      userId,
      date,
      waistCm: toValue(data.waistCm),
      armCm: toValue(data.armCm),
      thighCm: toValue(data.thighCm),
    })
    .onConflictDoUpdate({
      target: [measurementLogs.userId, measurementLogs.date],
      set: {
        waistCm: toValue(data.waistCm),
        armCm: toValue(data.armCm),
        thighCm: toValue(data.thighCm),
      },
    });
}

export async function getMeasurementHistory(
  userId: string,
  range: { from?: string; to?: string } = {},
): Promise<MeasurementPoint[]> {
  const filters = [eq(measurementLogs.userId, userId)];
  if (range.from) filters.push(gte(measurementLogs.date, range.from));
  if (range.to) filters.push(lte(measurementLogs.date, range.to));

  const rows = await db
    .select({
      date: measurementLogs.date,
      waistCm: measurementLogs.waistCm,
      armCm: measurementLogs.armCm,
      thighCm: measurementLogs.thighCm,
    })
    .from(measurementLogs)
    .where(and(...filters))
    .orderBy(asc(measurementLogs.date));

  return rows.map((r) => ({
    date: r.date,
    waistCm: r.waistCm != null ? Number(r.waistCm) : null,
    armCm: r.armCm != null ? Number(r.armCm) : null,
    thighCm: r.thighCm != null ? Number(r.thighCm) : null,
  }));
}

export async function getTargetWeightKg(userId: string): Promise<number | null> {
  const rows = await db
    .select({ targetWeightKg: userSettings.targetWeightKg })
    .from(userSettings)
    .where(eq(userSettings.userId, userId))
    .limit(1);
  const val = rows[0]?.targetWeightKg;
  return val != null ? Number(val) : null;
}

export async function updateMeal(
  userId: string,
  mealId: string,
  data: {
    time: string;
    name: string;
    summary: string;
    dayType: "workout" | "rest";
    calories: number;
    pG: number;
    nG: number;
    fG: number;
    ingredients: { name: string; amount: string }[];
    swaps: { name: string }[];
  },
): Promise<void> {
  const existing = await db
    .select({ id: meals.id })
    .from(meals)
    .where(and(eq(meals.id, mealId), eq(meals.userId, userId)))
    .limit(1);
  if (existing.length === 0) throw new Error("meal not found");

  await db.transaction(async (tx) => {
    await tx
      .update(meals)
      .set({
        time: data.time,
        name: data.name,
        summary: data.summary,
        dayType: data.dayType,
        calories: data.calories,
        pG: data.pG,
        nG: data.nG,
        fG: data.fG,
      })
      .where(eq(meals.id, mealId));

    await tx.delete(mealIngredients).where(eq(mealIngredients.mealId, mealId));
    if (data.ingredients.length > 0) {
      await tx.insert(mealIngredients).values(
        data.ingredients.map((ing, i) => ({
          mealId,
          name: ing.name,
          amount: ing.amount,
          sortOrder: i,
        })),
      );
    }

    await tx.delete(mealSwaps).where(eq(mealSwaps.mealId, mealId));
    if (data.swaps.length > 0) {
      await tx.insert(mealSwaps).values(
        data.swaps.map((s, i) => ({
          mealId,
          name: s.name,
          sortOrder: i,
        })),
      );
    }
  });
}

export async function reorderMeals(userId: string, orderedIds: string[]): Promise<void> {
  await Promise.all(
    orderedIds.map((id, index) =>
      db
        .update(meals)
        .set({ sortOrder: index })
        .where(and(eq(meals.id, id), eq(meals.userId, userId))),
    ),
  );
}

export async function getAdherenceStats(
  userId: string,
  fromDate: string,
  toDate: string,
): Promise<AdherenceStats> {
  const anchor = await getUserPlanAnchor(userId);

  const [
    planWorkouts,
    mealCountRows,
    mealLogsAgg,
    workoutLogsAgg,
    settingsRows,
    waterLogRows,
    mealActivityRows,
    workoutActivityRows,
    weightRows,
  ] = await Promise.all([
    db
      .select({ week: workouts.week, weekday: workouts.weekday, type: workouts.type })
      .from(workouts)
      .where(eq(workouts.userId, userId)),
    db
      .select({ dayType: meals.dayType, count: sql<number>`count(*)::int` })
      .from(meals)
      .where(eq(meals.userId, userId))
      .groupBy(meals.dayType),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(mealLogs)
      .where(
        and(eq(mealLogs.userId, userId), gte(mealLogs.date, fromDate), lte(mealLogs.date, toDate)),
      ),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(workoutLogs)
      .where(
        and(
          eq(workoutLogs.userId, userId),
          gte(workoutLogs.date, fromDate),
          lte(workoutLogs.date, toDate),
        ),
      ),
    db
      .select({ waterTargetL: userSettings.waterTargetL })
      .from(userSettings)
      .where(eq(userSettings.userId, userId))
      .limit(1),
    db
      .select({ date: waterLogs.date, glassesCount: waterLogs.glassesCount })
      .from(waterLogs)
      .where(
        and(
          eq(waterLogs.userId, userId),
          gte(waterLogs.date, fromDate),
          lte(waterLogs.date, toDate),
        ),
      ),
    db
      .select({ date: mealLogs.date })
      .from(mealLogs)
      .where(and(eq(mealLogs.userId, userId), lte(mealLogs.date, toDate)))
      .groupBy(mealLogs.date),
    db
      .select({ date: workoutLogs.date })
      .from(workoutLogs)
      .where(and(eq(workoutLogs.userId, userId), lte(workoutLogs.date, toDate)))
      .groupBy(workoutLogs.date),
    db
      .select({ date: weightLogs.date, kg: weightLogs.kg })
      .from(weightLogs)
      .where(eq(weightLogs.userId, userId))
      .orderBy(asc(weightLogs.date)),
  ]);

  const workoutTypeByKey = new Map<string, DayType>();
  for (const w of planWorkouts) {
    workoutTypeByKey.set(`${w.week}:${w.weekday}`, dayTypeFromWorkout(w));
  }

  const mealCountByType: Record<DayType, number> = { workout: 0, rest: 0 };
  for (const row of mealCountRows) {
    mealCountByType[row.dayType] = Number(row.count);
  }

  let mealsTotal = 0;
  let workoutsTotal = 0;
  const start = parseDateUTC(fromDate).getTime();
  const end = parseDateUTC(toDate).getTime();
  for (let t = start; t <= end; t += MS_PER_DAY) {
    const d = formatDateUTC(new Date(t));
    const { week, weekday } = resolveWeekAndWeekday(
      anchor.planStartDate,
      anchor.currentWeekOverride,
      d,
    );
    const type = workoutTypeByKey.get(`${week}:${weekday}`) ?? "rest";
    mealsTotal += mealCountByType[type];
    if (type === "workout") workoutsTotal += 1;
  }

  const mealsCompleted = Number(mealLogsAgg[0]?.count ?? 0);
  const workoutsCompleted = Number(workoutLogsAgg[0]?.count ?? 0);

  const waterTargetL = Number(settingsRows[0]?.waterTargetL ?? 2);
  const waterTargetGlasses = Math.ceil(waterTargetL / 0.25);
  const totalDays = daysBetween(fromDate, toDate) + 1;
  const waterDays = waterLogRows.filter((r) => r.glassesCount >= waterTargetGlasses).length;

  const activityDates = new Set([
    ...mealActivityRows.map((r) => r.date),
    ...workoutActivityRows.map((r) => r.date),
  ]);
  let streak = 0;
  let cursor = parseDateUTC(toDate).getTime();
  while (activityDates.has(formatDateUTC(new Date(cursor)))) {
    streak++;
    cursor -= MS_PER_DAY;
  }

  const firstWeight = weightRows[0];
  const lastWeight = weightRows[weightRows.length - 1];
  const weightDeltaKg =
    weightRows.length >= 2 && firstWeight && lastWeight
      ? Number(lastWeight.kg) - Number(firstWeight.kg)
      : null;

  return {
    meals: {
      completed: mealsCompleted,
      total: mealsTotal,
      pct: mealsTotal > 0 ? Math.round((mealsCompleted / mealsTotal) * 100) : 0,
    },
    workouts: {
      completed: workoutsCompleted,
      total: workoutsTotal,
      pct: workoutsTotal > 0 ? Math.round((workoutsCompleted / workoutsTotal) * 100) : 0,
    },
    water: {
      days: waterDays,
      total: totalDays,
      pct: totalDays > 0 ? Math.round((waterDays / totalDays) * 100) : 0,
    },
    streak,
    weightDeltaKg,
  };
}

export async function setWeekOverride(userId: string, week: 1 | 2 | 3 | 4 | null): Promise<void> {
  await db
    .update(userSettings)
    .set({ currentWeekOverride: week })
    .where(eq(userSettings.userId, userId));
}

export async function getWeekModeSetting(
  userId: string,
  date: string,
): Promise<{ currentWeekOverride: number | null; todayAutoWeek: number }> {
  const anchor = await getUserPlanAnchor(userId);
  const { week: todayAutoWeek } = resolveWeekAndWeekday(anchor.planStartDate, null, date);
  return { currentWeekOverride: anchor.currentWeekOverride, todayAutoWeek };
}
