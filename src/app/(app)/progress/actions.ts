"use server";

import { revalidatePath } from "next/cache";

import { logMeasurement, logWeight } from "@/db/queries";
import { getOwnerUser } from "@/lib/auth";

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
