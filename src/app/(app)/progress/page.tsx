import { MeasurementsTab } from "@/components/progress/MeasurementsTab";
import { StatsTab } from "@/components/progress/StatsTab";
import { WeightTab } from "@/components/progress/WeightTab";
import {
  getAdherenceStats,
  getMeasurementHistory,
  getTargetWeightKg,
  getWeightHistory,
} from "@/db/queries";
import { getOwnerUser } from "@/lib/auth";
import { getTodayInTimeZone } from "@/lib/date";

import { ProgressTabBar } from "./_components/ProgressTabBar";

const VALID_TABS = ["weight", "measurements", "photos", "stats"] as const;
type Tab = (typeof VALID_TABS)[number];

export const dynamic = "force-dynamic";

export default async function ProgressPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const activeTab: Tab = (VALID_TABS as readonly string[]).includes(tab ?? "")
    ? (tab as Tab)
    : "weight";

  const owner = await getOwnerUser();
  const today = getTodayInTimeZone(owner.timezone);

  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const statsFrom = thirtyDaysAgo.toISOString().slice(0, 10);

  const [weightEntries, measurementEntries, targetWeightKg, stats] = await Promise.all([
    activeTab === "weight" ? getWeightHistory(owner.id) : Promise.resolve([]),
    activeTab === "measurements"
      ? getMeasurementHistory(owner.id, { from: statsFrom })
      : Promise.resolve([]),
    activeTab === "weight" ? getTargetWeightKg(owner.id) : Promise.resolve(null),
    activeTab === "stats" ? getAdherenceStats(owner.id, statsFrom, today) : Promise.resolve(null),
  ]);

  return (
    <>
      <header className="relative z-1 flex items-center justify-between px-[22px] pt-3.5 pb-3">
        <h1 className="text-h1 text-ink font-extrabold">
          პროგრესი <span>📊</span>
        </h1>
        <button
          aria-label="თარიღის ფილტრი"
          className="flex h-9 w-9 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-pink)]"
          style={{
            background: "rgba(255,255,255,0.65)",
            border: "1.5px solid #C9A8E8",
            backdropFilter: "blur(8px)",
          }}
        >
          <svg width="17" height="17" viewBox="0 0 17 17" aria-hidden="true">
            <rect
              x="2.5"
              y="3.5"
              width="12"
              height="11"
              rx="2"
              fill="none"
              stroke="#5A3A8B"
              strokeWidth="1.4"
            />
            <path
              d="M2.5 6.5h12M6 2v3M11 2v3"
              fill="none"
              stroke="#5A3A8B"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </header>

      <ProgressTabBar activeTab={activeTab} />

      <div className="relative z-1 flex flex-1 flex-col pt-4">
        {activeTab === "weight" && (
          <WeightTab entries={weightEntries} today={today} targetKg={targetWeightKg} />
        )}
        {activeTab === "measurements" && (
          <MeasurementsTab entries={measurementEntries} today={today} />
        )}
        {activeTab === "photos" && <PhotosPlaceholder />}
        {activeTab === "stats" && stats && <StatsTab stats={stats} />}
      </div>
    </>
  );
}

function PlaceholderCard({
  emoji,
  title,
  subtitle,
}: {
  emoji: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="px-[18px]">
      <div
        className="flex flex-col items-center gap-3 rounded-[var(--radius-lg)] px-6 py-10 text-center"
        style={{ background: "#FFFFFF", boxShadow: "var(--shadow-md)" }}
      >
        <span className="text-5xl">{emoji}</span>
        <p className="text-h2 text-ink font-bold">{title}</p>
        <p className="text-body text-ink-soft">{subtitle}</p>
      </div>
    </div>
  );
}

function PhotosPlaceholder() {
  return (
    <PlaceholderCard
      emoji="📸"
      title="პროგრესის ფოტოები"
      subtitle="T5.6-ში — ფოტოების ატვირთვა და გალერეა"
    />
  );
}
