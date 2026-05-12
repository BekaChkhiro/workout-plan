import webpush from "web-push";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { pushSubscriptions } from "@/db/schema";
import { getVapidKeys } from "./vapid";

export interface PushPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  url?: string;
  tag?: string;
}

function initWebPush() {
  const { publicKey, privateKey } = getVapidKeys();
  webpush.setVapidDetails("mailto:webinfinity12@gmail.com", publicKey, privateKey);
}

export async function sendPushToUser(userId: string, payload: PushPayload): Promise<void> {
  initWebPush();

  const subs = await db
    .select()
    .from(pushSubscriptions)
    .where(eq(pushSubscriptions.userId, userId));

  await Promise.all(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          JSON.stringify(payload),
        );
      } catch (err: unknown) {
        if (err instanceof webpush.WebPushError && err.statusCode === 410) {
          await db.delete(pushSubscriptions).where(eq(pushSubscriptions.endpoint, sub.endpoint));
        }
      }
    }),
  );
}
