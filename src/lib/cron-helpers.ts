import { createHmac, timingSafeEqual } from "crypto";

export function isAuthorized(token: string, secret: string): boolean {
  const key = Buffer.alloc(32);
  const a = createHmac("sha256", key).update(token).digest();
  const b = createHmac("sha256", key).update(secret).digest();
  return timingSafeEqual(a, b);
}

export function localTimeAsUtc(date: string, time: string, tz: string): Date {
  const ref = new Date(`${date}T${time}:00Z`);
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(ref);
  const lh = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
  const lm = Number(parts.find((p) => p.type === "minute")?.value ?? "0");
  const [wh = 0, wm = 0] = time.split(":").map(Number);
  const result = new Date(ref.getTime() - (lh * 60 + lm - wh * 60 - wm) * 60_000);
  result.setSeconds(0, 0);
  return result;
}

export function getCurrentWeek(
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
