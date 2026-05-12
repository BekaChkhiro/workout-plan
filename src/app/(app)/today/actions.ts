"use server";

import { revalidatePath } from "next/cache";

import { logWater } from "@/db/queries";
import { getOwnerUser } from "@/lib/auth";
import { getTodayInTimeZone } from "@/lib/date";

export async function setWaterGlassesAction(glasses: number): Promise<{ ok: true }> {
  const owner = await getOwnerUser();
  const today = getTodayInTimeZone(owner.timezone);
  await logWater(owner.id, today, glasses);
  revalidatePath("/");
  return { ok: true };
}
