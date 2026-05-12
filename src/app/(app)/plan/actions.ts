"use server";

import { revalidatePath } from "next/cache";

import { setWeekOverride } from "@/db/queries";
import { getOwnerUser } from "@/lib/auth";

export async function setWeekOverrideAction(week: 1 | 2 | 3 | 4 | null): Promise<{ ok: true }> {
  const owner = await getOwnerUser();
  await setWeekOverride(owner.id, week);
  revalidatePath("/plan");
  revalidatePath("/profile");
  return { ok: true };
}
