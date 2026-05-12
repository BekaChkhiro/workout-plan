"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Drawer } from "vaul";
import { z } from "zod";

import { logMeasurementAction } from "@/app/(app)/progress/actions";

const cmField = z
  .number({ error: "შეიყვანეთ ვალიდური სიდიდე" })
  .positive("მნიშვნელობა უნდა იყოს დადებითი")
  .max(300, "ძალიან დიდი მნიშვნელობა")
  .nullish();

const schema = z
  .object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    waistCm: cmField,
    armCm: cmField,
    thighCm: cmField,
  })
  .refine((d) => d.waistCm != null || d.armCm != null || d.thighCm != null, {
    message: "შეავსეთ მინიმუმ ერთი ველი",
  });

type FormData = z.infer<typeof schema>;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  today: string;
};

export function MeasurementLogModal({ open, onOpenChange, today }: Props) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { date: today },
  });

  const mutation = useMutation({
    mutationFn: ({ date, waistCm, armCm, thighCm }: FormData) =>
      logMeasurementAction(date, { waistCm, armCm, thighCm }),
    onSuccess: () => {
      onOpenChange(false);
      reset({ date: today });
      router.refresh();
    },
  });

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />
        <Drawer.Content
          className="fixed right-0 bottom-0 left-0 z-50 mx-auto max-w-[480px] rounded-t-[28px] bg-white px-5 pt-4"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 32px)" }}
          aria-label="გაზომვის ჩაწერა"
        >
          <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-[#E4D9F5]" />

          <h2 className="text-h2 text-ink mb-6 text-center font-bold">📏 გაზომვის ჩაწერა</h2>

          <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-caption text-ink-soft font-semibold">თარიღი</label>
              <input
                type="date"
                {...register("date")}
                className="bg-surface-2 text-body text-ink w-full rounded-[14px] px-4 py-3 font-medium focus:outline-none"
              />
              {errors.date && <p className="text-caption text-red-400">{errors.date.message}</p>}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-caption text-ink-soft font-semibold">წელი (სმ)</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="300"
                  placeholder="70.0"
                  {...register("waistCm", { valueAsNumber: true })}
                  className="bg-surface-2 text-body text-ink w-full rounded-[14px] px-3 py-3 font-medium focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-caption text-ink-soft font-semibold">მკლავი (სმ)</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="300"
                  placeholder="30.0"
                  {...register("armCm", { valueAsNumber: true })}
                  className="bg-surface-2 text-body text-ink w-full rounded-[14px] px-3 py-3 font-medium focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-caption text-ink-soft font-semibold">ბარძაყი (სმ)</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="300"
                  placeholder="55.0"
                  {...register("thighCm", { valueAsNumber: true })}
                  className="bg-surface-2 text-body text-ink w-full rounded-[14px] px-3 py-3 font-medium focus:outline-none"
                />
              </div>
            </div>

            {(errors.waistCm || errors.armCm || errors.thighCm || errors.root) && (
              <p className="text-caption text-red-400">
                {errors.waistCm?.message ??
                  errors.armCm?.message ??
                  errors.thighCm?.message ??
                  errors.root?.message}
              </p>
            )}

            {mutation.isError && (
              <p className="text-caption text-center text-red-400">შეცდომა. სცადეთ თავიდან.</p>
            )}

            <button
              type="submit"
              disabled={mutation.isPending}
              className="rounded-pill mt-2 w-full py-4 text-[14.5px] font-bold text-white disabled:opacity-60"
              style={{ background: "var(--gradient-brand)", boxShadow: "var(--shadow-lg)" }}
            >
              {mutation.isPending ? "ინახება..." : "შენახვა"}
            </button>
          </form>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
