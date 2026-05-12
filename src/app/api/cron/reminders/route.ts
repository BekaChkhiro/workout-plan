import { createHmac, timingSafeEqual } from "crypto";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { meals, notificationLog, userSettings, users, workouts } from "@/db/schema";
import { getCurrentMinutesInTimeZone, getTodayInTimeZone, parseTimeToMinutes } from "@/lib/date";
import { sendPushToUser } from "@/lib/push";

// Compare two strings in constant time using HMAC digests (equal-length outputs).
function isAuthorized(token: string, secret: string): boolean {
  const key = Buffer.alloc(32);
  const a = createHmac("sha256", key).update(token).digest();
  const b = createHmac("sha256", key).update(secret).digest();
  return timingSafeEqual(a, b);
}

// Convert a local date+time ("YYYY-MM-DD", "HH:MM") in a given IANA timezone to a UTC Date.
function localTimeAsUtc(date: string, time: string, tz: string): Date {
  // Treat the time as UTC initially, then measure the actual local offset at that instant.
  const ref = new Date(`${date}T${time}:00Z`);
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(ref);
  const lh = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
  const lm = Number(parts.find((p) => p.type === "minute")?.value ?? "0");
  const timeParts = time.split(":").map(Number);
  const wh = timeParts[0] ?? 0;
  const wm = timeParts[1] ?? 0;
  const result = new Date(ref.getTime() - (lh * 60 + lm - wh * 60 - wm) * 60_000);
  result.setSeconds(0, 0);
  return result;
}

// Current week (1–4) for a user, honouring any manual override.
function getCurrentWeek(
  planStartDate: string,
  currentWeekOverride: number | null,
  todayStr: string,
): number {
  if (currentWeekOverride != null) return currentWeekOverride;
  const start = new Date(`${planStartDate}T00:00:00Z`);
  const today = new Date(`${todayStr}T00:00:00Z`);
  const days = Math.floor((today.getTime() - start.getTime()) / 86_400_000);
  return Math.min(Math.max(Math.floor(days / 7) + 1, 1), 4);
}

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

  const WATER_HOURS = [9, 11, 13, 15, 17, 19];

  const allUsers = await db
    .select({
      id: users.id,
      timezone: users.timezone,
      notifMeals: userSettings.notifMeals,
      notifWorkouts: userSettings.notifWorkouts,
      notifWater: userSettings.notifWater,
      notifWeight: userSettings.notifWeight,
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

          await sendPushToUser(user.id, {
            title: "🍳 " + meal.name,
            body: meal.summary + (meal.calories ? ` (${meal.calories} კკალ)` : ""),
            tag: `meal-${meal.id}`,
            url: "/",
          });

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

          await sendPushToUser(user.id, {
            title: "💪 " + workout.title,
            body: [
              workout.timeStart,
              workout.durationMin ? `${workout.durationMin} წთ` : null,
              workout.focus,
            ]
              .filter(Boolean)
              .join(" · "),
            tag: `workout-${workout.id}`,
            url: "/",
          });

          await db.insert(notificationLog).values({
            userId: user.id,
            kind: "workout",
            targetAt,
          });

          workoutsSent++;
        }
      }

      if (user.notifWater) {
        for (const hour of WATER_HOURS) {
          const timeStr = `${String(hour).padStart(2, "0")}:00`;
          const waterMinutes = hour * 60;
          if (waterMinutes < nowMinutes || waterMinutes >= windowEnd) continue;

          const targetAt = localTimeAsUtc(todayStr, timeStr, tz);

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

          await sendPushToUser(user.id, {
            title: "💧 წყლის დროა!",
            body: "სვი ერთი ჭიქა წყალი",
            tag: `water-${todayStr}-${hour}`,
            url: "/",
          });

          await db.insert(notificationLog).values({
            userId: user.id,
            kind: "water",
            targetAt,
          });

          waterSent++;
        }
      }

      if (user.notifWeight) {
        const weightMinutes = 8 * 60;
        if (weightMinutes >= nowMinutes && weightMinutes < windowEnd) {
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
            await sendPushToUser(user.id, {
              title: "⚖️ წონის ჩაწერა",
              body: "დილის წონა ჩაიწერე",
              tag: `weight-${todayStr}`,
              url: "/",
            });

            await db.insert(notificationLog).values({
              userId: user.id,
              kind: "weight",
              targetAt,
            });

            weightSent++;
          }
        }
      }
    } catch {
      // Isolate per-user failures so one bad user doesn't block others.
    }
  }

  return NextResponse.json({ ok: true, mealsSent, workoutsSent, waterSent, weightSent });
}
