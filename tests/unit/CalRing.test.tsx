import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// WaterTracker (used by SnapshotCard) calls the server action — mock it before any imports
vi.mock("@/app/(app)/today/actions", () => ({
  setWaterGlassesAction: vi.fn().mockResolvedValue({ ok: true }),
}));

import { CalRing } from "@/components/today/CalRing";
import { SnapshotCard } from "@/components/today/SnapshotCard";

// ─── helpers ────────────────────────────────────────────────────────────────

const DEFAULT_SIZE = 114;
const DEFAULT_STROKE = 13;

function circumference(size = DEFAULT_SIZE, stroke = DEFAULT_STROKE) {
  const r = (size - stroke) / 2;
  return 2 * Math.PI * r;
}

function getProgressCircle(container: HTMLElement) {
  return container.querySelectorAll("circle")[1]!;
}

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
}

function renderSnapshotCard(props: Partial<Parameters<typeof SnapshotCard>[0]> = {}) {
  const defaults = {
    kcalEaten: 500,
    kcalGoal: 2000,
    macros: [
      { key: "P" as const, short: "ც", value: 50, goal: 100, unit: "გ" },
      { key: "N" as const, short: "ნ", value: 30, goal: 100, unit: "გ" },
      { key: "F" as const, short: "ც", value: 20, goal: 100, unit: "გ" },
    ],
    waterGlasses: 3,
    waterGlassesTotal: 8,
    waterTargetL: 2,
    ...props,
  };
  const { container } = render(
    <QueryClientProvider client={makeQueryClient()}>
      <SnapshotCard {...defaults} />
    </QueryClientProvider>,
  );
  return { container };
}

// ─── CalRing ────────────────────────────────────────────────────────────────

describe("CalRing", () => {
  it("strokeDasharray equals the circumference regardless of pct", () => {
    const { container } = render(<CalRing pct={0.5} />);
    const circle = getProgressCircle(container);
    const c = circumference();
    expect(parseFloat(circle.getAttribute("stroke-dasharray")!)).toBeCloseTo(c, 5);
  });

  it("strokeDashoffset ≈ c * 0.4 when pct=0.6", () => {
    const { container } = render(<CalRing pct={0.6} />);
    const circle = getProgressCircle(container);
    const c = circumference();
    const offset = parseFloat(circle.getAttribute("stroke-dashoffset")!);
    expect(offset).toBeCloseTo(c * 0.4, 5);
  });

  it("strokeDashoffset ≈ 0 when pct=1 (full ring)", () => {
    const { container } = render(<CalRing pct={1} />);
    const circle = getProgressCircle(container);
    const offset = parseFloat(circle.getAttribute("stroke-dashoffset")!);
    expect(offset).toBeCloseTo(0, 5);
  });

  it("strokeDashoffset ≈ circumference when pct=0 (empty ring)", () => {
    const { container } = render(<CalRing pct={0} />);
    const circle = getProgressCircle(container);
    const c = circumference();
    const offset = parseFloat(circle.getAttribute("stroke-dashoffset")!);
    expect(offset).toBeCloseTo(c, 5);
  });

  it("clamps pct > 1 — offset is 0 (ring full)", () => {
    const { container } = render(<CalRing pct={2.5} />);
    const circle = getProgressCircle(container);
    const offset = parseFloat(circle.getAttribute("stroke-dashoffset")!);
    expect(offset).toBeCloseTo(0, 5);
  });

  it("clamps pct < 0 — offset equals circumference (ring empty)", () => {
    const { container } = render(<CalRing pct={-1} />);
    const circle = getProgressCircle(container);
    const c = circumference();
    const offset = parseFloat(circle.getAttribute("stroke-dashoffset")!);
    expect(offset).toBeCloseTo(c, 5);
  });

  it("renders children in the overlay div", () => {
    render(
      <CalRing pct={0.5}>
        <span>420 კკალ</span>
      </CalRing>,
    );
    expect(screen.getByText("420 კკალ")).toBeInTheDocument();
  });
});

// ─── SnapshotCard macro bars ─────────────────────────────────────────────────

describe("SnapshotCard macro bars", () => {
  it("renders bar widths 50%, 30%, 20% for P=50/100, N=30/100, F=20/100", () => {
    const { container } = renderSnapshotCard({
      macros: [
        { key: "P", short: "ც", value: 50, goal: 100, unit: "გ" },
        { key: "N", short: "ნ", value: 30, goal: 100, unit: "გ" },
        { key: "F", short: "ც", value: 20, goal: 100, unit: "გ" },
      ],
    });
    const items = container.querySelectorAll("li");
    // Each <li> in the macro list has a track div wrapping an inner fill div
    const widths = Array.from(items).map((li) => {
      // The inner div with the actual fill width
      const inner = li.querySelector("div > div") as HTMLElement;
      return inner?.style.width;
    });
    expect(widths[0]).toBe("50%");
    expect(widths[1]).toBe("30%");
    expect(widths[2]).toBe("20%");
  });

  it("clamps bar width to 100% when value > goal", () => {
    const { container } = renderSnapshotCard({
      macros: [
        { key: "P", short: "ც", value: 200, goal: 100, unit: "გ" },
        { key: "N", short: "ნ", value: 30, goal: 100, unit: "გ" },
        { key: "F", short: "ც", value: 20, goal: 100, unit: "გ" },
      ],
    });
    const items = container.querySelectorAll("li");
    const firstInner = items[0]!.querySelector("div > div") as HTMLElement;
    expect(firstInner.style.width).toBe("100%");
  });

  it("renders bar width 0% when goal is 0", () => {
    const { container } = renderSnapshotCard({
      macros: [
        { key: "P", short: "ც", value: 50, goal: 0, unit: "გ" },
        { key: "N", short: "ნ", value: 30, goal: 100, unit: "გ" },
        { key: "F", short: "ც", value: 20, goal: 100, unit: "გ" },
      ],
    });
    const items = container.querySelectorAll("li");
    const firstInner = items[0]!.querySelector("div > div") as HTMLElement;
    expect(firstInner.style.width).toBe("0%");
  });
});
