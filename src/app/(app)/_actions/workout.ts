"use server";

import { revalidatePath } from "next/cache";

import { logWorkoutComplete, updateWorkout } from "@/db/queries";
import type { Workout } from "@/db/schema";
import { getOwnerUser } from "@/lib/auth";
import { getTodayInTimeZone } from "@/lib/date";

export async function completeWorkoutAction(workoutId: string): Promise<void> {
  const owner = await getOwnerUser();
  const today = getTodayInTimeZone(owner.timezone);
  await logWorkoutComplete(owner.id, workoutId, today);
  revalidatePath("/");
}

export type UpdateWorkoutPatch = Partial<
  Pick<
    Workout,
    | "type"
    | "title"
    | "focus"
    | "durationMin"
    | "intensity"
    | "timeStart"
    | "timeEnd"
    | "videoUrl"
    | "description"
  >
>;

export async function updateWorkoutAction(
  workoutId: string,
  patch: UpdateWorkoutPatch,
): Promise<void> {
  const owner = await getOwnerUser();
  await updateWorkout(owner.id, workoutId, patch);
  revalidatePath("/plan");
  revalidatePath("/");
}
