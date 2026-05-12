import Link from "next/link";

const TABS = [
  { key: "weight", label: "⚖️ წონა" },
  { key: "measurements", label: "📏 ზომები" },
  { key: "photos", label: "📸 ფოტო" },
  { key: "stats", label: "✨ სტატ." },
] as const;

type Tab = (typeof TABS)[number]["key"];

export function ProgressTabBar({ activeTab }: { activeTab: Tab }) {
  return (
    <div className="relative z-1 px-[18px]">
      <div
        className="flex gap-1 rounded-full border p-[5px]"
        style={{
          background: "rgba(255,255,255,0.55)",
          borderColor: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 2px 10px rgba(201,168,232,0.15)",
        }}
      >
        {TABS.map((tab) => {
          const active = tab.key === activeTab;
          return (
            <Link
              key={tab.key}
              href={`/progress?tab=${tab.key}`}
              aria-current={active ? "page" : undefined}
              className="flex-1 rounded-full py-2 text-center text-[12.5px] whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-pink)]"
              style={
                active
                  ? {
                      background: "linear-gradient(135deg, #FFD66B 0%, #FF9EC5 100%)",
                      color: "#fff",
                      fontWeight: 800,
                      boxShadow: "0 3px 10px rgba(255,158,197,0.4)",
                      textShadow: "0 1px 1px rgba(90,58,10,0.18)",
                    }
                  : {
                      color: "#7B6A9B",
                      fontWeight: 600,
                    }
              }
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
