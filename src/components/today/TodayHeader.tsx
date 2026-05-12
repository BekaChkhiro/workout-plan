type TodayHeaderProps = {
  dateLine: string;
  week: number;
  totalWeeks: number;
  name: string;
  subtitle: string;
};

export function TodayHeader({ dateLine, week, totalWeeks, name, subtitle }: TodayHeaderProps) {
  return (
    <header className="relative z-1 px-[22px] pt-3.5 pb-3.5">
      <div className="mb-3.5 flex items-center justify-between">
        <span className="text-ink-soft text-[12px] font-medium">{dateLine}</span>
        <span
          className="rounded-full px-3 py-[5px] text-[10.5px] font-bold"
          style={{
            color: "#5A3A8B",
            background: "rgba(255,255,255,0.6)",
            border: "1px solid rgba(201,168,232,0.4)",
            backdropFilter: "blur(6px)",
          }}
        >
          ✨ კვირა {week} / {totalWeeks}
        </span>
      </div>
      <h1 className="text-display text-ink font-bold">
        გამარჯობა, {name} <span>👋</span>
      </h1>
      <p className="text-ink-soft mt-1.5 text-[13.5px] font-medium">{subtitle} 🌸</p>
    </header>
  );
}
