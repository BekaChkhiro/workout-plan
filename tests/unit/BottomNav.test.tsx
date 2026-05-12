import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { BottomNav } from "@/components/BottomNav";

const usePathnameMock = vi.fn<() => string>();

vi.mock("next/navigation", () => ({
  usePathname: () => usePathnameMock(),
}));

const TAB_LABELS = ["დღეს", "გეგმა", "კვება", "პროგრესი", "პროფილი"];

function renderAt(pathname: string) {
  usePathnameMock.mockReturnValue(pathname);
  return render(<BottomNav />);
}

describe("BottomNav", () => {
  it("renders all 5 tabs with hrefs in the canonical order", () => {
    renderAt("/");

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(5);
    expect(links.map((a) => a.getAttribute("href"))).toEqual([
      "/",
      "/plan",
      "/meals",
      "/progress",
      "/profile",
    ]);
    expect(links.map((a) => a.textContent)).toEqual(TAB_LABELS);
  });

  it("marks the Today tab active only on the exact `/` route", () => {
    renderAt("/");

    const today = screen.getByRole("link", { name: /დღეს/ });
    expect(today).toHaveAttribute("aria-current", "page");

    // No other tab is active.
    for (const label of TAB_LABELS.slice(1)) {
      const link = screen.getByRole("link", { name: new RegExp(label) });
      expect(link).not.toHaveAttribute("aria-current");
    }
  });

  it("marks the Plan tab active on /plan and nested routes, leaving Today inactive", () => {
    renderAt("/plan");
    expect(screen.getByRole("link", { name: /გეგმა/ })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: /დღეს/ })).not.toHaveAttribute("aria-current");
  });

  it("treats nested paths as still inside the parent tab (e.g. /meals/abc → Meals)", () => {
    renderAt("/meals/abc");
    expect(screen.getByRole("link", { name: /კვება/ })).toHaveAttribute("aria-current", "page");
    // The `/` tab does NOT match `/meals/abc` even though `/` is a prefix.
    expect(screen.getByRole("link", { name: /დღეს/ })).not.toHaveAttribute("aria-current");
  });

  it("exposes a labelled <nav> landmark", () => {
    renderAt("/");
    expect(screen.getByRole("navigation", { name: /მთავარი ნავიგაცია/ })).toBeInTheDocument();
  });
});
