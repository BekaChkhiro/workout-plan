"use client";

import { useOptimistic, useTransition } from "react";

import { completeWorkoutAction } from "@/app/(app)/_actions/workout";

type Props = {
  workoutId: string;
  completed: boolean;
};

export function WorkoutCompleteButton({ workoutId, completed }: Props) {
  const [optimisticCompleted, setOptimisticCompleted] = useOptimistic(completed);
  const [isPending, startTransition] = useTransition();

  const isDone = optimisticCompleted;

  const onClick = () => {
    if (isDone || isPending) return;
    startTransition(async () => {
      setOptimisticCompleted(true);
      await completeWorkoutAction(workoutId);
    });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDone || isPending}
      aria-pressed={isDone}
      className="w-full rounded-full border-none px-4 py-[15px] text-[14.5px] font-bold tracking-wide text-white transition-opacity disabled:cursor-default"
      style={{
        background: isDone ? "var(--color-brand-mint)" : "var(--gradient-brand)",
        boxShadow: "0 6px 18px rgba(201,168,232,0.5)",
        opacity: isPending && !isDone ? 0.85 : 1,
      }}
    >
      {isDone ? "შესრულდა ✓" : "დასრულდა ✨"}
    </button>
  );
}
