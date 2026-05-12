import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { MealEditorSheet } from "@/app/(app)/meals/_components/MealEditorSheet";
import type { MealWithDetails } from "@/db/queries";

vi.mock("vaul", () => ({
  Drawer: {
    Root: ({
      children,
      open,
    }: {
      children: React.ReactNode;
      open: boolean;
      onOpenChange?: (v: boolean) => void;
    }) => (open ? <div data-testid="drawer-root">{children}</div> : null),
    Portal: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    Overlay: () => null,
    Content: ({ children, className }: { children: React.ReactNode; className?: string }) => (
      <div role="dialog" className={className}>
        {children}
      </div>
    ),
  },
}));

vi.mock("@dnd-kit/core", () => ({
  DndContext: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  PointerSensor: class {},
  closestCenter: () => null,
  useSensor: () => ({}),
  useSensors: (...args: unknown[]) => args,
}));

vi.mock("@dnd-kit/sortable", () => ({
  SortableContext: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: () => {},
    transform: null,
    transition: undefined,
    isDragging: false,
  }),
  verticalListSortingStrategy: "vertical",
}));

vi.mock("@dnd-kit/utilities", () => ({
  CSS: { Transform: { toString: () => "" } },
}));

const mockUpdateMealAction = vi.fn().mockResolvedValue({ ok: true as const });
vi.mock("@/app/(app)/meals/actions", () => ({
  updateMealAction: (...args: unknown[]) => mockUpdateMealAction(...args),
}));

const baseMeal: MealWithDetails = {
  id: "meal-1",
  userId: "user-1",
  time: "08:00",
  name: "საუზმე",
  summary: "კვერცხი და ჩაი",
  dayType: "workout",
  calories: 400,
  pG: 30,
  nG: 40,
  fG: 10,
  sortOrder: 0,
  ingredients: [{ id: "ing-1", mealId: "meal-1", name: "კვერცხი", amount: "3 ც", sortOrder: 0 }],
  swaps: [],
  completed: false,
};

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
}

function renderSheet(props: { open?: boolean; onOpenChange?: (v: boolean) => void } = {}) {
  const onOpenChange = props.onOpenChange ?? vi.fn();
  render(
    <QueryClientProvider client={makeQueryClient()}>
      <MealEditorSheet meal={baseMeal} open={props.open ?? true} onOpenChange={onOpenChange} />
    </QueryClientProvider>,
  );
  return { onOpenChange };
}

describe("MealEditorSheet", () => {
  beforeEach(() => {
    mockUpdateMealAction.mockClear();
  });

  it("renders the meal name in the header when open", () => {
    renderSheet();
    expect(screen.getByText(/საუზმე.*რედაქტირება/)).toBeInTheDocument();
  });

  it("renders nothing when closed", () => {
    renderSheet({ open: false });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("clicking the × button calls onOpenChange(false)", async () => {
    const user = userEvent.setup();
    const { onOpenChange } = renderSheet();
    await user.click(screen.getByRole("button", { name: "დახურვა" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("clicking გაუქმება calls onOpenChange(false)", async () => {
    const user = userEvent.setup();
    const { onOpenChange } = renderSheet();
    await user.click(screen.getByRole("button", { name: "გაუქმება" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("submitting with the pre-filled valid defaults calls updateMealAction with the parsed payload", async () => {
    const user = userEvent.setup();
    renderSheet();
    await user.click(screen.getByRole("button", { name: /შენახვა/ }));
    await waitFor(() => {
      expect(mockUpdateMealAction).toHaveBeenCalledWith(
        "meal-1",
        expect.objectContaining({
          time: "08:00",
          name: "საუზმე",
          dayType: "workout",
          calories: 400,
          pG: 30,
          nG: 40,
          fG: 10,
        }),
      );
    });
  });

  it("does not call updateMealAction when the name field is cleared (zod validation blocks submit)", async () => {
    const user = userEvent.setup();
    renderSheet();
    await user.clear(screen.getByPlaceholderText("სახელი..."));
    await user.click(screen.getByRole("button", { name: /შენახვა/ }));
    expect(mockUpdateMealAction).not.toHaveBeenCalled();
  });
});
