import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { WorkoutEditorSheet } from "@/components/plan/WorkoutEditorSheet";
import type { Workout } from "@/db/schema";

vi.mock("motion/react", () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: new Proxy(
    {},
    {
      get:
        (_target, tag: string) =>
        ({
          children,
          onClick,
          ...rest
        }: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) =>
          React.createElement(tag, { onClick, ...rest }, children),
    },
  ),
}));

import React from "react";

const mockRefresh = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: mockRefresh }),
}));

const mockUpdateWorkoutAction = vi.fn().mockResolvedValue(undefined);
vi.mock("@/app/(app)/_actions/workout", () => ({
  updateWorkoutAction: (...args: unknown[]) => mockUpdateWorkoutAction(...args),
}));

const baseWorkout: Workout = {
  id: "workout-1",
  userId: "user-1",
  week: 1,
  weekday: 1,
  type: "pilates",
  title: "დილის პილატესი",
  focus: null,
  durationMin: 45,
  intensity: "medium",
  timeStart: null,
  timeEnd: null,
  videoUrl: null,
  description: null,
};

function renderSheet(onClose = vi.fn()) {
  render(<WorkoutEditorSheet workout={baseWorkout} weekLabel="კვირა 1 — სამ" onClose={onClose} />);
  return { onClose };
}

describe("WorkoutEditorSheet", () => {
  beforeEach(() => {
    mockUpdateWorkoutAction.mockClear();
    mockRefresh.mockClear();
  });

  it("renders the workout title in the pre-filled input", () => {
    renderSheet();
    expect(screen.getByDisplayValue("დილის პილატესი")).toBeInTheDocument();
  });

  it("renders the weekday picker with all 7 day labels", () => {
    renderSheet();
    for (const label of ["ორშ", "სამ", "ოთხ", "ხუთ", "პარ", "შაბ", "კვი"]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  it("clicking გაუქმება calls onClose", async () => {
    const user = userEvent.setup();
    const { onClose } = renderSheet();
    await user.click(screen.getByRole("button", { name: "გაუქმება" }));
    expect(onClose).toHaveBeenCalled();
  });

  it("clicking the × close button calls onClose", async () => {
    const user = userEvent.setup();
    const { onClose } = renderSheet();
    await user.click(screen.getByRole("button", { name: "დახურვა" }));
    expect(onClose).toHaveBeenCalled();
  });

  it("clicking შენახვა calls updateWorkoutAction with the current form values", async () => {
    const user = userEvent.setup();
    renderSheet();
    await user.click(screen.getByRole("button", { name: /შენახვა/ }));
    await waitFor(() => {
      expect(mockUpdateWorkoutAction).toHaveBeenCalledWith(
        "workout-1",
        expect.objectContaining({
          type: "pilates",
          title: "დილის პილატესი",
          intensity: "medium",
        }),
      );
    });
  });

  it("selecting a different intensity is reflected in the save payload", async () => {
    const user = userEvent.setup();
    renderSheet();
    await user.click(screen.getByRole("button", { name: /მძიმე/ }));
    await user.click(screen.getByRole("button", { name: /შენახვა/ }));
    await waitFor(() => {
      expect(mockUpdateWorkoutAction).toHaveBeenCalledWith(
        "workout-1",
        expect.objectContaining({ intensity: "heavy" }),
      );
    });
  });
});
