import type { AdherenceStats } from "@/db/queries";

type StatCard = {
  icon: string;
  label: string;
  value: string;
  subtext: string;
  iconBg: string;
  textColor: string;
};

function buildCards(stats: AdherenceStats): StatCard[] {
  return [
    {
      icon: "🍽",
      label: "კვება",
      value: `${stats.meals.pct}%`,
      subtext: `${stats.meals.completed} / ${stats.meals.total} მიღება`,
      iconBg: "#FFE6F0",
      textColor: "#C04A7E",
    },
    {
      icon: "🏋️",
      label: "ვარჯიში",
      value: `${stats.workouts.pct}%`,
      subtext: `${stats.workouts.completed} / ${stats.workouts.total} ვარჯიში`,
      iconBg: "#FFF5DA",
      textColor: "#A47000",
    },
    {
      icon: "💧",
      label: "წყალი",
      value: `${stats.water.pct}%`,
      subtext: `${stats.water.days} / ${stats.water.total} დღე`,
      iconBg: "#E7F8EE",
      textColor: "#2E8B57",
    },
    {
      icon: "🔥",
      label: "სერია",
      value: String(stats.streak),
      subtext: stats.streak === 1 ? "1 დღე ზედიზედ" : `${stats.streak} დღე ზედიზედ`,
      iconBg: "#F0E5F9",
      textColor: "#7B4FA8",
    },
  ];
}

function achievementText(deltaKg: number): string {
  const abs = Math.abs(deltaKg).toFixed(1);
  if (Math.abs(deltaKg) >= 3) return `−${abs} კგ მიღწეული — შესანიშნავი შედეგია 🎉`;
  if (Math.abs(deltaKg) >= 1) return `−${abs} კგ მიღწეული — ნახევარი გზა გაიარე 🎉`;
  return `−${abs} კგ მიღწეული — კარგი დასაწყისი 💪`;
}

export function StatsTab({ stats }: { stats: AdherenceStats }) {
  const cards = buildCards(stats);
  const { weightDeltaKg } = stats;
  const showAchievement = weightDeltaKg !== null && weightDeltaKg < 0;

  return (
    <div className="px-[18px] pt-5 pb-6">
      <p className="text-ink-soft mb-4 text-[12px] font-semibold tracking-wider uppercase">
        ბოლო 30 დღე
      </p>

      <div className="grid grid-cols-2 gap-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-surface rounded-[20px] p-4"
            style={{ boxShadow: "var(--shadow-sm)" }}
          >
            <div
              className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-[10px] text-[17px]"
              style={{ background: card.iconBg }}
            >
              {card.icon}
            </div>
            <div className="text-ink mb-0.5 text-[30px] leading-none font-extrabold tracking-tight">
              {card.value}
            </div>
            <div className="text-ink mb-1 text-[11px] font-bold tracking-wider uppercase">
              {card.label}
            </div>
            <div className="text-[11px] font-semibold" style={{ color: card.textColor }}>
              {card.subtext}
            </div>
          </div>
        ))}
      </div>

      {showAchievement && (
        <div
          className="relative mt-4 overflow-hidden rounded-[20px] px-[18px] py-[16px]"
          style={{
            background: "linear-gradient(135deg, #E8DFF7 0%, #FFE6F0 100%)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute top-1 right-1 text-[50px] leading-none opacity-60"
          >
            ✨
          </span>
          <p className="mb-1 text-[10.5px] font-bold tracking-widest text-[#7B4FA8] uppercase">
            შენ ხარ ცეცხლი!
          </p>
          <p className="pr-[50px] text-[13px] leading-snug font-semibold text-[#3D2C5F]">
            {achievementText(weightDeltaKg!)}
          </p>
        </div>
      )}

      {!showAchievement && weightDeltaKg !== null && weightDeltaKg >= 0 && (
        <div
          className="relative mt-4 overflow-hidden rounded-[20px] px-[18px] py-[16px]"
          style={{
            background: "linear-gradient(135deg, #E8DFF7 0%, #FFE6F0 100%)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute top-1 right-1 text-[50px] leading-none opacity-60"
          >
            💪
          </span>
          <p className="mb-1 text-[10.5px] font-bold tracking-widest text-[#7B4FA8] uppercase">
            გააგრძელე!
          </p>
          <p className="pr-[50px] text-[13px] leading-snug font-semibold text-[#3D2C5F]">
            ყოველი ნაბიჯი მიზნისკენ მიგაახლოებს 🌟
          </p>
        </div>
      )}
    </div>
  );
}
