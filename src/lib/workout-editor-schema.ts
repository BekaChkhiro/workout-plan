import { z } from "zod";

export const workoutFormSchema = z.object({
  type: z.enum(["pilates", "cardio", "combo", "rest"]),
  title: z.string().min(1, "სათაური სავალდებულოა"),
  focus: z.string().nullable(),
  durationMin: z.number().int().min(5).max(180).nullable(),
  intensity: z.enum(["light", "medium", "strong", "heavy"]),
  timeStart: z.string().nullable(),
  timeEnd: z.string().nullable(),
  videoUrl: z
    .string()
    .refine((v) => v === "" || /^https?:\/\/.+/.test(v), { message: "არასწორი URL" })
    .nullable(),
  description: z.string().nullable(),
});

export type WorkoutFormValues = z.infer<typeof workoutFormSchema>;
