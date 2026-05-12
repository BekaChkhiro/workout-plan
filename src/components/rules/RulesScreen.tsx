"use client";

import { useRouter } from "next/navigation";

import { RULES_SECTIONS, type Rule, type RulesSection } from "@/content/rules";

export function RulesScreen() {
  const router = useRouter();

  return (
    <div className="relative flex flex-col pb-6">
      {/* Header */}
      <header className="relative z-1 flex items-center justify-between px-[18px] pt-1 pb-4">
        <button
          type="button"
          aria-label="უკან"
          onClick={() => router.back()}
          className="flex h-9 w-9 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-pink)]"
          style={{
            background: "rgba(255,255,255,0.65)",
            border: "1.5px solid #C9A8E8",
            backdropFilter: "blur(8px)",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" aria-hidden>
            <path
              d="M8 1.5L3 6.5L8 11.5"
              fill="none"
              stroke="#5A3A8B"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <h1 className="text-ink text-[19px] font-extrabold">წესები 📖</h1>

        <div
          className="flex h-9 w-9 items-center justify-center rounded-full text-[13px]"
          style={{
            background: "rgba(255,255,255,0.65)",
            border: "1.5px solid #C9A8E8",
            backdropFilter: "blur(8px)",
          }}
          aria-hidden
        >
          🔍
        </div>
      </header>

      <p className="text-caption text-ink-soft relative z-1 pb-4 text-center font-semibold">
        8 თემა · 24 წესი
      </p>

      {/* Hero intro card */}
      <div
        className="relative z-1 mx-[18px] overflow-hidden rounded-[28px] px-[22px] py-5"
        style={{
          background: "linear-gradient(135deg, #E8DFF7 0%, #FFE6F0 100%)",
          boxShadow: "var(--shadow-md)",
        }}
      >
        <span
          className="pointer-events-none absolute top-[-6px] right-1 text-[80px] leading-none"
          style={{ opacity: 0.18 }}
          aria-hidden
        >
          ✨
        </span>
        <p className="mb-1 text-[10.5px] font-bold tracking-[0.08em] text-[#7B4FA8] uppercase">
          გახსოვდეს
        </p>
        <h2 className="text-ink pr-12 text-[18px] leading-tight font-extrabold">
          მთავარი ცვლილება — 5-ჯერ ჭამა
        </h2>
        <p className="text-ink mt-2 pr-8 text-[12.5px] leading-relaxed font-medium">
          1-2-ჯერ ჭამიდან გადადი 5-ჯერ ჭამაზე. ეს ყველაზე ეფექტური ნაბიჯია მეტაბოლიზმის
          გასაუმჯობესებლად.
        </p>
      </div>

      {/* Sections */}
      {RULES_SECTIONS.map((section) => (
        <Section key={section.title} section={section} />
      ))}

      {/* Closing card */}
      <div
        className="relative z-1 mx-[18px] mt-6 overflow-hidden rounded-[28px] px-5 py-[22px]"
        style={{
          background: "linear-gradient(135deg, #E8DFF7 0%, #FFE6F0 100%)",
          boxShadow: "var(--shadow-md)",
        }}
      >
        <span
          className="pointer-events-none absolute top-[-4px] right-1.5 text-[60px] leading-none"
          style={{ opacity: 0.4 }}
          aria-hidden
        >
          ✨
        </span>
        <p className="mb-1 text-[10.5px] font-bold tracking-[0.08em] text-[#7B4FA8] uppercase">
          ფინიში
        </p>
        <h2 className="text-ink pr-10 text-[18px] leading-tight font-extrabold">
          4 კვირის შემდეგ — გადახედე გეგმას
        </h2>
        <p className="text-ink mt-2 text-[12.5px] leading-snug font-medium">
          ახალ წონასა და შედეგებს მიუსადაგე ახალი მიზნები
        </p>
        <button
          type="button"
          className="mt-4 w-full rounded-full py-3 text-[13px] font-bold text-[#7B4FA8]"
          style={{ border: "1.5px solid #C9A8E8", background: "transparent" }}
        >
          📋 ახალი გეგმის შექმნა
        </button>
      </div>

      {/* Footer */}
      <p className="text-ink-mute relative z-1 pt-7 pb-2 text-center text-[10.5px] font-medium">
        ✨ წყარო: კვებისა და ვარჯიშის გეგმის დოკუმენტი
      </p>
    </div>
  );
}

function Section({ section }: { section: RulesSection }) {
  return (
    <>
      <SectionHeader
        emoji={section.emoji}
        circleBg={section.circleBg}
        title={section.title}
        count={section.count}
      />
      {section.variant === "chips" ? (
        <ChipCloud chips={section.chips} />
      ) : (
        <RuleRows rules={section.rules} />
      )}
    </>
  );
}

function SectionHeader({
  emoji,
  circleBg,
  title,
  count,
}: {
  emoji: string;
  circleBg: string;
  title: string;
  count: string;
}) {
  return (
    <div className="relative z-1 mx-[22px] mt-6 mb-2 flex items-center gap-3">
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[17px]"
        style={{ background: circleBg }}
        aria-hidden
      >
        {emoji}
      </span>
      <span className="text-h2 text-ink flex-1 font-extrabold">{title}</span>
      <span className="text-ink-soft text-[10.5px] font-bold">{count}</span>
    </div>
  );
}

function RuleRows({ rules }: { rules: Rule[] }) {
  return (
    <ul
      className="relative z-1 mx-[18px] overflow-hidden rounded-[20px]"
      style={{
        background: "#FFFFFF",
        boxShadow: "var(--shadow-sm)",
        border: "1px solid rgba(244,236,250,0.8)",
      }}
    >
      {rules.map((rule, i) => (
        <li key={i}>
          {i > 0 && <div className="bg-surface-2 mx-4 h-px" />}
          <div className="flex items-start gap-3 px-4 py-3">
            <span
              className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[14px]"
              style={{ background: rule.tint }}
              aria-hidden
            >
              {rule.icon}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-ink text-[13px] leading-snug font-medium">{rule.text}</p>
              {rule.sub && (
                <p className="text-caption text-ink-soft mt-0.5 leading-snug font-medium">
                  {rule.sub}
                </p>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

function ChipCloud({ chips }: { chips: string[] }) {
  return (
    <div
      className="relative z-1 mx-[18px] flex flex-wrap gap-1.5 rounded-[20px] px-4 py-3.5"
      style={{
        background: "#FFFFFF",
        boxShadow: "var(--shadow-sm)",
        border: "1px solid rgba(244,236,250,0.8)",
      }}
    >
      {chips.map((chip) => (
        <span
          key={chip}
          className="rounded-full px-[13px] py-[7px] text-[12px] font-bold text-[#C04A7E]"
          style={{ background: "#FFE6F0" }}
        >
          {chip}
        </span>
      ))}
    </div>
  );
}
