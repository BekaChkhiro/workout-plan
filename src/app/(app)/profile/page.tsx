import {
  getAdherenceStats,
  getUserSettings,
  getWeightHistory,
  getWeekModeSetting,
} from "@/db/queries";
import { getOwnerUser } from "@/lib/auth";
import { getTodayInTimeZone } from "@/lib/date";
import { ProfileScreen } from "@/components/profile/ProfileScreen";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const owner = await getOwnerUser();
  const today = getTodayInTimeZone(owner.timezone);

  const thirtyDaysAgo = new Date(`${today}T00:00:00Z`);
  thirtyDaysAgo.setUTCDate(thirtyDaysAgo.getUTCDate() - 30);
  const statsFrom = thirtyDaysAgo.toISOString().slice(0, 10);

  const [settings, weekMode, weightHistory, adherence] = await Promise.all([
    getUserSettings(owner.id),
    getWeekModeSetting(owner.id, today),
    getWeightHistory(owner.id),
    getAdherenceStats(owner.id, statsFrom, today),
  ]);

  const daysSinceStart = Math.max(
    0,
    Math.floor(
      (new Date(`${today}T00:00:00Z`).getTime() -
        new Date(`${settings.planStartDate}T00:00:00Z`).getTime()) /
        86_400_000,
    ),
  );

  const adherencePct = Math.round((adherence.meals.pct + adherence.workouts.pct) / 2);

  return (
    <ProfileScreen
      user={owner}
      settings={settings}
      weekMode={weekMode}
      weightHistory={weightHistory}
      adherencePct={adherencePct}
      daysSinceStart={daysSinceStart}
    />
  );
}
