"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { TabIcon, type TabIconName } from "./TabIcon";

type Tab = {
  key: string;
  href: string;
  label: string;
  icon: TabIconName;
};

const TABS: readonly Tab[] = [
  { key: "today", href: "/", label: "დღეს", icon: "today" },
  { key: "plan", href: "/plan", label: "გეგმა", icon: "plan" },
  { key: "meals", href: "/meals", label: "კვება", icon: "food" },
  { key: "progress", href: "/progress", label: "პროგრესი", icon: "progress" },
  { key: "profile", href: "/profile", label: "პროფილი", icon: "profile" },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="მთავარი ნავიგაცია"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-[480px] px-3 pt-2.5"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 16px)" }}
    >
      <ul
        className="border-surface/80 pointer-events-auto flex items-center justify-around rounded-[28px] border bg-white/85 px-1 py-2.5 backdrop-blur-xl"
        style={{ boxShadow: "0 6px 24px rgba(201, 168, 232, 0.25)" }}
      >
        {TABS.map((tab) => {
          const active = isActive(pathname, tab.href);
          return (
            <li key={tab.key} className="flex-1">
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className="flex flex-col items-center gap-[3px] py-0.5 outline-none focus-visible:rounded-2xl focus-visible:ring-2 focus-visible:ring-[var(--color-brand-pink)]"
              >
                <span
                  className={`flex h-7 w-9 items-center justify-center rounded-[14px] ${
                    active ? "text-white" : "text-ink-mute"
                  }`}
                  style={active ? { background: "var(--gradient-tab-active)" } : undefined}
                >
                  <TabIcon name={tab.icon} size={18} />
                </span>
                <span
                  className={`text-[9.5px] leading-none ${
                    active ? "text-ink font-bold" : "text-ink-mute font-semibold"
                  }`}
                >
                  {tab.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
