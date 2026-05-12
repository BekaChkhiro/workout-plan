"use server";

import { revalidatePath } from "next/cache";

import { logMealComplete, unlogMealComplete } from "@/db/queries";
import { getOwnerUser } from "@/lib/auth";
import { getTodayInTimeZone } from "@/lib/date";

export async function toggleMealCompleteAction(
  mealId: string,
  completed: boolean,
): Promise<{ ok: true }> {
  const owner = await getOwnerUser();
  const today = getTodayInTimeZone(owner.timezone);

  if (completed) {
    await logMealComplete(owner.id, mealId, today);
  } else {
    await unlogMealComplete(owner.id, mealId, today);
  }

  revalidatePath("/meals");
  revalidatePath("/");

  return { ok: true };
}
