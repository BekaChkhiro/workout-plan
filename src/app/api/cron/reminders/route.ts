import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import {
  meals,
  notificationLog,
  userSettings,
  users,
  waterLogs,
  weightLogs,
  workouts,
} from "@/db/schema";
import { getCurrentMinutesInTimeZone, getTodayInTimeZone, parseTimeToMinutes } from "@/lib/date";
import { getCurrentWeek, isAuthorized, localTimeAsUtc } from "@/lib/cron-helpers";
import {
  buildMealNotification,
  buildWaterNotification,
  buildWeightNotification,
  buildWorkoutNotification,
} from "@/lib/notification-content";
import { sendPushToUser } from "@/lib/push";

const WATER_REMINDER_HOURS = [8, 10, 12, 14, 16, 18, 20];
const WEIGHT_REMINDER_HOUR = 8;

// JS weekday (0=Sun) → workout weekday (0=Mon, 6=Sun)
const JS_TO_WORKOUT_WEEKDAY: Record<string, number> = {
  Sun: 6,
  Mon: 0,
  Tue: 1,
  Wed: 2,
  Thu: 3,
  Fri: 4,
  Sat: 5,
};

export async function POST(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "misconfigured" }, { status: 500 });
  }

  const authHeader = req.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!isAuthorized(token, secret)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const now = new Date();
  let mealsSent = 0;
  let workoutsSent = 0;
  let waterSent = 0;
  let weightSent = 0;

  const allUsers = await db
    .select({
      id: users.id,
      timezone: users.timezone,
      notifMeals: userSettings.notifMeals,
      notifWorkouts: userSettings.notifWorkouts,
      notifWater: userSettings.notifWater,
      notifWeight: userSettings.notifWeight,
      waterTargetL: userSettings.waterTargetL,
      planStartDate: userSettings.planStartDate,
      currentWeekOverride: userSettings.currentWeekOverride,
    })
    .from(users)
    .innerJoin(userSettings, eq(users.id, userSettings.userId));

  for (const user of allUsers) {
    try {
      const tz = user.timezone;
      const nowMinutes = getCurrentMinutesInTimeZone(tz, now);
      const windowEnd = nowMinutes + 5;
      const todayStr = getTodayInTimeZone(tz, now);
      const weekdayShort = new Intl.DateTimeFormat("en-US", {
        timeZone: tz,
        weekday: "short",
      }).format(now);
      const workoutWeekday = JS_TO_WORKOUT_WEEKDAY[weekdayShort] ?? 0;

      if (user.notifMeals) {
        const userMeals = await db.select().from(meals).where(eq(meals.userId, user.id));

        for (const meal of userMeals) {
          const mealMinutes = parseTimeToMinutes(meal.time);
          if (mealMinutes == null) continue;
          if (mealMinutes < nowMinutes || mealMinutes >= windowEnd) continue;

          const targetAt = localTimeAsUtc(todayStr, meal.time, tz);

          const [existing] = await db
            .select({ id: notificationLog.id })
            .from(notificationLog)
            .where(
              and(
                eq(notificationLog.userId, user.id),
                eq(notificationLog.kind, "meal"),
                eq(notificationLog.targetAt, targetAt),
              ),
            )
            .limit(1);
          if (existing) continue;

          await sendPushToUser(user.id, buildMealNotification(meal));

          await db.insert(notificationLog).values({
            userId: user.id,
            kind: "meal",
            targetAt,
          });

          mealsSent++;
        }
      }

      if (user.notifWorkouts) {
        const currentWeek = getCurrentWeek(user.planStartDate, user.currentWeekOverride, todayStr);

        const userWorkouts = await db
          .select()
          .from(workouts)
          .where(
            and(
              eq(workouts.userId, user.id),
              eq(workouts.week, currentWeek),
              eq(workouts.weekday, workoutWeekday),
            ),
          );

        for (const workout of userWorkouts) {
          if (!workout.timeStart) continue;
          const wMinutes = parseTimeToMinutes(workout.timeStart);
          if (wMinutes == null) continue;
          if (wMinutes < nowMinutes || wMinutes >= windowEnd) continue;

          const targetAt = localTimeAsUtc(todayStr, workout.timeStart, tz);

          const [existing] = await db
            .select({ id: notificationLog.id })
            .from(notificationLog)
            .where(
              and(
                eq(notificationLog.userId, user.id),
                eq(notificationLog.kind, "workout"),
                eq(notificationLog.targetAt, targetAt),
              ),
            )
            .limit(1);
          if (existing) continue;

          await sendPushToUser(user.id, buildWorkoutNotification(workout));

          await db.insert(notificationLog).values({
            userId: user.id,
            kind: "workout",
            targetAt,
          });

          workoutsSent++;
        }
      }

      if (user.notifWater) {
        const targetGlasses = Math.round(parseFloat(user.waterTargetL) / 0.25);

        for (const hour of WATER_REMINDER_HOURS) {
          const reminderMinutes = hour * 60;
          if (reminderMinutes < nowMinutes || reminderMinutes >= windowEnd) continue;

          const [waterLog] = await db
            .select({ glassesCount: waterLogs.glassesCount })
            .from(waterLogs)
            .where(and(eq(waterLogs.userId, user.id), eq(waterLogs.date, todayStr)))
            .limit(1);

          const glassesCount = waterLog?.glassesCount ?? 0;
          if (glassesCount >= targetGlasses) continue;

          const targetAt = localTimeAsUtc(todayStr, `${hour.toString().padStart(2, "0")}:00`, tz);

          const [existing] = await db
            .select({ id: notificationLog.id })
            .from(notificationLog)
            .where(
              and(
                eq(notificationLog.userId, user.id),
                eq(notificationLog.kind, "water"),
                eq(notificationLog.targetAt, targetAt),
              ),
            )
            .limit(1);
          if (existing) continue;

          await sendPushToUser(user.id, buildWaterNotification(glassesCount, targetGlasses));

          await db.insert(notificationLog).values({
            userId: user.id,
            kind: "water",
            targetAt,
          });

          waterSent++;
        }
      }

      if (user.notifWeight) {
        const reminderMinutes = WEIGHT_REMINDER_HOUR * 60;
        if (reminderMinutes >= nowMinutes && reminderMinutes < windowEnd) {
          const [alreadyLogged] = await db
            .select({ date: weightLogs.date })
            .from(weightLogs)
            .where(and(eq(weightLogs.userId, user.id), eq(weightLogs.date, todayStr)))
            .limit(1);

          if (!alreadyLogged) {
            const targetAt = localTimeAsUtc(todayStr, "08:00", tz);

            const [existing] = await db
              .select({ id: notificationLog.id })
              .from(notificationLog)
              .where(
                and(
                  eq(notificationLog.userId, user.id),
                  eq(notificationLog.kind, "weight"),
                  eq(notificationLog.targetAt, targetAt),
                ),
              )
              .limit(1);
            if (!existing) {
              await sendPushToUser(user.id, buildWeightNotification());

              await db.insert(notificationLog).values({
                userId: user.id,
                kind: "weight",
                targetAt,
              });

              weightSent++;
            }
          }
        }
      }
    } catch {
      // Isolate per-user failures so one bad user doesn't block others.
    }
  }

  return NextResponse.json({ ok: true, mealsSent, workoutsSent, waterSent, weightSent });
}
