"use server";

import { revalidatePath } from "next/cache";

import { logWorkoutComplete } from "@/db/queries";
import { getOwnerUser } from "@/lib/auth";
import { getTodayInTimeZone } from "@/lib/date";

export async function completeWorkoutAction(workoutId: string): Promise<void> {
  const owner = await getOwnerUser();
  const today = getTodayInTimeZone(owner.timezone);
  await logWorkoutComplete(owner.id, workoutId, today);
  revalidatePath("/");
}
