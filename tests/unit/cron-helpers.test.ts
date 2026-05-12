import { describe, expect, it } from "vitest";

import { getCurrentWeek, isAuthorized, localTimeAsUtc } from "@/lib/cron-helpers";

describe("isAuthorized", () => {
  it("returns true when token matches secret", () => {
    expect(isAuthorized("my-secret", "my-secret")).toBe(true);
  });

  it("returns false when token differs from secret", () => {
    expect(isAuthorized("wrong-token", "my-secret")).toBe(false);
  });

  it("returns false for empty token against non-empty secret", () => {
    expect(isAuthorized("", "my-secret")).toBe(false);
  });

  it("returns true when both are empty strings", () => {
    expect(isAuthorized("", "")).toBe(true);
  });
});

describe("getCurrentWeek", () => {
  it("returns override when currentWeekOverride is set", () => {
    expect(getCurrentWeek("2026-01-01", 3, "2026-01-05")).toBe(3);
  });

  it("returns week 1 on the start date", () => {
    expect(getCurrentWeek("2026-01-01", null, "2026-01-01")).toBe(1);
  });

  it("returns week 1 on day 6 (still within first 7 days)", () => {
    expect(getCurrentWeek("2026-01-01", null, "2026-01-07")).toBe(1);
  });

  it("returns week 2 starting on day 7", () => {
    expect(getCurrentWeek("2026-01-01", null, "2026-01-08")).toBe(2);
  });

  it("returns week 3 starting on day 14", () => {
    expect(getCurrentWeek("2026-01-01", null, "2026-01-15")).toBe(3);
  });

  it("returns week 4 starting on day 21", () => {
    expect(getCurrentWeek("2026-01-01", null, "2026-01-22")).toBe(4);
  });

  it("clamps to week 4 after day 28", () => {
    expect(getCurrentWeek("2026-01-01", null, "2026-02-10")).toBe(4);
  });

  it("clamps to week 1 when today is before plan start", () => {
    expect(getCurrentWeek("2026-02-01", null, "2026-01-01")).toBe(1);
  });
});

describe("localTimeAsUtc", () => {
  it("returns UTC unchanged for UTC timezone", () => {
    const result = localTimeAsUtc("2026-01-15", "08:00", "UTC");
    expect(result.toISOString()).toBe("2026-01-15T08:00:00.000Z");
  });

  it("subtracts positive offset for UTC+4 (Tbilisi)", () => {
    // 08:00 Tbilisi (UTC+4) = 04:00 UTC
    const result = localTimeAsUtc("2026-01-15", "08:00", "Asia/Tbilisi");
    expect(result.toISOString()).toBe("2026-01-15T04:00:00.000Z");
  });

  it("adds offset for UTC-5 (New York, winter)", () => {
    // 08:00 NYC (UTC-5) = 13:00 UTC
    const result = localTimeAsUtc("2026-01-15", "08:00", "America/New_York");
    expect(result.toISOString()).toBe("2026-01-15T13:00:00.000Z");
  });

  it("always sets seconds and milliseconds to zero", () => {
    const result = localTimeAsUtc("2026-06-01", "14:30", "UTC");
    expect(result.getUTCSeconds()).toBe(0);
    expect(result.getUTCMilliseconds()).toBe(0);
  });
});
