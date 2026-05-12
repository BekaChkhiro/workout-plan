"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useState } from "react";

import type { MealWithDetails } from "@/db/queries";

type MealSlot = {
  bg: string;
  color: string;
  emoji: string;
};

const SLOTS: readonly MealSlot[] = [
  { bg: "#FFF5DA", color: "#A47000", emoji: "🍳" },
  { bg: "#FFE6F0", color: "#C04A7E", emoji: "🫐" },
  { bg: "#E8DFF7", color: "#5A3A8B", emoji: "🍗" },
  { bg: "#FFE6F0", color: "#C04A7E", emoji: "🥜" },
  { bg: "#F4ECFA", color: "#5A4275", emoji: "🥗" },
];

const MACRO_COLORS = [
  { label: "ცილა", key: "pG", color: "#7DDFA8", bg: "#E7F8EE" },
  { label: "ნახშირწყლები", key: "nG", color: "#FFD66B", bg: "#FFF5DA" },
  { label: "ცხიმი", key: "fG", color: "#FF9EC5", bg: "#FFE6F0" },
] as const;

const SPRING = { type: "spring", stiffness: 260, damping: 28 } as const;

function ChevDown({ size = 14, color = "#B7AAD0" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" aria-hidden focusable={false}>
      <path
        d="M3 5l4 4 4-4"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevUp({ size = 14, color = "#7B4FA8" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" aria-hidden focusable={false}>
      <path
        d="M3 9l4-4 4 4"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TimeBlock({
  time,
  label,
  slot,
  badge,
}: {
  time: string;
  label: string;
  slot: MealSlot;
  badge?: string;
}) {
  return (
    <div className="relative flex-shrink-0">
      <div
        className="flex h-14 w-14 flex-col items-center justify-center rounded-2xl"
        style={{
          background: slot.bg,
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.5)",
        }}
      >
        <div
          className="text-[14px] leading-none font-extrabold tracking-tight"
          style={{ color: slot.color }}
        >
          {time}
        </div>
        <div
          className="mt-1 text-[9px] font-bold tracking-wide opacity-75"
          style={{ color: slot.color }}
        >
          {label}
        </div>
      </div>
      {badge ? (
        <div
          className="absolute -top-1.5 -right-2.5 rounded-full px-[7px] py-[3px] text-[8.5px] font-extrabold tracking-wide whitespace-nowrap"
          style={{
            background: "#FFD66B",
            color: "#5A3A0A",
            boxShadow: "0 2px 5px rgba(255,214,107,0.5)",
          }}
        >
          {badge}
        </div>
      ) : null}
    </div>
  );
}

export function MealsList({ meals }: { meals: MealWithDetails[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const biggestId = meals.reduce<MealWithDetails | null>(
    (max, m) => (!max || m.calories > max.calories ? m : max),
    null,
  )?.id;

  if (meals.length === 0) {
    return (
      <div className="text-ink-soft px-[18px] py-10 text-center text-sm">
        ამ დღისთვის კვება ჯერ არ არის გეგმაში.
      </div>
    );
  }

  return (
    <LayoutGroup>
      <ul className="relative z-1 flex flex-col gap-3 px-[18px]">
        {meals.map((meal, idx) => {
          const slot = SLOTS[idx] ?? SLOTS[SLOTS.length - 1]!;
          const open = expandedId === meal.id;
          const isPreworkout = meal.name === "ვარჯიშამდე";
          const isBiggest = meal.id === biggestId;
          const macroValues: Record<(typeof MACRO_COLORS)[number]["key"], number> = {
            pG: meal.pG,
            nG: meal.nG,
            fG: meal.fG,
          };
          const macroMax = Math.max(meal.pG, meal.nG, meal.fG, 1);

          return (
            <motion.li
              key={meal.id}
              layout
              transition={SPRING}
              className="bg-surface rounded-[28px]"
              style={{
                border: open ? "2px solid #C9A8E8" : "1px solid rgba(244,236,250,0.8)",
                boxShadow: open
                  ? "0 12px 32px rgba(255,158,197,0.28), 0 4px 12px rgba(201,168,232,0.18)"
                  : "0 2px 8px rgba(201,168,232,0.10)",
              }}
            >
              <motion.button
                layout
                type="button"
                onClick={() => setExpandedId(open ? null : meal.id)}
                aria-expanded={open}
                aria-controls={`meal-${meal.id}-details`}
                className="flex w-full items-center gap-3 rounded-[28px] px-[14px] py-[13px] text-left outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-lilac)]"
              >
                {isPreworkout ? (
                  <TimeBlock time={meal.time} label={meal.name} slot={slot} badge="⚡ ვარჯიშამდე" />
                ) : (
                  <TimeBlock time={meal.time} label={meal.name} slot={slot} />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[16px]">{slot.emoji}</span>
                    <span className="text-ink text-[15px] font-extrabold">{meal.name}</span>
                  </div>
                  <div className="text-ink-soft mt-[3px] truncate text-[11.5px] font-medium">
                    {meal.summary}
                  </div>
                </div>
                <div className="flex flex-shrink-0 flex-col items-end gap-1">
                  <div className="text-ink text-[15px] leading-none font-extrabold">
                    {meal.calories}
                  </div>
                  <div className="text-ink-mute text-[9.5px] font-bold tracking-wider">კკალ</div>
                  <motion.div animate={{ rotate: open ? 180 : 0 }} transition={SPRING}>
                    <ChevDown />
                  </motion.div>
                </div>
              </motion.button>

              <AnimatePresence initial={false}>
                {open ? (
                  <motion.div
                    key="details"
                    id={`meal-${meal.id}-details`}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="px-[22px] pb-5"
                  >
                    <div className="relative pt-2">
                      <button
                        type="button"
                        aria-label="დახურვა"
                        onClick={() => setExpandedId(null)}
                        className="absolute -top-1 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-[#F4ECFA] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-lilac)]"
                      >
                        <ChevUp />
                      </button>

                      <div className="flex items-center gap-3.5 pr-9">
                        <TimeBlock time={meal.time} label={meal.name} slot={slot} />
                        <div className="min-w-0 flex-1 text-[30px] leading-none">{slot.emoji}</div>
                        <div className="text-right">
                          {isBiggest ? (
                            <div
                              className="mb-0.5 text-[10px] font-bold tracking-wide"
                              style={{ color: "#C04A7E" }}
                            >
                              ყველაზე დიდი კვება
                            </div>
                          ) : null}
                          <div className="text-ink text-[18px] font-extrabold">
                            {meal.calories}{" "}
                            <span className="text-ink-soft text-[11px] font-bold">კკალ</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3.5">
                        <div className="text-ink text-[18px] leading-tight font-extrabold">
                          {meal.summary}
                        </div>
                      </div>

                      {meal.ingredients.length > 0 ? (
                        <section className="mt-4 border-t border-dashed border-[#EADCF5] pt-3.5">
                          <div
                            className="mb-2.5 text-[10px] font-bold tracking-widest uppercase"
                            style={{ color: "#7B4FA8" }}
                          >
                            🧾 ინგრედიენტები
                          </div>
                          <ul className="flex flex-col gap-2">
                            {meal.ingredients.map((ing) => (
                              <li key={ing.id} className="flex items-center gap-2.5">
                                <span className="h-[5px] w-[5px] flex-shrink-0 rounded-full bg-[var(--color-brand-lilac)]" />
                                <span className="text-ink flex-1 text-[13px] font-semibold">
                                  {ing.name}
                                </span>
                                <span className="text-ink-soft text-[11.5px] font-semibold whitespace-nowrap">
                                  {ing.amount}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </section>
                      ) : null}

                      <section className="mt-4 border-t border-dashed border-[#EADCF5] pt-3.5">
                        <div
                          className="mb-2.5 text-[10px] font-bold tracking-widest uppercase"
                          style={{ color: "#7B4FA8" }}
                        >
                          📊 ამ კვების მაკროები
                        </div>
                        <div className="flex gap-2.5">
                          {MACRO_COLORS.map((m) => {
                            const value = macroValues[m.key];
                            return (
                              <div key={m.key} className="flex-1">
                                <div className="text-ink mb-1 text-[10px] font-bold">{m.label}</div>
                                <div
                                  className="h-1.5 rounded-full"
                                  style={{ background: m.bg }}
                                  aria-hidden
                                >
                                  <div
                                    className="h-full rounded-full"
                                    style={{
                                      background: m.color,
                                      width: `${Math.round((value / macroMax) * 100)}%`,
                                    }}
                                  />
                                </div>
                                <div className="text-ink-soft mt-1 text-[10px] font-semibold">
                                  {value} გ
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </section>

                      {meal.swaps.length > 0 ? (
                        <section className="mt-4 border-t border-dashed border-[#EADCF5] pt-3.5">
                          <div
                            className="mb-2.5 text-[10px] font-bold tracking-widest uppercase"
                            style={{ color: "#7B4FA8" }}
                          >
                            🔄 შემცვლელები
                          </div>
                          <div
                            className="-mx-[22px] flex gap-2 overflow-x-auto px-[22px]"
                            style={{ scrollbarWidth: "none" }}
                          >
                            {meal.swaps.map((swap) => (
                              <span
                                key={swap.id}
                                className="rounded-full border border-[#EADCF5] bg-white/95 px-3 py-1.5 text-[11.5px] font-bold whitespace-nowrap"
                                style={{
                                  color: "#5A4275",
                                  boxShadow: "0 1px 3px rgba(201,168,232,0.10)",
                                }}
                              >
                                {swap.name}
                              </span>
                            ))}
                          </div>
                        </section>
                      ) : null}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.li>
          );
        })}
      </ul>
    </LayoutGroup>
  );
}
