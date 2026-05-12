import { beforeEach, describe, expect, it, vi } from "vitest";

// ── Hoisted mocks ──────────────────────────────────────────────────────────

const mockWebpush = vi.hoisted(() => {
  class WebPushError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
      super(message);
      this.name = "WebPushError";
      this.statusCode = statusCode;
    }
  }
  return {
    setVapidDetails: vi.fn(),
    sendNotification: vi.fn(),
    WebPushError,
  };
});

const mockDb = vi.hoisted(() => ({
  select: vi.fn(),
  delete: vi.fn(),
}));

vi.mock("web-push", () => ({ default: mockWebpush }));
vi.mock("@/db", () => ({ db: mockDb }));
vi.mock("@/lib/vapid", () => ({
  getVapidKeys: vi.fn(() => ({ publicKey: "test-pub", privateKey: "test-priv" })),
}));

// ── Import after mocks ─────────────────────────────────────────────────────

import { sendPushToUser } from "@/lib/push";

// ── Helpers ────────────────────────────────────────────────────────────────

const payload = { title: "Test", body: "Body text" };

function makeSub(overrides?: Partial<{ endpoint: string; p256dh: string; auth: string }>) {
  return {
    endpoint: "https://push.example.com/sub1",
    p256dh: "p256dh-key",
    auth: "auth-secret",
    ...overrides,
  };
}

function stubSelect(subs: ReturnType<typeof makeSub>[]) {
  mockDb.select.mockReturnValue({
    from: vi.fn().mockReturnValue({
      where: vi.fn().mockResolvedValue(subs),
    }),
  });
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe("sendPushToUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDb.delete.mockReturnValue({ where: vi.fn().mockResolvedValue(undefined) });
  });

  it("initialises VAPID details on every call", async () => {
    stubSelect([]);
    await sendPushToUser("user-1", payload);
    expect(mockWebpush.setVapidDetails).toHaveBeenCalledWith(
      "mailto:webinfinity12@gmail.com",
      "test-pub",
      "test-priv",
    );
  });

  it("calls sendNotification with the correct endpoint, keys, and JSON payload", async () => {
    const sub = makeSub();
    stubSelect([sub]);
    mockWebpush.sendNotification.mockResolvedValue(undefined);

    await sendPushToUser("user-1", payload);

    expect(mockWebpush.sendNotification).toHaveBeenCalledOnce();
    expect(mockWebpush.sendNotification).toHaveBeenCalledWith(
      { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
      JSON.stringify(payload),
    );
  });

  it("sends to every subscription the user has", async () => {
    const subs = [makeSub({ endpoint: "https://e1" }), makeSub({ endpoint: "https://e2" })];
    stubSelect(subs);
    mockWebpush.sendNotification.mockResolvedValue(undefined);

    await sendPushToUser("user-1", payload);

    expect(mockWebpush.sendNotification).toHaveBeenCalledTimes(2);
  });

  it("sends nothing when the user has no subscriptions", async () => {
    stubSelect([]);

    await sendPushToUser("user-1", payload);

    expect(mockWebpush.sendNotification).not.toHaveBeenCalled();
  });

  it("deletes the subscription when sendNotification returns 410 Gone", async () => {
    const sub = makeSub();
    stubSelect([sub]);
    mockWebpush.sendNotification.mockRejectedValueOnce(new mockWebpush.WebPushError("Gone", 410));
    const mockDeleteWhere = vi.fn().mockResolvedValue(undefined);
    mockDb.delete.mockReturnValue({ where: mockDeleteWhere });

    await sendPushToUser("user-1", payload);

    expect(mockDb.delete).toHaveBeenCalledOnce();
    expect(mockDeleteWhere).toHaveBeenCalledOnce();
  });

  it("does not delete the subscription for non-410 errors", async () => {
    const sub = makeSub();
    stubSelect([sub]);
    mockWebpush.sendNotification.mockRejectedValueOnce(
      new mockWebpush.WebPushError("Service Unavailable", 503),
    );

    await sendPushToUser("user-1", payload);

    expect(mockDb.delete).not.toHaveBeenCalled();
  });

  it("does not delete for generic (non-WebPushError) errors", async () => {
    stubSelect([makeSub()]);
    mockWebpush.sendNotification.mockRejectedValueOnce(new Error("network error"));

    await sendPushToUser("user-1", payload);

    expect(mockDb.delete).not.toHaveBeenCalled();
  });

  it("continues sending to remaining subs after one 410 failure", async () => {
    const subs = [makeSub({ endpoint: "https://dead" }), makeSub({ endpoint: "https://alive" })];
    stubSelect(subs);
    mockWebpush.sendNotification
      .mockRejectedValueOnce(new mockWebpush.WebPushError("Gone", 410))
      .mockResolvedValueOnce(undefined);

    await sendPushToUser("user-1", payload);

    expect(mockWebpush.sendNotification).toHaveBeenCalledTimes(2);
    expect(mockDb.delete).toHaveBeenCalledOnce();
  });
});
