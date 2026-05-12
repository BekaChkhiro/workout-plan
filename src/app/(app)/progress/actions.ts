"use server";

import { revalidatePath } from "next/cache";

import { put } from "@vercel/blob";

import { addProgressPhoto, getCurrentPlanWeek, logMeasurement, logWeight } from "@/db/queries";
import { getOwnerUser } from "@/lib/auth";
import { getTodayInTimeZone } from "@/lib/date";

export async function logWeightAction(date: string, kg: number): Promise<{ ok: true }> {
  const owner = await getOwnerUser();
  await logWeight(owner.id, date, kg);
  revalidatePath("/progress");
  return { ok: true };
}

export async function logMeasurementAction(
  date: string,
  data: {
    waistCm?: number | null | undefined;
    armCm?: number | null | undefined;
    thighCm?: number | null | undefined;
  },
): Promise<{ ok: true }> {
  const owner = await getOwnerUser();
  await logMeasurement(owner.id, date, data);
  revalidatePath("/progress");
  return { ok: true };
}

export async function uploadProgressPhotoAction(formData: FormData): Promise<{ ok: true }> {
  const owner = await getOwnerUser();
  const file = formData.get("photo") as File | null;
  if (!file || file.size === 0) throw new Error("ფაილი არ არის");

  const today = getTodayInTimeZone(owner.timezone);
  const week = await getCurrentPlanWeek(owner.id, today);

  const ext = file.name.split(".").pop() ?? "jpg";
  const blob = await put(`progress-photos/${owner.id}/${Date.now()}.${ext}`, file, {
    access: "public",
  });

  await addProgressPhoto(owner.id, week, blob.url);
  revalidatePath("/progress");
  return { ok: true };
}
