import { describe, expect, it } from "vitest";
import {
  adherencePct,
  buildWeightSeries,
  computeStreak,
  countWaterTargetDays,
  filterByRange,
  formatWeightLabel,
  toChartData,
} from "@/lib/progress";

// ─── fixtures ────────────────────────────────────────────────────────────────

// Jan 5 2025 = Sunday  (getUTCDay() = 0)
// Jan 6 2025 = Monday  (getUTCDay() = 1)
// Jan 11 2025 = Saturday (getUTCDay() = 6)
const TODAY = "2025-01-12"; // Sunday — anchor for buildWeightSeries window tests

function makeDays(count: number, start = TODAY): { date: string; kg: number }[] {
  const MS = 86_400_000;
  const base = new Date(`${start}T00:00:00Z`).getTime();
  return Array.from({ length: count }, (_, i) => ({
    date: new Date(base - (count - 1 - i) * MS).toISOString().slice(0, 10),
    kg: 70 + i * 0.1,
  }));
}

// ─── formatWeightLabel ────────────────────────────────────────────────────────

describe("formatWeightLabel", () => {
  describe("week range → Georgian short weekday", () => {
    it.each([
      ["2025-01-05", "კვი"],
      ["2025-01-06", "ორშ"],
      ["2025-01-07", "სამშ"],
      ["2025-01-08", "ოთხ"],
      ["2025-01-09", "ხუთ"],
      ["2025-01-10", "პარ"],
      ["2025-01-11", "შაბ"],
    ])("%s → %s", (date, expected) => {
      expect(formatWeightLabel(date, "week")).toBe(expected);
    });
  });

  describe("month range → day/month numbers", () => {
    it("Jan 1 → 1/1", () => expect(formatWeightLabel("2025-01-01", "month")).toBe("1/1"));
    it("Mar 15 → 15/3", () => expect(formatWeightLabel("2025-03-15", "month")).toBe("15/3"));
    it("Dec 31 → 31/12", () => expect(formatWeightLabel("2025-12-31", "month")).toBe("31/12"));
  });

  describe("all range → Georgian short month", () => {
    it.each([
      ["2025-01-06", "იან"],
      ["2025-03-01", "მარ"],
      ["2025-06-15", "ივნ"],
      ["2025-12-25", "დეკ"],
    ])("%s → %s", (date, expected) => {
      expect(formatWeightLabel(date, "all")).toBe(expected);
    });
  });
});

// ─── filterByRange ────────────────────────────────────────────────────────────

describe("filterByRange", () => {
  it("returns [] for empty input regardless of range", () => {
    expect(filterByRange([], "week")).toEqual([]);
    expect(filterByRange([], "month")).toEqual([]);
    expect(filterByRange([], "all")).toEqual([]);
  });

  it("'all' returns all entries unchanged", () => {
    const entries = makeDays(10);
    expect(filterByRange(entries, "all")).toEqual(entries);
  });

  it("'week' returns last 7 when more than 7 entries exist", () => {
    const entries = makeDays(10);
    expect(filterByRange(entries, "week")).toEqual(entries.slice(-7));
  });

  it("'week' returns all entries when fewer than 7 exist", () => {
    const entries = makeDays(5);
    expect(filterByRange(entries, "week")).toEqual(entries);
  });

  it("'week' returns all 7 when exactly 7 entries exist", () => {
    const entries = makeDays(7);
    expect(filterByRange(entries, "week")).toEqual(entries);
  });

  it("'month' returns last 30 when more than 30 entries exist", () => {
    const entries = makeDays(35);
    expect(filterByRange(entries, "month")).toEqual(entries.slice(-30));
  });

  it("'month' returns all entries when fewer than 30 exist", () => {
    const entries = makeDays(20);
    expect(filterByRange(entries, "month")).toEqual(entries);
  });
});

// ─── toChartData ─────────────────────────────────────────────────────────────

describe("toChartData", () => {
  it("returns [] for empty input", () => {
    expect(toChartData([], "week")).toEqual([]);
  });

  it("maps a single entry with a week label", () => {
    const result = toChartData([{ date: "2025-01-06", kg: 72 }], "week");
    expect(result).toEqual([{ label: "ორშ", kg: 72, date: "2025-01-06" }]);
  });

  it("maps a single entry with a month label", () => {
    const result = toChartData([{ date: "2025-03-15", kg: 71 }], "month");
    expect(result).toEqual([{ label: "15/3", kg: 71, date: "2025-03-15" }]);
  });

  it("maps a single entry with an 'all' label", () => {
    const result = toChartData([{ date: "2025-06-01", kg: 70 }], "all");
    expect(result).toEqual([{ label: "ივნ", kg: 70, date: "2025-06-01" }]);
  });

  it("maps multiple entries preserving kg values", () => {
    const entries = [
      { date: "2025-01-05", kg: 70 },
      { date: "2025-01-06", kg: 71 },
    ];
    const result = toChartData(entries, "week");
    expect(result.map((r) => r.kg)).toEqual([70, 71]);
    expect(result.map((r) => r.date)).toEqual(["2025-01-05", "2025-01-06"]);
  });
});

// ─── buildWeightSeries ───────────────────────────────────────────────────────

describe("buildWeightSeries", () => {
  describe("'all' range", () => {
    it("returns [] for empty entries", () => {
      expect(buildWeightSeries([], "all", TODAY)).toEqual([]);
    });

    it("maps entries to month-labelled points", () => {
      const entries = [
        { date: "2025-01-06", kg: 70 },
        { date: "2025-03-15", kg: 68 },
      ];
      const result = buildWeightSeries(entries, "all", "2025-03-15");
      expect(result).toEqual([
        { label: "იან", kg: 70, date: "2025-01-06" },
        { label: "მარ", kg: 68, date: "2025-03-15" },
      ]);
    });

    it("ignores future-dated entries", () => {
      const entries = [
        { date: "2025-01-06", kg: 70 },
        { date: "2026-01-01", kg: 80 }, // future
      ];
      const result = buildWeightSeries(entries, "all", "2025-03-15");
      expect(result).toHaveLength(1);
      expect(result[0]!.date).toBe("2025-01-06");
    });
  });

  describe("'week' range — window structure", () => {
    it("produces exactly 7 points", () => {
      expect(buildWeightSeries([], "week", TODAY)).toHaveLength(7);
    });

    it("first date is today − 6 days, last date is today", () => {
      const result = buildWeightSeries([], "week", TODAY);
      expect(result[0]!.date).toBe("2025-01-06");
      expect(result[6]!.date).toBe("2025-01-12");
    });

    it("labels match the weekdays in order", () => {
      const result = buildWeightSeries([], "week", TODAY);
      const labels = result.map((p) => p.label);
      expect(labels).toEqual(["ორშ", "სამშ", "ოთხ", "ხუთ", "პარ", "შაბ", "კვი"]);
    });
  });

  describe("'week' range — empty entries", () => {
    it("all points have kg: null in null-gap mode", () => {
      const result = buildWeightSeries([], "week", TODAY, "null");
      expect(result.every((p) => p.kg === null)).toBe(true);
    });

    it("all points have kg: null in carry mode (no value to carry forward)", () => {
      const result = buildWeightSeries([], "week", TODAY, "carry");
      expect(result.every((p) => p.kg === null)).toBe(true);
    });
  });

  describe("'week' range — single entry", () => {
    it("only the matching day has kg in null-gap mode", () => {
      // entry on the last day (today)
      const result = buildWeightSeries([{ date: TODAY, kg: 72 }], "week", TODAY, "null");
      expect(result[6]!.kg).toBe(72);
      expect(result.slice(0, 6).every((p) => p.kg === null)).toBe(true);
    });

    it("carry mode propagates the value from first entry forward", () => {
      // entry on the first day of the window (Jan 6)
      const result = buildWeightSeries([{ date: "2025-01-06", kg: 70 }], "week", TODAY, "carry");
      expect(result.every((p) => p.kg === 70)).toBe(true);
    });

    it("carry mode: days before the single entry are still null", () => {
      // entry on Jan 9 (middle of the window)
      const result = buildWeightSeries([{ date: "2025-01-09", kg: 70 }], "week", TODAY, "carry");
      // Jan 6, 7, 8 → null; Jan 9, 10, 11, 12 → 70
      expect(result[0]!.kg).toBe(null);
      expect(result[1]!.kg).toBe(null);
      expect(result[2]!.kg).toBe(null);
      expect(result[3]!.kg).toBe(70); // Jan 9
      expect(result[4]!.kg).toBe(70); // Jan 10 carry-forward
      expect(result[5]!.kg).toBe(70); // Jan 11 carry-forward
      expect(result[6]!.kg).toBe(70); // Jan 12 carry-forward
    });
  });

  describe("'week' range — gap-filling", () => {
    const sparseEntries = [
      { date: "2025-01-06", kg: 70 }, // Mon
      { date: "2025-01-08", kg: 72 }, // Wed (Jan 7 missing)
      // Thu–Sun missing
    ];

    it("null-gap mode: missing days emit null", () => {
      const result = buildWeightSeries(sparseEntries, "week", TODAY, "null");
      expect(result[0]!.kg).toBe(70); // Jan 6
      expect(result[1]!.kg).toBe(null); // Jan 7 gap
      expect(result[2]!.kg).toBe(72); // Jan 8
      expect(result[3]!.kg).toBe(null); // Jan 9 gap
      expect(result[4]!.kg).toBe(null); // Jan 10 gap
    });

    it("carry mode: missing days repeat the last known value", () => {
      const result = buildWeightSeries(sparseEntries, "week", TODAY, "carry");
      expect(result[0]!.kg).toBe(70); // Jan 6
      expect(result[1]!.kg).toBe(70); // Jan 7 carry-forward
      expect(result[2]!.kg).toBe(72); // Jan 8
      expect(result[3]!.kg).toBe(72); // Jan 9 carry-forward
      expect(result[6]!.kg).toBe(72); // Jan 12 carry-forward
    });
  });

  describe("future-dated entries are ignored in windowed ranges", () => {
    it("week: entry after today is not plotted", () => {
      const entries = [
        { date: TODAY, kg: 70 },
        { date: "2025-01-15", kg: 99 }, // future
      ];
      const result = buildWeightSeries(entries, "week", TODAY, "null");
      expect(result[6]!.kg).toBe(70);
      expect(result.every((p) => p.kg !== 99)).toBe(true);
    });
  });

  describe("week boundary — window spanning two calendar weeks", () => {
    it("correctly covers Mon → Sun across an ISO week boundary", () => {
      // Window: Jan 6 (Mon, week 2) → Jan 12 (Sun, week 3) — spans ISO week boundary
      const result = buildWeightSeries([], "week", TODAY);
      expect(result[0]!.date).toBe("2025-01-06");
      expect(result[6]!.date).toBe("2025-01-12");
    });
  });

  describe("'month' range", () => {
    it("produces exactly 30 points", () => {
      expect(buildWeightSeries([], "month", "2025-01-31")).toHaveLength(30);
    });

    it("first date is today − 29 days", () => {
      const result = buildWeightSeries([], "month", "2025-01-31");
      expect(result[0]!.date).toBe("2025-01-02");
      expect(result[29]!.date).toBe("2025-01-31");
    });

    it("labels use day/month format", () => {
      const result = buildWeightSeries([], "month", "2025-01-31");
      expect(result[0]!.label).toBe("2/1"); // Jan 2
      expect(result[29]!.label).toBe("31/1"); // Jan 31
    });
  });
});

// ─── adherencePct ─────────────────────────────────────────────────────────────

describe("adherencePct", () => {
  it("returns 0 when total is 0 (no division by zero)", () => {
    expect(adherencePct(0, 0)).toBe(0);
  });

  it("returns 0 when completed is 0", () => {
    expect(adherencePct(0, 10)).toBe(0);
  });

  it("returns 100 when fully completed", () => {
    expect(adherencePct(10, 10)).toBe(100);
  });

  it("returns 50 for half completion", () => {
    expect(adherencePct(5, 10)).toBe(50);
  });

  it("rounds correctly — 3/7 → 43", () => {
    expect(adherencePct(3, 7)).toBe(43);
  });

  it("rounds correctly — 2/3 → 67", () => {
    expect(adherencePct(2, 3)).toBe(67);
  });
});

// ─── computeStreak ────────────────────────────────────────────────────────────

describe("computeStreak", () => {
  it("returns 0 for empty activity", () => {
    expect(computeStreak([], "2025-01-10")).toBe(0);
  });

  it("returns 0 when toDate is not in activityDates", () => {
    expect(computeStreak(["2025-01-09"], "2025-01-10")).toBe(0);
  });

  it("returns 1 for a single day matching toDate", () => {
    expect(computeStreak(["2025-01-10"], "2025-01-10")).toBe(1);
  });

  it("counts consecutive days backward from toDate", () => {
    const dates = ["2025-01-08", "2025-01-09", "2025-01-10"];
    expect(computeStreak(dates, "2025-01-10")).toBe(3);
  });

  it("stops at a gap — only toDate counts when the previous day is absent", () => {
    const dates = ["2025-01-08", "2025-01-10"]; // Jan 9 missing
    expect(computeStreak(dates, "2025-01-10")).toBe(1);
  });

  it("extra earlier dates do not extend a broken streak", () => {
    const dates = ["2025-01-01", "2025-01-08", "2025-01-09", "2025-01-10"];
    expect(computeStreak(dates, "2025-01-10")).toBe(3);
  });

  it("streak of 0 when only a past block exists and toDate is missing", () => {
    const dates = ["2025-01-01", "2025-01-02", "2025-01-03"];
    expect(computeStreak(dates, "2025-01-10")).toBe(0);
  });
});

// ─── countWaterTargetDays ─────────────────────────────────────────────────────

describe("countWaterTargetDays", () => {
  it("returns 0 for empty logs", () => {
    expect(countWaterTargetDays([], 2)).toBe(0);
  });

  it("waterTargetL=2 → target=8 glasses; counts days at or above 8", () => {
    const logs = [
      { date: "2025-01-01", glassesCount: 7 }, // below
      { date: "2025-01-02", glassesCount: 8 }, // exactly at target ✓
      { date: "2025-01-03", glassesCount: 9 }, // above ✓
    ];
    expect(countWaterTargetDays(logs, 2)).toBe(2);
  });

  it("waterTargetL=1.5 → target=ceil(6)=6 glasses", () => {
    const logs = [
      { date: "2025-01-01", glassesCount: 5 }, // below
      { date: "2025-01-02", glassesCount: 6 }, // exactly at target ✓
    ];
    expect(countWaterTargetDays(logs, 1.5)).toBe(1);
  });

  it("waterTargetL=0.25 → target=1 glass; 0 glasses does not count", () => {
    expect(countWaterTargetDays([{ date: "a", glassesCount: 0 }], 0.25)).toBe(0);
    expect(countWaterTargetDays([{ date: "a", glassesCount: 1 }], 0.25)).toBe(1);
  });

  it("all logs above target → full count", () => {
    const logs = [
      { date: "a", glassesCount: 10 },
      { date: "b", glassesCount: 10 },
      { date: "c", glassesCount: 10 },
    ];
    expect(countWaterTargetDays(logs, 2)).toBe(3);
  });

  it("no logs meet target → 0", () => {
    const logs = [
      { date: "a", glassesCount: 1 },
      { date: "b", glassesCount: 2 },
    ];
    expect(countWaterTargetDays(logs, 2)).toBe(0); // need 8 glasses, have at most 2
  });
});
