"use server";

import { revalidatePath } from "next/cache";

import { logWeight } from "@/db/queries";
import { getOwnerUser } from "@/lib/auth";

export async function logWeightAction(date: string, kg: number): Promise<{ ok: true }> {
  const owner = await getOwnerUser();
  await logWeight(owner.id, date, kg);
  revalidatePath("/progress");
  return { ok: true };
}
