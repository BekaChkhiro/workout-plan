import { z } from "zod";

export const mealFormSchema = z.object({
  time: z.string().min(1),
  name: z.string().min(1),
  summary: z.string().min(1),
  dayType: z.enum(["workout", "rest"]),
  calories: z.number().int().min(0),
  pG: z.number().int().min(0),
  nG: z.number().int().min(0),
  fG: z.number().int().min(0),
  ingredients: z
    .array(z.object({ id: z.string(), name: z.string().min(1), amount: z.string().min(1) }))
    .min(1),
  swaps: z.array(z.object({ id: z.string(), name: z.string().min(1) })),
});

export type MealFormValues = z.infer<typeof mealFormSchema>;
