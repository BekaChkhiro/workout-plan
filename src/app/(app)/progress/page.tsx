import Link from "next/link";

import { StatsTab } from "@/components/progress/StatsTab";
import { getAdherenceStats } from "@/db/queries";
import { getOwnerUser } from "@/lib/auth";
import { getTodayInTimeZone } from "@/lib/date";

export const dynamic = "force-dynamic";

const TABS = [
  { key: "weight", label: "⚖️ წონა", href: "?tab=weight" },
  { key: "measurements", label: "📏 ზომები", href: "?tab=measurements" },
  { key: "photos", label: "📸 ფოტო", href: "?tab=photos" },
  { key: "stats", label: "✨ სტატ.", href: "?tab=stats" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

function parseTab(value: string | string[] | undefined): TabKey {
  const v = Array.isArray(value) ? value[0] : value;
  return (["weight", "measurements", "photos", "stats"] as const).includes(v as TabKey)
    ? (v as TabKey)
    : "stats";
}

function subDateDays(isoDate: string, days: number): string {
  const d = new Date(`${isoDate}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

export default async function ProgressPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string | string[] }>;
}) {
  const { tab: rawTab } = await searchParams;
  const tab = parseTab(rawTab);

  const owner = await getOwnerUser();
  const today = getTodayInTimeZone(owner.timezone);
  const fromDate = subDateDays(today, 29);

  const stats = tab === "stats" ? await getAdherenceStats(owner.id, fromDate, today) : null;

  return (
    <section className="flex flex-1 flex-col">
      <div className="flex items-center justify-between px-[22px] pt-2 pb-[14px]">
        <h1 className="text-[28px] font-extrabold text-[#3D2C5F]">
          პროგრესი <span className="text-[22px]">📊</span>
        </h1>
      </div>

      <div className="px-[18px]">
        <nav
          aria-label="პროგრესის ჩანართები"
          className="flex gap-1 rounded-full border border-white/70 bg-white/55 p-[5px] backdrop-blur-[10px]"
          style={{ boxShadow: "0 2px 10px rgba(201,168,232,0.15)" }}
        >
          {TABS.map((t) => {
            const active = t.key === tab;
            return (
              <Link
                key={t.key}
                href={t.href}
                className="flex-1 rounded-full py-2 text-center text-[12px] whitespace-nowrap transition-colors"
                style={{
                  fontWeight: active ? 800 : 600,
                  color: active ? "#fff" : "#7B6A9B",
                  background: active
                    ? "linear-gradient(135deg, #FFD66B 0%, #FF9EC5 100%)"
                    : "transparent",
                  boxShadow: active ? "0 3px 10px rgba(255,158,197,0.4)" : "none",
                  textShadow: active ? "0 1px 1px rgba(90,58,10,0.18)" : "none",
                }}
              >
                {t.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex-1">
        {tab === "stats" && stats ? (
          <StatsTab stats={stats} />
        ) : (
          <div className="flex items-center justify-center py-24 text-center">
            <p className="text-ink-soft text-[14px] font-semibold">მალე...</p>
          </div>
        )}
      </div>
    </section>
  );
}
