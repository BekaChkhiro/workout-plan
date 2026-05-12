import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/db";
import { pushSubscriptions } from "@/db/schema";

const bodySchema = z.object({
  endpoint: z.string().url(),
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

  await db.delete(pushSubscriptions).where(eq(pushSubscriptions.endpoint, result.data.endpoint));

  return NextResponse.json({ ok: true });
}
