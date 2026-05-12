import { NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/db";
import { pushSubscriptions } from "@/db/schema";
import { getOwnerUserId } from "@/lib/auth";

const bodySchema = z.object({
  endpoint: z.string().url(),
  p256dh: z.string().min(1),
  auth: z.string().min(1),
});

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  const result = bodySchema.safeParse(json);
  if (!result.success) {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const { endpoint, p256dh, auth } = result.data;
  const userId = await getOwnerUserId();

  await db.insert(pushSubscriptions).values({ userId, endpoint, p256dh, auth }).onConflictDoUpdate({
    target: pushSubscriptions.endpoint,
    set: { p256dh, auth },
  });

  return NextResponse.json({ ok: true });
}
