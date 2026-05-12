import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mockSetWater = vi.fn().mockResolvedValue({ ok: true });
vi.mock("@/app/(app)/today/actions", () => ({
  setWaterGlassesAction: (glasses: number) => mockSetWater(glasses),
}));

import { WaterTracker } from "@/components/today/WaterTracker";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
}

function renderTracker(initialGlasses = 3, total = 8, targetL = 2) {
  const { container } = render(
    <QueryClientProvider client={makeQueryClient()}>
      <WaterTracker initialGlasses={initialGlasses} total={total} targetL={targetL} />
    </QueryClientProvider>,
  );
  return { container };
}

describe("WaterTracker", () => {
  beforeEach(() => {
    mockSetWater.mockClear();
  });

  it("renders the correct number of glass buttons", () => {
    renderTracker();
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(8);
  });

  it("group has aria-label matching glasses/total when initialGlasses=3", () => {
    renderTracker(3, 8, 2);
    expect(screen.getByRole("group", { name: "წყალი: 3/8 ჭიქა" })).toBeInTheDocument();
  });

  it("buttons 0-2 are aria-pressed=true and buttons 3-7 are aria-pressed=false when initialGlasses=3", () => {
    renderTracker(3, 8, 2);
    const buttons = screen.getAllByRole("button");
    buttons.slice(0, 3).forEach((btn) => {
      expect(btn).toHaveAttribute("aria-pressed", "true");
    });
    buttons.slice(3).forEach((btn) => {
      expect(btn).toHaveAttribute("aria-pressed", "false");
    });
  });

  it("clicking an unfilled glass at index 3 updates label to 4/8 and calls action with 4", async () => {
    const user = userEvent.setup();
    renderTracker(3, 8, 2);
    const buttons = screen.getAllByRole("button");
    await user.click(buttons[3]!);
    expect(screen.getByRole("group", { name: "წყალი: 4/8 ჭიქა" })).toBeInTheDocument();
    await waitFor(() => expect(mockSetWater).toHaveBeenCalledWith(4));
  });

  it("clicking the last filled glass (index 2) updates label to 2/8 and calls action with 2", async () => {
    const user = userEvent.setup();
    renderTracker(3, 8, 2);
    const buttons = screen.getAllByRole("button");
    await user.click(buttons[2]!);
    expect(screen.getByRole("group", { name: "წყალი: 2/8 ჭიქა" })).toBeInTheDocument();
    await waitFor(() => expect(mockSetWater).toHaveBeenCalledWith(2));
  });

  it("clicking glass at index 0 (filled, 3 filled total) sets glasses to 0", async () => {
    const user = userEvent.setup();
    renderTracker(3, 8, 2);
    const buttons = screen.getAllByRole("button");
    await user.click(buttons[0]!);
    expect(screen.getByRole("group", { name: "წყალი: 0/8 ჭიქა" })).toBeInTheDocument();
    await waitFor(() => expect(mockSetWater).toHaveBeenCalledWith(0));
  });
});
