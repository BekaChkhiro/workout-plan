"use client";

import React, { useState, useOptimistic, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  exportUserDataAction,
  resetPlanAction,
  updateNotifAction,
  updateThemeAction,
} from "@/app/(app)/profile/actions";
import { setWeekOverrideAction } from "@/app/(app)/plan/actions";
import type { UserSettings } from "@/db/schema";
import type { User } from "@/db/schema";
import type { WeightPoint } from "@/db/queries";

import { DailyTargetsSheet } from "./DailyTargetsSheet";
import { GoalSheet } from "./GoalSheet";

// ─── Types ───────────────────────────────────────────────────────────────────

type NotifKey = "notifMeals" | "notifWorkouts" | "notifWater" | "notifWeight";
type Theme = "light" | "dark" | "system";

type Props = {
  user: User;
  settings: UserSettings;
  weekMode: { currentWeekOverride: number | null; todayAutoWeek: number };
  weightHistory: WeightPoint[];
  adherencePct: number;
  daysSinceStart: number;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatPlanStartDate(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00Z`);
  const months = [
    "იანვ.",
    "თებ.",
    "მარ.",
    "აპრ.",
    "მაი.",
    "ივნ.",
    "ივლ.",
    "აგვ.",
    "სექ.",
    "ოქტ.",
    "ნოე.",
    "დეკ.",
  ];
  return `${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({
  children,
  muted = false,
}: {
  children: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <div
      className="mx-[22px] mt-6 mb-3 text-[10.5px] font-bold tracking-[0.08em] uppercase"
      style={{ color: muted ? "#9785B5" : "#7B4FA8" }}
    >
      {children}
    </div>
  );
}

function SettingsCard({ children, muted = false }: { children: React.ReactNode; muted?: boolean }) {
  const arr = React.Children.toArray(children);
  return (
    <div
      className="mx-[18px] overflow-hidden rounded-[20px] border"
      style={{
        background: "#FFFFFF",
        borderColor: "rgba(244,236,250,0.8)",
        boxShadow: muted ? "0 1px 4px rgba(201,168,232,0.10)" : "0 2px 8px rgba(201,168,232,0.12)",
      }}
    >
      {arr.map((child, i) => (
        <React.Fragment key={i}>
          {i > 0 && <div className="mx-[18px] h-px bg-[#F4ECFA]" />}
          {child}
        </React.Fragment>
      ))}
    </div>
  );
}

function SettingRow({
  label,
  right,
  footer,
  onClick,
}: {
  label: React.ReactNode;
  right: React.ReactNode;
  footer?: string;
  onClick?: () => void;
}) {
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="w-full px-[18px] py-[14px] text-left">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[13.5px] font-semibold text-[#3D2C5F]">{label}</span>
          <div className="flex-shrink-0">{right}</div>
        </div>
        {footer && <p className="mt-1 text-[11.5px] font-medium text-[#7B6A9B]">{footer}</p>}
      </button>
    );
  }
  return (
    <div className="px-[18px] py-[14px]">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[13.5px] font-semibold text-[#3D2C5F]">{label}</span>
        <div className="flex-shrink-0">{right}</div>
      </div>
      {footer && <p className="mt-1 text-[11.5px] font-medium text-[#7B6A9B]">{footer}</p>}
    </div>
  );
}

function DotValue({ color, value }: { color: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="h-2 w-2 flex-shrink-0 rounded-full" style={{ background: color }} />
      <span className="text-[13.5px] font-bold text-[#3D2C5F]">{value}</span>
    </span>
  );
}

function ValueWithPencil({ value }: { value: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="text-[13.5px] font-bold text-[#3D2C5F]">{value}</span>
      <span
        className="inline-flex h-[22px] w-[22px] items-center justify-center rounded-full"
        style={{ background: "#F4ECFA" }}
      >
        <svg width="11" height="11" viewBox="0 0 11 11" aria-hidden="true">
          <path
            d="M1.5 8.5L7.7 2.3l1.5 1.5L3 10H1.5V8.5z"
            fill="none"
            stroke="#7B4FA8"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </span>
  );
}

function IOSSwitch({
  on,
  onChange,
  disabled,
}: {
  on: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onChange}
      disabled={disabled}
      className="flex-shrink-0 disabled:opacity-60"
      style={{
        width: 42,
        height: 26,
        borderRadius: 999,
        background: on ? "linear-gradient(135deg, #FFD66B 0%, #FF9EC5 100%)" : "#E8DFF7",
        padding: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: on ? "flex-end" : "flex-start",
        boxShadow: on
          ? "inset 0 1px 2px rgba(192,74,126,0.18)"
          : "inset 0 1px 2px rgba(60,40,90,0.08)",
        transition: "all 200ms ease",
      }}
    >
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: 999,
          background: "#fff",
          boxShadow: "0 1px 3px rgba(60,40,90,0.25)",
        }}
      />
    </button>
  );
}

function ChevronRight({ color = "#B7AAD0" }: { color?: string }) {
  return (
    <svg width="8" height="13" viewBox="0 0 8 13" aria-hidden="true">
      <path
        d="M1.5 1.5L6.5 6.5L1.5 11.5"
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Sections ─────────────────────────────────────────────────────────────────

function IdentityCard({
  user,
  weightHistory,
  adherencePct,
  daysSinceStart,
  weekMode,
}: {
  user: User;
  weightHistory: WeightPoint[];
  adherencePct: number;
  daysSinceStart: number;
  weekMode: { currentWeekOverride: number | null; todayAutoWeek: number };
}) {
  const initial = user.name.charAt(0).toUpperCase();
  const activeWeek = weekMode.currentWeekOverride ?? weekMode.todayAutoWeek;

  const firstKg = weightHistory[0]?.kg;
  const lastKg = weightHistory[weightHistory.length - 1]?.kg;
  const weightStat =
    weightHistory.length >= 2 ? `${firstKg} → ${lastKg}` : lastKg != null ? `${lastKg}` : "—";

  const stats = [
    { v: weightStat, c: "კგ" },
    { v: String(daysSinceStart), c: "დღე" },
    { v: `${adherencePct}%`, c: "adherence" },
  ];

  return (
    <div
      className="relative z-1 mx-[18px] mt-1 overflow-hidden rounded-[28px]"
      style={{
        background: "linear-gradient(135deg, #E8DFF7 0%, #FFE6F0 100%)",
        padding: "22px 20px 0",
        boxShadow: "0 4px 16px rgba(255,158,197,0.18), 0 1px 4px rgba(201,168,232,0.12)",
      }}
    >
      <div
        className="pointer-events-none absolute top-2.5 right-3.5 text-[30px] opacity-45"
        aria-hidden="true"
      >
        ✨
      </div>

      <div className="flex items-center gap-4">
        <div
          className="flex h-[72px] w-[72px] flex-shrink-0 items-center justify-center rounded-full text-[32px] font-extrabold text-white"
          style={{
            background: "linear-gradient(135deg, #FFD66B 0%, #FF9EC5 100%)",
            boxShadow: "0 4px 14px rgba(255,158,197,0.4)",
          }}
        >
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[22px] leading-tight font-extrabold text-[#3D2C5F]">{user.name}</div>
          <div className="mt-0.5 text-[12px] font-medium text-[#7B6A9B]">{user.email}</div>
          <span
            className="mt-1.5 inline-block rounded-full border border-white/80 px-2.5 py-[3px] text-[10.5px] font-bold text-[#5A3A8B]"
            style={{ background: "rgba(255,255,255,0.7)" }}
          >
            ✨ კვირა {activeWeek} / 4
          </span>
        </div>
      </div>

      <div className="mt-4 h-px" style={{ background: "rgba(255,255,255,0.7)" }} />

      <div className="flex py-3.5">
        {stats.map((s, i) => (
          <div
            key={i}
            className="flex-1 text-center"
            style={{ borderRight: i < 2 ? "1px solid rgba(255,255,255,0.7)" : "none" }}
          >
            <div className="text-[16px] leading-none font-extrabold text-[#3D2C5F]">{s.v}</div>
            <div className="mt-1 text-[10px] font-semibold tracking-[0.02em] text-[#7B6A9B]">
              {s.c}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PlanTimingSection({
  settings,
  weekMode,
}: {
  settings: UserSettings;
  weekMode: { currentWeekOverride: number | null; todayAutoWeek: number };
}) {
  const [optimisticOverride, setOptimisticOverride] = useOptimistic(weekMode.currentWeekOverride);
  const [isPending, startTransition] = useTransition();
  const isManual = optimisticOverride !== null;
  const activeWeek = optimisticOverride ?? weekMode.todayAutoWeek;

  const setWeek = (week: 1 | 2 | 3 | 4 | null) => {
    startTransition(async () => {
      setOptimisticOverride(week);
      await setWeekOverrideAction(week);
    });
  };

  return (
    <>
      <SectionHeader>📅 გეგმის თარიღი</SectionHeader>
      <SettingsCard>
        <SettingRow
          label="დაწყების თარიღი"
          right={
            <span className="text-[13.5px] font-bold text-[#3D2C5F]">
              {formatPlanStartDate(settings.planStartDate)}
            </span>
          }
        />

        <div className="px-[18px] py-[14px]">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[13.5px] font-semibold text-[#3D2C5F]">მიმდინარე კვირა</span>
            <div className="flex gap-0.5 rounded-full p-[3px]" style={{ background: "#F8F2FB" }}>
              {([1, 2, 3, 4] as const).map((n) => {
                const active = n === activeWeek;
                return (
                  <button
                    key={n}
                    type="button"
                    disabled={isPending}
                    onClick={() => setWeek(n === optimisticOverride ? null : n)}
                    className="flex h-6 w-7 items-center justify-center rounded-full text-[11px] font-extrabold disabled:opacity-60"
                    style={
                      active
                        ? {
                            background: "linear-gradient(135deg, #FFD66B 0%, #FF9EC5 100%)",
                            color: "#fff",
                            boxShadow: "0 2px 6px rgba(255,158,197,0.4)",
                          }
                        : { color: "#9785B5" }
                    }
                  >
                    {n}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between gap-3">
            <span className="text-[12px] font-semibold text-[#7B6A9B]">
              ავტომატური — შეგიძლია ხელით შეცვალო
            </span>
            <button
              type="button"
              disabled={isPending}
              onClick={() => setWeek(isManual ? null : (weekMode.todayAutoWeek as 1 | 2 | 3 | 4))}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#EADCF5] px-2.5 py-[3px] text-[10.5px] font-bold text-[#5A3A8B] disabled:opacity-60"
              style={{
                background: "rgba(255,255,255,0.85)",
                backdropFilter: "blur(6px)",
                whiteSpace: "nowrap",
              }}
            >
              <span
                className="h-[7px] w-[7px] rounded-full"
                style={{ background: isManual ? "#FF9EC5" : "#7DDFA8" }}
              />
              {isManual ? "ხელით" : "ავტო"}
            </button>
          </div>
        </div>
      </SettingsCard>
    </>
  );
}

function NotificationsSection({ settings }: { settings: UserSettings }) {
  type NotifState = Pick<
    UserSettings,
    "notifMeals" | "notifWorkouts" | "notifWater" | "notifWeight"
  >;

  const [optimistic, setOptimistic] = useOptimistic<NotifState>({
    notifMeals: settings.notifMeals,
    notifWorkouts: settings.notifWorkouts,
    notifWater: settings.notifWater,
    notifWeight: settings.notifWeight,
  });
  const [isPending, startTransition] = useTransition();

  const toggle = (key: NotifKey) => {
    startTransition(async () => {
      const newVal = !optimistic[key];
      setOptimistic((prev) => ({ ...prev, [key]: newVal }));
      await updateNotifAction(key, newVal);
    });
  };

  const rows: { key: NotifKey; label: string; footer?: string }[] = [
    { key: "notifMeals", label: "🍽 კვების შეხსენებები" },
    { key: "notifWorkouts", label: "💪 ვარჯიშის შეხსენებები" },
    { key: "notifWater", label: "💧 წყლის შეხსენებები" },
    { key: "notifWeight", label: "⚖️ წონის შეხსენება", footer: "ყოველდღე 8:00-ზე" },
  ];

  return (
    <>
      <SectionHeader>🔔 შეტყობინებები</SectionHeader>
      <SettingsCard>
        {rows.map(({ key, label, footer }) => (
          <SettingRow
            key={key}
            label={label}
            right={
              <IOSSwitch on={optimistic[key]} onChange={() => toggle(key)} disabled={isPending} />
            }
            {...(footer ? { footer } : {})}
          />
        ))}
      </SettingsCard>

      <div
        className="relative z-1 mx-[18px] mt-3 rounded-[20px] border px-4 py-3.5 text-[11.5px] leading-relaxed font-medium"
        style={{
          background: "#E7F8EE",
          borderColor: "rgba(125,223,168,0.35)",
          color: "#2E6B47",
        }}
      >
        💡 iOS-ზე — დაამატე ეკრანზე ხატულა, რომ შეტყობინებები მუშაობდეს
      </div>

      <SettingsCard>
        <SettingRow
          label="📱 Onboarding-ის ხელახლა გაშვება"
          right={<ChevronRight color="#C9A8E8" />}
          onClick={() => {
            localStorage.removeItem("fitplan_onb_done");
            window.dispatchEvent(new Event("fitplan:onboarding-restart"));
          }}
        />
      </SettingsCard>
    </>
  );
}

function AppearanceSection({ settings }: { settings: UserSettings }) {
  const [optimisticTheme, setOptimisticTheme] = useOptimistic<Theme>(settings.theme);
  const [isPending, startTransition] = useTransition();

  const setTheme = (t: Theme) => {
    startTransition(async () => {
      setOptimisticTheme(t);
      await updateThemeAction(t);
    });
  };

  const options: { key: Theme; label: string }[] = [
    { key: "light", label: "☀️ ღია" },
    { key: "dark", label: "🌙 მუქი" },
    { key: "system", label: "⚙️ ავტო" },
  ];

  return (
    <>
      <SectionHeader>🎨 გარეგნობა</SectionHeader>
      <SettingsCard>
        <div className="flex items-center justify-between gap-3 px-[18px] py-[14px]">
          <span className="text-[13.5px] font-semibold text-[#3D2C5F]">თემა</span>
          <div className="flex gap-0.5 rounded-full p-[3px]" style={{ background: "#F8F2FB" }}>
            {options.map(({ key, label }) => {
              const active = optimisticTheme === key;
              return (
                <button
                  key={key}
                  type="button"
                  disabled={isPending}
                  onClick={() => setTheme(key)}
                  className="rounded-full px-2.5 py-[5px] text-[10.5px] font-bold whitespace-nowrap disabled:opacity-60"
                  style={
                    active
                      ? {
                          background: "linear-gradient(135deg, #FFD66B 0%, #FF9EC5 100%)",
                          color: "#fff",
                          boxShadow: "0 2px 6px rgba(255,158,197,0.4)",
                        }
                      : { color: "#9785B5" }
                  }
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </SettingsCard>
    </>
  );
}

function DangerZoneSection() {
  const router = useRouter();
  const [resetting, setResetting] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleReset = async () => {
    if (!window.confirm("გეგმა გადაიტვირთება და კვირა 1-ზე დაბრუნდება. გაგრძელება?")) return;
    setResetting(true);
    try {
      await resetPlanAction();
      router.refresh();
    } finally {
      setResetting(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const { csv } = await exportUserDataAction();
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "fitplan-export.csv";
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  const actions = [
    {
      icon: "🔄",
      label: "გეგმის ნაგულისხმევზე დაბრუნება",
      onClick: handleReset,
      loading: resetting,
      destructive: false,
    },
    {
      icon: "📤",
      label: "მონაცემების ექსპორტი (CSV)",
      onClick: handleExport,
      loading: exporting,
      destructive: false,
    },
    {
      icon: "🚪",
      label: "გასვლა",
      onClick: () => router.push("/"),
      loading: false,
      destructive: true,
    },
  ];

  return (
    <>
      <SectionHeader muted>⚠️ მართვა</SectionHeader>
      <SettingsCard muted>
        {actions.map(({ icon, label, onClick, loading, destructive }) => (
          <button
            key={label}
            type="button"
            onClick={onClick}
            disabled={loading}
            className="flex w-full items-center justify-between gap-3 px-[18px] py-[14px] disabled:opacity-60"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="text-[16px]">{icon}</span>
              <span
                className="text-[13px]"
                style={{
                  fontWeight: destructive ? 700 : 600,
                  color: destructive ? "#C04A7E" : "#3D2C5F",
                }}
              >
                {loading ? "..." : label}
              </span>
            </div>
            <ChevronRight color={destructive ? "#C04A7E" : "#B7AAD0"} />
          </button>
        ))}
      </SettingsCard>
    </>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export function ProfileScreen({
  user,
  settings,
  weekMode,
  weightHistory,
  adherencePct,
  daysSinceStart,
}: Props) {
  const [targetsOpen, setTargetsOpen] = useState(false);
  const [goalOpen, setGoalOpen] = useState(false);

  const targetWeightKg = settings.targetWeightKg != null ? Number(settings.targetWeightKg) : null;

  const waterL = Number(settings.waterTargetL);
  const progress =
    weightHistory.length >= 2 && targetWeightKg != null
      ? (() => {
          const start = weightHistory[0]!.kg;
          const current = weightHistory[weightHistory.length - 1]!.kg;
          const total = Math.abs(start - targetWeightKg);
          if (total === 0) return null;
          const done = Math.abs(start - current);
          const pct = Math.round((done / total) * 100);
          const delta = (current - start).toFixed(1);
          return { pct, delta };
        })()
      : null;

  return (
    <>
      {/* Title row */}
      <header className="relative z-1 flex items-center justify-between px-[22px] pt-3.5 pb-2">
        <h1 className="text-h1 text-ink font-extrabold">
          პროფილი <span>⚙️</span>
        </h1>
        <button
          aria-label="ინფო"
          className="flex h-9 w-9 items-center justify-center rounded-full text-[16px] font-extrabold text-[#5A3A8B] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-pink)]"
          style={{
            background: "rgba(255,255,255,0.65)",
            border: "1.5px solid #C9A8E8",
            backdropFilter: "blur(8px)",
          }}
        >
          ⓘ
        </button>
      </header>

      {/* Identity card */}
      <IdentityCard
        user={user}
        weightHistory={weightHistory}
        adherencePct={adherencePct}
        daysSinceStart={daysSinceStart}
        weekMode={weekMode}
      />

      {/* Daily targets */}
      <SectionHeader>🎯 დღიური სამიზნე</SectionHeader>
      <SettingsCard>
        <SettingRow
          label="კალორია"
          right={<ValueWithPencil value={`${settings.calorieTarget} კკალ`} />}
          onClick={() => setTargetsOpen(true)}
        />
        <SettingRow
          label="ცილა"
          right={<DotValue color="#7DDFA8" value={`${settings.pTarget} გ`} />}
          onClick={() => setTargetsOpen(true)}
        />
        <SettingRow
          label="ნახშირწყლები"
          right={<DotValue color="#FFD66B" value={`${settings.nTarget} გ`} />}
          onClick={() => setTargetsOpen(true)}
        />
        <SettingRow
          label="ცხიმი"
          right={<DotValue color="#FF9EC5" value={`${settings.fTarget} გ`} />}
          onClick={() => setTargetsOpen(true)}
        />
        <SettingRow
          label="წყალი"
          right={
            <DotValue
              color="#7CC7FF"
              value={`${waterL % 1 === 0 ? waterL : waterL.toFixed(2)} ლ`}
            />
          }
          footer="1 ჭიქა = 250 მლ"
          onClick={() => setTargetsOpen(true)}
        />
      </SettingsCard>

      {/* Goal */}
      <SectionHeader>✨ მიზანი</SectionHeader>
      <SettingsCard>
        <SettingRow
          label="სამიზნე წონა"
          right={
            <span className="text-[13.5px] font-bold text-[#3D2C5F]">
              {targetWeightKg != null ? `${targetWeightKg} კგ` : "—"}
            </span>
          }
          onClick={() => setGoalOpen(true)}
        />
        <SettingRow
          label="ვადა"
          right={<span className="text-[13.5px] font-bold text-[#3D2C5F]">4 კვირაში</span>}
        />
        {progress != null && (
          <SettingRow
            label="მიღწეული"
            right={
              <span
                className="rounded-full px-2.5 py-1 text-[11px] font-bold"
                style={{ background: "#E7F8EE", color: "#2E8B57", whiteSpace: "nowrap" }}
              >
                ✨ {progress.pct}% ({Number(progress.delta) > 0 ? "+" : ""}
                {progress.delta} კგ)
              </span>
            }
          />
        )}
      </SettingsCard>

      {/* Plan timing */}
      <PlanTimingSection settings={settings} weekMode={weekMode} />

      {/* Notifications */}
      <NotificationsSection settings={settings} />

      {/* Appearance */}
      <AppearanceSection settings={settings} />

      {/* Danger zone */}
      <DangerZoneSection />

      {/* Footer */}
      <div className="relative z-1 mt-6 flex flex-col items-center gap-1 px-[22px]">
        <div className="text-[10.5px] font-semibold text-[#B7AAD0]">Fit Plan · v0.1.0</div>
        <div className="text-[10px] font-medium text-[#B7AAD0]">❤️ Made for {user.name}</div>
      </div>

      <div className="h-4" />

      {/* Sheets */}
      <DailyTargetsSheet
        open={targetsOpen}
        onOpenChange={setTargetsOpen}
        defaults={{
          calorieTarget: settings.calorieTarget,
          pTarget: settings.pTarget,
          nTarget: settings.nTarget,
          fTarget: settings.fTarget,
          waterTargetL: waterL,
        }}
      />

      <GoalSheet open={goalOpen} onOpenChange={setGoalOpen} defaultKg={targetWeightKg} />
    </>
  );
}
