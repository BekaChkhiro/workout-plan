const MS_PER_DAY = 86_400_000;

export type Range = "week" | "month" | "all";

export type ChartPoint = { label: string; kg: number | null; date: string };

export const KA_DAYS_SHORT = ["კვი", "ორშ", "სამშ", "ოთხ", "ხუთ", "პარ", "შაბ"] as const;

export const KA_MONTHS_SHORT = [
  "იან",
  "თებ",
  "მარ",
  "აპრ",
  "მაი",
  "ივნ",
  "ივლ",
  "აგვ",
  "სექ",
  "ოქტ",
  "ნოე",
  "დეკ",
] as const;

export function parseDateUTC(d: string): Date {
  return new Date(`${d}T00:00:00Z`);
}

function formatDateUTC(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function formatWeightLabel(date: string, range: Range): string {
  const d = parseDateUTC(date);
  if (range === "week") return KA_DAYS_SHORT[d.getUTCDay()] ?? "";
  if (range === "month") return `${d.getUTCDate()}/${d.getUTCMonth() + 1}`;
  return KA_MONTHS_SHORT[d.getUTCMonth()] ?? "";
}

export function filterByRange(
  entries: { date: string; kg: number }[],
  range: Range,
): { date: string; kg: number }[] {
  if (range === "all" || entries.length === 0) return entries;
  const days = range === "week" ? 7 : 30;
  return entries.slice(-days);
}

export function toChartData(
  entries: { date: string; kg: number }[],
  range: Range,
): { label: string; kg: number; date: string }[] {
  return entries.map((e) => ({
    label: formatWeightLabel(e.date, range),
    kg: e.kg,
    date: e.date,
  }));
}

/**
 * Builds a chart-ready series from sparse weight log entries.
 *
 * - "all": entries mapped as-is with Georgian month labels;
 *   future-dated entries (after `today`) are silently dropped.
 * - "week" / "month": a fixed 7- or 30-day window ending on `today` with one
 *   point per calendar day.  Future entries are silently dropped.
 *
 * gap:
 *   "carry" — missing days repeat the most-recent known kg (continuous line).
 *   "null"  — missing days emit kg: null so the chart can render a visual gap.
 */
export function buildWeightSeries(
  entries: { date: string; kg: number }[],
  range: Range,
  today: string,
  gap: "carry" | "null" = "null",
): ChartPoint[] {
  const todayMs = parseDateUTC(today).getTime();

  if (range === "all") {
    return entries
      .filter((e) => parseDateUTC(e.date).getTime() <= todayMs)
      .map((e) => ({ label: formatWeightLabel(e.date, "all"), kg: e.kg, date: e.date }));
  }

  const days = range === "week" ? 7 : 30;

  const kgByDate = new Map<string, number>();
  for (const e of entries) {
    if (parseDateUTC(e.date).getTime() <= todayMs) {
      kgByDate.set(e.date, e.kg);
    }
  }

  const result: ChartPoint[] = [];
  let lastKg: number | null = null;

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(todayMs - i * MS_PER_DAY);
    const date = formatDateUTC(d);
    const kg = kgByDate.get(date) ?? null;
    if (kg !== null) lastKg = kg;
    result.push({
      label: formatWeightLabel(date, range),
      kg: kg !== null ? kg : gap === "carry" ? lastKg : null,
      date,
    });
  }
  return result;
}

/** Returns completion percentage rounded to the nearest integer; 0 when total = 0. */
export function adherencePct(completed: number, total: number): number {
  return total > 0 ? Math.round((completed / total) * 100) : 0;
}

/**
 * Counts consecutive days up to and including `toDate` (walking backward)
 * where the date appears in `activityDates`.
 * Returns 0 immediately if `toDate` itself is absent.
 */
export function computeStreak(activityDates: string[], toDate: string): number {
  const set = new Set(activityDates);
  let streak = 0;
  let cursor = parseDateUTC(toDate).getTime();
  while (set.has(formatDateUTC(new Date(cursor)))) {
    streak++;
    cursor -= MS_PER_DAY;
  }
  return streak;
}

/**
 * Counts log entries where `glassesCount` meets or exceeds the target derived
 * from `waterTargetL` (each glass = 0.25 L, ceiling division).
 */
export function countWaterTargetDays(
  logs: { date: string; glassesCount: number }[],
  waterTargetL: number,
): number {
  const targetGlasses = Math.ceil(waterTargetL / 0.25);
  return logs.filter((r) => r.glassesCount >= targetGlasses).length;
}
