"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Drawer } from "vaul";
import { z } from "zod";

import { updateDailyTargetsAction } from "@/app/(app)/profile/actions";

const schema = z.object({
  calorieTarget: z
    .number({ error: "შეიყვანეთ კალორია" })
    .int()
    .min(500, "მინ. 500 კკალ")
    .max(5000, "მაქს. 5000 კკალ"),
  pTarget: z.number({ error: "შეიყვანეთ ცილა" }).int().min(0).max(500, "მაქს. 500 გ"),
  nTarget: z.number({ error: "შეიყვანეთ ნახშირწყლები" }).int().min(0).max(1000, "მაქს. 1000 გ"),
  fTarget: z.number({ error: "შეიყვანეთ ცხიმი" }).int().min(0).max(500, "მაქს. 500 გ"),
  waterTargetL: z
    .number({ error: "შეიყვანეთ წყლის რაოდენობა" })
    .min(0.5, "მინ. 0.5 ლ")
    .max(10, "მაქს. 10 ლ"),
});

type FormData = z.infer<typeof schema>;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaults: FormData;
};

export function DailyTargetsSheet({ open, onOpenChange, defaults }: Props) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: defaults,
  });

  const mutation = useMutation({
    mutationFn: (d: FormData) => updateDailyTargetsAction(d),
    onSuccess: () => {
      onOpenChange(false);
      router.refresh();
    },
  });

  const fields: { name: keyof FormData; label: string; step: string; unit: string }[] = [
    { name: "calorieTarget", label: "კალორია", step: "1", unit: "კკალ" },
    { name: "pTarget", label: "ცილა", step: "1", unit: "გ" },
    { name: "nTarget", label: "ნახშირწყლები", step: "1", unit: "გ" },
    { name: "fTarget", label: "ცხიმი", step: "1", unit: "გ" },
    { name: "waterTargetL", label: "წყალი", step: "0.25", unit: "ლ" },
  ];

  return (
    <Drawer.Root
      open={open}
      onOpenChange={(o) => {
        if (!o) reset(defaults);
        onOpenChange(o);
      }}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />
        <Drawer.Content
          className="fixed right-0 bottom-0 left-0 z-50 mx-auto max-w-[480px] rounded-t-[28px] bg-white px-5 pt-4"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 32px)" }}
          aria-label="დღიური სამიზნის რედაქტირება"
        >
          <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-[#E4D9F5]" />
          <h2 className="text-h2 text-ink mb-6 text-center font-bold">🎯 დღიური სამიზნე</h2>

          <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="flex flex-col gap-4">
            {fields.map(({ name, label, step, unit }) => (
              <div key={name} className="flex flex-col gap-1.5">
                <label className="text-caption text-ink-soft font-semibold">{label}</label>
                <div className="relative">
                  <input
                    type="number"
                    step={step}
                    {...register(name, { valueAsNumber: true })}
                    className="bg-surface-2 text-body text-ink w-full rounded-[14px] px-4 py-3 pr-14 font-medium focus:outline-none"
                  />
                  <span className="text-ink-mute absolute top-1/2 right-4 -translate-y-1/2 text-[12px] font-semibold">
                    {unit}
                  </span>
                </div>
                {errors[name] && (
                  <p className="text-caption text-red-400">{errors[name]?.message}</p>
                )}
              </div>
            ))}

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
