import { NextResponse } from "next/server";

import { getOwnerUserId } from "@/lib/auth";
import {
  buildMealNotification,
  buildWaterNotification,
  buildWeightNotification,
  buildWorkoutNotification,
} from "@/lib/notification-content";
import { sendPushToUser } from "@/lib/push";

const PAYLOADS = {
  meal: buildMealNotification({
    id: "test",
    name: "კვერცხის ომლეტი",
    summary: "ბოსტნეული",
    calories: 280,
  }),
  workout: buildWorkoutNotification({
    id: "test",
    title: "პილატესი",
    timeStart: "18:30",
    durationMin: 45,
    focus: null,
  }),
  water: buildWaterNotification(3, 8),
  weight: buildWeightNotification(),
} as const;

export async function POST(req: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "not available in production" }, { status: 403 });
  }

  let kind: string = "meal";
  try {
    const body = (await req.json()) as { kind?: string };
    if (body.kind && body.kind in PAYLOADS) kind = body.kind;
  } catch {
    // use default
  }

  const payload = PAYLOADS[kind as keyof typeof PAYLOADS];
  const userId = await getOwnerUserId();
  await sendPushToUser(userId, payload);

  return NextResponse.json({ ok: true, kind, payload });
}
