import { PlanScreen } from "@/components/plan/PlanScreen";
import { getFourWeekPlan } from "@/db/queries";
import { getOwnerUser } from "@/lib/auth";
import { getTodayInTimeZone } from "@/lib/date";

export const dynamic = "force-dynamic";

export default async function PlanPage() {
  const owner = await getOwnerUser();
  const date = getTodayInTimeZone(owner.timezone);
  const plan = await getFourWeekPlan(owner.id, date);

  return <PlanScreen plan={plan} />;
}
