"use server";

import { revalidatePath } from "next/cache";

import { logMealComplete, reorderMeals, unlogMealComplete, updateMeal } from "@/db/queries";
import { getOwnerUser } from "@/lib/auth";
import { getTodayInTimeZone } from "@/lib/date";

import { type MealFormValues, mealFormSchema } from "./meal-schema";

export type { MealFormValues } from "./meal-schema";

export async function updateMealAction(
  mealId: string,
  data: MealFormValues,
): Promise<{ ok: true }> {
  const owner = await getOwnerUser();
  const parsed = mealFormSchema.parse(data);
  await updateMeal(owner.id, mealId, parsed);
  revalidatePath("/meals");
  revalidatePath("/");
  return { ok: true };
}

export async function reorderMealsAction(orderedIds: string[]): Promise<{ ok: true }> {
  const owner = await getOwnerUser();
  await reorderMeals(owner.id, orderedIds);
  revalidatePath("/meals");
  revalidatePath("/");
  return { ok: true };
}

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
