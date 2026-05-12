import type { SVGProps } from "react";

export type TabIconName = "today" | "plan" | "food" | "progress" | "profile";

type TabIconProps = Omit<SVGProps<SVGSVGElement>, "name"> & {
  name: TabIconName;
  size?: number;
  strokeWidth?: number;
};

export function TabIcon({ name, size = 18, strokeWidth = 1.7, ...rest }: TabIconProps) {
  const stroke = {
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    "aria-hidden": true,
    focusable: false,
    ...rest,
  } as SVGProps<SVGSVGElement>;

  switch (name) {
    case "today":
      return (
        <svg {...common}>
          <rect x="3.5" y="5" width="17" height="15" rx="2.5" {...stroke} />
          <path d="M3.5 9.5h17M8 3v4M16 3v4" {...stroke} />
          <circle cx="12" cy="14" r="1.2" fill="currentColor" stroke="none" />
        </svg>
      );
    case "plan":
      return (
        <svg {...common}>
          <path d="M5 4h11l3 3v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" {...stroke} />
          <path d="M8 11h8M8 15h6M8 7h5" {...stroke} />
        </svg>
      );
    case "food":
      return (
        <svg {...common}>
          <path
            d="M6 4v8a3 3 0 0 0 3 3v6M9 4v6M12 4v6M18 4c-1.5 1-2.5 3-2.5 6S16.5 14 18 14v7"
            {...stroke}
          />
        </svg>
      );
    case "progress":
      return (
        <svg {...common}>
          <path d="M4 20V8M10 20v-9M16 20V4M22 20H2" {...stroke} />
        </svg>
      );
    case "profile":
      return (
        <svg {...common}>
          <circle cx="12" cy="8.5" r="3.8" {...stroke} />
          <path d="M4.5 20c1.2-3.8 4.2-5.8 7.5-5.8s6.3 2 7.5 5.8" {...stroke} />
        </svg>
      );
  }
}
