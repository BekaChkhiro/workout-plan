import { PlanScreen } from "@/components/plan/PlanScreen";
import { getFourWeekPlan } from "@/db/queries";
import { getCurrentUserId } from "@/lib/current-user";

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export default async function PlanPage() {
  const userId = await getCurrentUserId();
  const plan = await getFourWeekPlan(userId, todayISO());

  return <PlanScreen plan={plan} />;
}
