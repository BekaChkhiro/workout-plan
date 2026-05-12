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

      <div className="relative z-1 flex flex-1 flex-col px-[18px] pt-4">
        {activeTab === "weight" && <WeightPlaceholder />}
        {activeTab === "measurements" && <MeasurementsPlaceholder />}
        {activeTab === "photos" && <PhotosPlaceholder />}
        {activeTab === "stats" && <StatsPlaceholder />}
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
    <div
      className="flex flex-col items-center gap-3 rounded-[var(--radius-lg)] px-6 py-10 text-center"
      style={{
        background: "#FFFFFF",
        boxShadow: "var(--shadow-md)",
      }}
    >
      <span className="text-5xl">{emoji}</span>
      <p className="text-h2 text-ink font-bold">{title}</p>
      <p className="text-body text-ink-soft">{subtitle}</p>
    </div>
  );
}

function WeightPlaceholder() {
  return (
    <PlaceholderCard
      emoji="⚖️"
      title="წონის ჩანაწერები"
      subtitle="T5.2-ში — წონის ჩაწერა და გრაფიკი"
    />
  );
}

function MeasurementsPlaceholder() {
  return (
    <PlaceholderCard
      emoji="📏"
      title="სხეულის გაზომვები"
      subtitle="T5.4-ში — წელი, მკლავი, ბარძაყი"
    />
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

function StatsPlaceholder() {
  return (
    <PlaceholderCard
      emoji="✨"
      title="სტატისტიკა"
      subtitle="T5.7-ში — ვარჯიშის adherence და ტენდენციები"
    />
  );
}
