"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { updateUserSettings } from "@/db/queries";
import { getOwnerUser } from "@/lib/auth";
import { getTodayInTimeZone } from "@/lib/date";
import { lucia, validateRequest } from "@/lib/lucia";

export async function updateDailyTargetsAction(data: {
  calorieTarget: number;
  pTarget: number;
  nTarget: number;
  fTarget: number;
  waterTargetL: number;
}): Promise<{ ok: true }> {
  const owner = await getOwnerUser();
  await updateUserSettings(owner.id, {
    calorieTarget: data.calorieTarget,
    pTarget: data.pTarget,
    nTarget: data.nTarget,
    fTarget: data.fTarget,
    waterTargetL: data.waterTargetL.toFixed(2),
  });
  revalidatePath("/profile");
  return { ok: true };
}

export async function updateTargetWeightAction(kg: number): Promise<{ ok: true }> {
  const owner = await getOwnerUser();
  await updateUserSettings(owner.id, { targetWeightKg: kg.toFixed(2) });
  revalidatePath("/profile");
  return { ok: true };
}

export async function updateNotifAction(
  key: "notifMeals" | "notifWorkouts" | "notifWater" | "notifWeight",
  value: boolean,
): Promise<{ ok: true }> {
  const owner = await getOwnerUser();
  await updateUserSettings(owner.id, { [key]: value });
  revalidatePath("/profile");
  return { ok: true };
}

export async function updateThemeAction(theme: "light" | "dark" | "system"): Promise<{ ok: true }> {
  const owner = await getOwnerUser();
  await updateUserSettings(owner.id, { theme });
  revalidatePath("/profile");
  return { ok: true };
}

export async function resetPlanAction(): Promise<{ ok: true }> {
  const owner = await getOwnerUser();
  const today = getTodayInTimeZone(owner.timezone);
  await updateUserSettings(owner.id, { planStartDate: today, currentWeekOverride: null });
  revalidatePath("/profile");
  revalidatePath("/plan");
  revalidatePath("/");
  return { ok: true };
}

export async function logoutAction(): Promise<never> {
  const { session } = await validateRequest();
  if (session) {
    await lucia.invalidateSession(session.id);
  }
  const cookieStore = await cookies();
  const blank = lucia.createBlankSessionCookie();
  cookieStore.set(blank.name, blank.value, blank.attributes);
  redirect("/login");
}

export async function exportUserDataAction(): Promise<{ csv: string }> {
  const owner = await getOwnerUser();
  const csv = [
    "field,value",
    `name,${owner.name}`,
    `email,${owner.email}`,
    `exported_at,${new Date().toISOString()}`,
  ].join("\n");
  return { csv };
}
