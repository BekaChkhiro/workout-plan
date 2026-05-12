"use client";

import { useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis } from "recharts";

import type { WeightPoint } from "@/db/queries";

const KA_DAYS_SHORT = ["კვი", "ორშ", "სამშ", "ოთხ", "ხუთ", "პარ", "შაბ"];
const KA_MONTHS_SHORT = [
  "იან",
  "თებ",
  "მარ",
  "აპრ",
  "მაი",
  "ივნ",
  "ივლ",
  "აგვ",
  "სექ",
  "ოქტ",
  "ნოე",
  "დეკ",
];

type Range = "week" | "month" | "all";

const RANGE_LABELS: Record<Range, string> = {
  week: "კვირა",
  month: "თვე",
  all: "ყველა",
};

function parseDateUTC(d: string): Date {
  return new Date(`${d}T00:00:00Z`);
}

function filterByRange(entries: WeightPoint[], range: Range): WeightPoint[] {
  if (range === "all" || entries.length === 0) return entries;
  const days = range === "week" ? 7 : 30;
  return entries.slice(-days);
}

function toChartData(entries: WeightPoint[], range: Range) {
  return entries.map((e) => {
    const d = parseDateUTC(e.date);
    let label: string;
    if (range === "week") {
      label = KA_DAYS_SHORT[d.getUTCDay()] ?? "";
    } else if (range === "month") {
      label = `${d.getUTCDate()}/${d.getUTCMonth() + 1}`;
    } else {
      label = KA_MONTHS_SHORT[d.getUTCMonth()] ?? "";
    }
    return { label, kg: e.kg, date: e.date };
  });
}

type ChartEntry = { label: string; kg: number; date: string };

function CustomDot(props: {
  cx: number | undefined;
  cy: number | undefined;
  index: number | undefined;
  payload?: ChartEntry;
  dataLength: number;
}) {
  const { cx, cy, index, dataLength } = props;
  if (cx == null || cy == null || index == null) return null;
  const isLast = index === dataLength - 1;

  if (isLast) {
    return (
      <g>
        <circle cx={cx} cy={cy} r={9} fill="#C9A8E8" opacity={0.25} />
        <circle cx={cx} cy={cy} r={6} fill="#C9A8E8" />
        <circle cx={cx} cy={cy} r={2.5} fill="white" />
      </g>
    );
  }

  return <circle cx={cx} cy={cy} r={4} fill="white" stroke="#FF9EC5" strokeWidth={2} />;
}

function LastPointTooltip({ data }: { data: ChartEntry[] }) {
  const last = data[data.length - 1];
  if (!last) return null;

  return (
    <div
      className="absolute"
      style={{
        right: 6,
        top: 2,
        pointerEvents: "none",
      }}
    >
      <div
        className="rounded-xl px-3 py-1.5 text-[11px] font-semibold shadow-sm"
        style={{
          background: "white",
          color: "#3D2C5F",
          boxShadow: "0 2px 8px rgba(90,58,139,0.13)",
          whiteSpace: "nowrap",
        }}
      >
        {last.kg.toFixed(1)} კგ
        <span style={{ color: "#B7AAD0" }} className="ml-1">
          · {last.label}
        </span>
      </div>
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: "5px solid transparent",
          borderRight: "5px solid transparent",
          borderTop: "5px solid white",
          margin: "0 auto",
          filter: "drop-shadow(0 1px 1px rgba(90,58,139,0.08))",
        }}
      />
    </div>
  );
}

type Props = {
  entries: WeightPoint[];
};

export function WeightChart({ entries }: Props) {
  const [range, setRange] = useState<Range>("week");

  const filtered = filterByRange(entries, range);
  const chartData = toChartData(filtered, range);

  return (
    <div
      className="rounded-[var(--radius-lg)] bg-white px-5 py-5"
      style={{ boxShadow: "var(--shadow-md)" }}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-h2 text-ink font-bold">📈 დინამიკა</h2>
        <div className="rounded-pill flex gap-0.5 p-0.5" style={{ background: "#F4ECFA" }}>
          {(["week", "month", "all"] as Range[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className="rounded-pill px-2.5 py-1 text-[10.5px] font-bold transition-colors"
              style={
                range === r
                  ? {
                      background: "white",
                      color: "#3D2C5F",
                      boxShadow: "0 1px 4px rgba(90,58,139,0.12)",
                    }
                  : { color: "#7B6A9B" }
              }
            >
              {RANGE_LABELS[r]}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      {chartData.length === 0 ? (
        <div className="flex h-[180px] items-center justify-center">
          <p className="text-caption text-ink-mute">ჩანაწერები არ არის</p>
        </div>
      ) : (
        <div className="relative">
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={chartData} margin={{ top: 24, right: 8, bottom: 0, left: -28 }}>
              <defs>
                <linearGradient id="wc-stroke" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#FF9EC5" />
                  <stop offset="100%" stopColor="#C9A8E8" />
                </linearGradient>
                <linearGradient id="wc-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF9EC5" stopOpacity={0.18} />
                  <stop offset="100%" stopColor="#C9A8E8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                horizontal
                vertical={false}
                strokeDasharray="4 4"
                stroke="#F4ECFA"
                strokeWidth={1}
              />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: "#B7AAD0", fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <Area
                type="monotone"
                dataKey="kg"
                stroke="url(#wc-stroke)"
                strokeWidth={2.5}
                fill="url(#wc-fill)"
                isAnimationActive={false}
                dot={(dotProps: { cx?: number; cy?: number; index?: number }) => (
                  <CustomDot
                    key={dotProps.index}
                    cx={dotProps.cx}
                    cy={dotProps.cy}
                    index={dotProps.index}
                    dataLength={chartData.length}
                  />
                )}
                activeDot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
          {chartData.length > 0 && <LastPointTooltip data={chartData} />}
        </div>
      )}
    </div>
  );
}
