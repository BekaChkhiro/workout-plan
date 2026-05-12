import { WeekModeSection } from "@/components/plan/WeekModeSection";
import { getWeekModeSetting } from "@/db/queries";
import { getOwnerUser } from "@/lib/auth";
import { getTodayInTimeZone } from "@/lib/date";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const owner = await getOwnerUser();
  const date = getTodayInTimeZone(owner.timezone);
  const weekMode = await getWeekModeSetting(owner.id, date);

  return (
    <section className="flex flex-1 flex-col gap-5 pt-4">
      <div className="px-[22px]">
        <h1 className="text-display text-ink font-bold">პროფილი</h1>
        <p className="text-body text-ink-soft mt-1">პარამეტრები და ანგარიში — T6-ში</p>
      </div>

      <WeekModeSection
        currentWeekOverride={weekMode.currentWeekOverride}
        todayAutoWeek={weekMode.todayAutoWeek}
      />
    </section>
  );
}
