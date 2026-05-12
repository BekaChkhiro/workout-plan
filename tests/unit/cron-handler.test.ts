import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// ── Hoisted mocks ──────────────────────────────────────────────────────────

const mockDb = vi.hoisted(() => ({
  select: vi.fn(),
  insert: vi.fn(),
  delete: vi.fn(),
}));

const mockSendPush = vi.hoisted(() => vi.fn());

vi.mock("@/db", () => ({ db: mockDb }));
vi.mock("@/lib/push", () => ({ sendPushToUser: mockSendPush }));

// ── Import after mocks ─────────────────────────────────────────────────────

import { POST } from "@/app/api/cron/reminders/route";

// ── Helpers ────────────────────────────────────────────────────────────────

const CRON_SECRET = "test-cron-secret";

function makeRequest(token?: string) {
  const headers = new Headers();
  if (token !== undefined) headers.set("authorization", `Bearer ${token}`);
  return new Request("https://app/api/cron/reminders", { method: "POST", headers });
}

type UserRow = {
  id: string;
  timezone: string;
  notifMeals: boolean;
  notifWorkouts: boolean;
  notifWater: boolean;
  notifWeight: boolean;
  waterTargetL: string;
  planStartDate: string;
  currentWeekOverride: number | null;
};

function makeUser(overrides: Partial<UserRow> = {}): UserRow {
  return {
    id: "user-1",
    timezone: "UTC",
    notifMeals: false,
    notifWorkouts: false,
    notifWater: false,
    notifWeight: false,
    waterTargetL: "2",
    planStartDate: "2026-01-01",
    currentWeekOverride: null,
    ...overrides,
  };
}

// Drizzle chain builder helpers — each returns a fresh thenable+limited mock
function limitChain(data: unknown[]) {
  return { limit: vi.fn().mockResolvedValue(data) };
}

function directChain(data: unknown[]) {
  return Promise.resolve(data);
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe("POST /api/cron/reminders", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    // Default: 08:00 UTC on a Monday (2026-01-05)
    vi.setSystemTime(new Date("2026-01-05T08:00:00Z"));
    process.env.CRON_SECRET = CRON_SECRET;

    mockSendPush.mockResolvedValue(undefined);
    mockDb.insert.mockReturnValue({ values: vi.fn().mockResolvedValue(undefined) });
    mockDb.delete.mockReturnValue({ where: vi.fn().mockResolvedValue(undefined) });
  });

  afterEach(() => {
    vi.useRealTimers();
    delete process.env.CRON_SECRET;
  });

  // ── Auth ────────────────────────────────────────────────────────────────

  describe("auth", () => {
    it("returns 500 when CRON_SECRET is not configured", async () => {
      delete process.env.CRON_SECRET;
      const res = await POST(makeRequest(CRON_SECRET));
      expect(res.status).toBe(500);
      const body = await res.json();
      expect(body.error).toBe("misconfigured");
    });

    it("returns 401 when authorization header is absent", async () => {
      const req = new Request("https://app/api/cron/reminders", { method: "POST" });
      const res = await POST(req);
      expect(res.status).toBe(401);
      const body = await res.json();
      expect(body.error).toBe("unauthorized");
    });

    it("returns 401 for an incorrect bearer token", async () => {
      const res = await POST(makeRequest("wrong-secret"));
      expect(res.status).toBe(401);
    });

    it("returns 200 for the correct bearer token", async () => {
      // No users → no work to do, but auth passes
      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({ innerJoin: vi.fn().mockResolvedValue([]) }),
      });
      const res = await POST(makeRequest(CRON_SECRET));
      expect(res.status).toBe(200);
    });
  });

  // ── Meal notifications ───────────────────────────────────────────────────

  describe("meal notifications", () => {
    it("sends a meal notification when the meal time falls in the current 5-min window", async () => {
      // now = 08:00 UTC, window = [480, 485). Meal at 08:02 → mealMinutes = 482 ✓
      const user = makeUser({ notifMeals: true });
      const meal = { id: "m1", name: "საუზმე", summary: "კვერცხი", calories: 350, time: "08:02" };

      mockDb.select
        .mockReturnValueOnce({
          from: vi.fn().mockReturnValue({ innerJoin: vi.fn().mockResolvedValue([user]) }),
        })
        .mockReturnValueOnce({
          from: vi.fn().mockReturnValue({ where: vi.fn().mockReturnValue(directChain([meal])) }),
        })
        .mockReturnValueOnce({
          from: vi.fn().mockReturnValue({ where: vi.fn().mockReturnValue(limitChain([])) }),
        });

      const res = await POST(makeRequest(CRON_SECRET));
      expect(res.status).toBe(200);
      expect(mockSendPush).toHaveBeenCalledOnce();
      expect(mockSendPush).toHaveBeenCalledWith(
        "user-1",
        expect.objectContaining({ title: "🍳 საუზმე" }),
      );

      const body = await res.json();
      expect(body.mealsSent).toBe(1);
    });

    it("skips a meal that is outside the 5-min window", async () => {
      const user = makeUser({ notifMeals: true });
      // now = 08:00, windowEnd = 08:05. Meal at 08:10 → outside window.
      const meal = { id: "m1", name: "სადილი", summary: "...", calories: 0, time: "08:10" };

      mockDb.select
        .mockReturnValueOnce({
          from: vi.fn().mockReturnValue({ innerJoin: vi.fn().mockResolvedValue([user]) }),
        })
        .mockReturnValueOnce({
          from: vi.fn().mockReturnValue({ where: vi.fn().mockReturnValue(directChain([meal])) }),
        });

      await POST(makeRequest(CRON_SECRET));
      expect(mockSendPush).not.toHaveBeenCalled();
    });

    it("skips a meal that has already been logged in notificationLog", async () => {
      const user = makeUser({ notifMeals: true });
      const meal = { id: "m1", name: "საუზმე", summary: "...", calories: 0, time: "08:01" };

      mockDb.select
        .mockReturnValueOnce({
          from: vi.fn().mockReturnValue({ innerJoin: vi.fn().mockResolvedValue([user]) }),
        })
        .mockReturnValueOnce({
          from: vi.fn().mockReturnValue({ where: vi.fn().mockReturnValue(directChain([meal])) }),
        })
        .mockReturnValueOnce({
          // notificationLog already has an entry
          from: vi
            .fn()
            .mockReturnValue({ where: vi.fn().mockReturnValue(limitChain([{ id: "log-1" }])) }),
        });

      await POST(makeRequest(CRON_SECRET));
      expect(mockSendPush).not.toHaveBeenCalled();
    });

    it("skips meal notifications when notifMeals is false", async () => {
      const user = makeUser({ notifMeals: false });

      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({ innerJoin: vi.fn().mockResolvedValue([user]) }),
      });

      await POST(makeRequest(CRON_SECRET));
      expect(mockSendPush).not.toHaveBeenCalled();
    });

    it("builds the correct Georgian meal notification payload", async () => {
      const user = makeUser({ notifMeals: true });
      const meal = { id: "m1", name: "საუზმე", summary: "კვერცხი", calories: 400, time: "08:01" };

      mockDb.select
        .mockReturnValueOnce({
          from: vi.fn().mockReturnValue({ innerJoin: vi.fn().mockResolvedValue([user]) }),
        })
        .mockReturnValueOnce({
          from: vi.fn().mockReturnValue({ where: vi.fn().mockReturnValue(directChain([meal])) }),
        })
        .mockReturnValueOnce({
          from: vi.fn().mockReturnValue({ where: vi.fn().mockReturnValue(limitChain([])) }),
        });

      await POST(makeRequest(CRON_SECRET));

      expect(mockSendPush).toHaveBeenCalledWith(
        "user-1",
        expect.objectContaining({
          title: "🍳 საუზმე",
          body: "კვერცხი (400 კკალ)",
          tag: "meal-m1",
        }),
      );
    });
  });

  // ── Water notifications ──────────────────────────────────────────────────

  describe("water notifications", () => {
    it("sends a water notification at a reminder hour when target not yet met", async () => {
      // now = 08:00 UTC, 08 is in WATER_REMINDER_HOURS
      const user = makeUser({ notifWater: true, waterTargetL: "2" }); // 2L / 0.25 = 8 glasses

      mockDb.select
        .mockReturnValueOnce({
          from: vi.fn().mockReturnValue({ innerJoin: vi.fn().mockResolvedValue([user]) }),
        })
        // waterLogs check → 0 glasses logged
        .mockReturnValueOnce({
          from: vi.fn().mockReturnValue({ where: vi.fn().mockReturnValue(limitChain([])) }),
        })
        // notificationLog check → not sent yet
        .mockReturnValueOnce({
          from: vi.fn().mockReturnValue({ where: vi.fn().mockReturnValue(limitChain([])) }),
        });

      const res = await POST(makeRequest(CRON_SECRET));
      expect(mockSendPush).toHaveBeenCalledOnce();
      expect(mockSendPush).toHaveBeenCalledWith(
        "user-1",
        expect.objectContaining({ title: "💧 წყლის დროა!" }),
      );
      const body = await res.json();
      expect(body.waterSent).toBe(1);
    });

    it("skips water notification when daily target is already met", async () => {
      const user = makeUser({ notifWater: true, waterTargetL: "0.5" }); // 0.5L → 2 glasses target

      mockDb.select
        .mockReturnValueOnce({
          from: vi.fn().mockReturnValue({ innerJoin: vi.fn().mockResolvedValue([user]) }),
        })
        // waterLogs → 2 glasses already logged (target met)
        .mockReturnValueOnce({
          from: vi
            .fn()
            .mockReturnValue({ where: vi.fn().mockReturnValue(limitChain([{ glassesCount: 2 }])) }),
        });

      await POST(makeRequest(CRON_SECRET));
      expect(mockSendPush).not.toHaveBeenCalled();
    });

    it("skips water notifications when notifWater is false", async () => {
      const user = makeUser({ notifWater: false });

      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({ innerJoin: vi.fn().mockResolvedValue([user]) }),
      });

      await POST(makeRequest(CRON_SECRET));
      expect(mockSendPush).not.toHaveBeenCalled();
    });

    it("water notification body includes glasses count and target", async () => {
      const user = makeUser({ notifWater: true, waterTargetL: "2" }); // 8 glasses

      mockDb.select
        .mockReturnValueOnce({
          from: vi.fn().mockReturnValue({ innerJoin: vi.fn().mockResolvedValue([user]) }),
        })
        .mockReturnValueOnce({
          from: vi
            .fn()
            .mockReturnValue({ where: vi.fn().mockReturnValue(limitChain([{ glassesCount: 3 }])) }),
        })
        .mockReturnValueOnce({
          from: vi.fn().mockReturnValue({ where: vi.fn().mockReturnValue(limitChain([])) }),
        });

      await POST(makeRequest(CRON_SECRET));
      expect(mockSendPush).toHaveBeenCalledWith(
        "user-1",
        expect.objectContaining({ body: "3/8 ჭიქა." }),
      );
    });
  });

  // ── Weight notifications ─────────────────────────────────────────────────

  describe("weight notifications", () => {
    it("sends a weight notification at 08:00 when not yet logged today", async () => {
      // now = 08:00 UTC, WEIGHT_REMINDER_HOUR = 8 → matches window
      const user = makeUser({ notifWeight: true });

      mockDb.select
        .mockReturnValueOnce({
          from: vi.fn().mockReturnValue({ innerJoin: vi.fn().mockResolvedValue([user]) }),
        })
        // weightLogs → nothing logged today
        .mockReturnValueOnce({
          from: vi.fn().mockReturnValue({ where: vi.fn().mockReturnValue(limitChain([])) }),
        })
        // notificationLog → not sent yet
        .mockReturnValueOnce({
          from: vi.fn().mockReturnValue({ where: vi.fn().mockReturnValue(limitChain([])) }),
        });

      const res = await POST(makeRequest(CRON_SECRET));
      expect(mockSendPush).toHaveBeenCalledWith(
        "user-1",
        expect.objectContaining({ title: "⚖️ წონის ჩაწერა", tag: "weight" }),
      );
      const body = await res.json();
      expect(body.weightSent).toBe(1);
    });

    it("skips weight notification when weight already logged today", async () => {
      const user = makeUser({ notifWeight: true });

      mockDb.select
        .mockReturnValueOnce({
          from: vi.fn().mockReturnValue({ innerJoin: vi.fn().mockResolvedValue([user]) }),
        })
        // weightLogs → already logged
        .mockReturnValueOnce({
          from: vi
            .fn()
            .mockReturnValue({
              where: vi.fn().mockReturnValue(limitChain([{ date: "2026-01-05" }])),
            }),
        });

      await POST(makeRequest(CRON_SECRET));
      expect(mockSendPush).not.toHaveBeenCalled();
    });

    it("skips weight notification when notifWeight is false", async () => {
      const user = makeUser({ notifWeight: false });

      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({ innerJoin: vi.fn().mockResolvedValue([user]) }),
      });

      await POST(makeRequest(CRON_SECRET));
      expect(mockSendPush).not.toHaveBeenCalled();
    });

    it("skips weight notification outside the 08:00 window", async () => {
      vi.setSystemTime(new Date("2026-01-05T09:00:00Z")); // 09:00 UTC
      const user = makeUser({ notifWeight: true });

      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({ innerJoin: vi.fn().mockResolvedValue([user]) }),
      });

      await POST(makeRequest(CRON_SECRET));
      expect(mockSendPush).not.toHaveBeenCalled();
    });
  });

  // ── Response counters ────────────────────────────────────────────────────

  describe("response", () => {
    it("returns ok:true with zero counters when no notifications are due", async () => {
      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({ innerJoin: vi.fn().mockResolvedValue([]) }),
      });

      const res = await POST(makeRequest(CRON_SECRET));
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body).toEqual({
        ok: true,
        mealsSent: 0,
        workoutsSent: 0,
        waterSent: 0,
        weightSent: 0,
      });
    });
  });
});
