import { NextResponse } from "next/server";

import { getOwnerUserId } from "@/lib/auth";
import { sendPushToUser } from "@/lib/push";

export async function POST() {
  const userId = await getOwnerUserId();

  await sendPushToUser(userId, {
    title: "✅ Push მუშაობს!",
    body: "შეტყობინება წარმატებით მიღებულია.",
    tag: "test",
    url: "/",
  });

  return NextResponse.json({ ok: true });
}
