import { createElement, type ReactNode } from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

type MotionProps = {
  layout?: unknown;
  initial?: unknown;
  animate?: unknown;
  exit?: unknown;
  transition?: unknown;
  children?: ReactNode;
} & Record<string, unknown>;

vi.mock("motion/react", () => ({
  motion: {
    li: ({
      layout: _l,
      initial: _i,
      animate: _a,
      exit: _e,
      transition: _t,
      children,
      ...rest
    }: MotionProps) => createElement("li", rest, children),
    div: ({
      layout: _l,
      initial: _i,
      animate: _a,
      exit: _e,
      transition: _t,
      children,
      ...rest
    }: MotionProps) => createElement("div", rest, children),
    span: ({
      layout: _l,
      initial: _i,
      animate: _a,
      exit: _e,
      transition: _t,
      children,
      ...rest
    }: MotionProps) => createElement("span", rest, children),
  },
  AnimatePresence: ({ children, initial: _i }: { children?: ReactNode; initial?: unknown }) =>
    children,
  LayoutGroup: ({ children }: { children?: ReactNode }) => children,
}));

vi.mock("@/app/(app)/meals/_components/MealEditorSheet", () => ({
  MealEditorSheet: () => null,
}));

const mockToggle = vi.fn().mockResolvedValue({ ok: true });
vi.mock("@/app/(app)/meals/actions", () => ({
  toggleMealCompleteAction: (mealId: string, completed: boolean) => mockToggle(mealId, completed),
  updateMealAction: vi.fn(),
}));

import { MealsList } from "@/app/(app)/meals/_components/MealsList";
import type { MealWithDetails } from "@/db/queries";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
}

function renderMeals(meals: MealWithDetails[]) {
  render(
    <QueryClientProvider client={makeQueryClient()}>
      <MealsList meals={meals} />
    </QueryClientProvider>,
  );
}

const BASE_MEAL: MealWithDetails = {
  id: "meal-1",
  userId: "user-1",
  dayType: "workout",
  time: "08:00",
  name: "საუზმე",
  summary: "შვრიის ფაფა",
  calories: 400,
  pG: 20,
  nG: 60,
  fG: 10,
  sortOrder: 1,
  completed: false,
  ingredients: [],
  swaps: [],
};

describe("MealsList", () => {
  beforeEach(() => {
    mockToggle.mockClear();
  });

  it("toggle button for incomplete meal has aria-pressed=false and aria-label matching /შესრულებულად მონიშნე/", () => {
    renderMeals([BASE_MEAL]);
    const btn = screen.getByRole("button", { name: /შესრულებულად მონიშნე/ });
    expect(btn).toHaveAttribute("aria-pressed", "false");
  });

  it("toggle button for completed meal has aria-pressed=true and aria-label matching /შესრულდა/", () => {
    renderMeals([{ ...BASE_MEAL, completed: true }]);
    const btn = screen.getByRole("button", { name: /შესრულდა/ });
    expect(btn).toHaveAttribute("aria-pressed", "true");
  });

  it("clicking toggle on incomplete meal optimistically flips aria-pressed to true", async () => {
    const user = userEvent.setup();
    renderMeals([BASE_MEAL]);
    const btn = screen.getByRole("button", { name: /შესრულებულად მონიშნე/ });
    await user.click(btn);
    // After optimistic update the button aria-label changes to the completed form
    const completedBtn = screen.getByRole("button", { name: /შესრულდა/ });
    expect(completedBtn).toHaveAttribute("aria-pressed", "true");
    await waitFor(() => expect(mockToggle).toHaveBeenCalledWith("meal-1", true));
  });

  it("clicking toggle on completed meal calls action with false", async () => {
    const user = userEvent.setup();
    renderMeals([{ ...BASE_MEAL, completed: true }]);
    const btn = screen.getByRole("button", { name: /შესრულდა/ });
    await user.click(btn);
    await waitFor(() => expect(mockToggle).toHaveBeenCalledWith("meal-1", false));
  });

  it("empty list renders the Georgian empty-state message", () => {
    renderMeals([]);
    expect(screen.getByText("ამ დღისთვის კვება ჯერ არ არის გეგმაში.")).toBeInTheDocument();
  });
});
