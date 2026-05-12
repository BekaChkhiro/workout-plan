import { describe, expect, it } from "vitest";

import { mealFormSchema } from "@/app/(app)/meals/meal-schema";

const validMeal = {
  time: "08:00",
  name: "საუზმე",
  summary: "კვერცხი, ჩაი",
  dayType: "workout" as const,
  calories: 400,
  pG: 30,
  nG: 40,
  fG: 10,
  ingredients: [{ id: "i1", name: "კვერცხი", amount: "3 ც" }],
  swaps: [],
};

describe("mealFormSchema", () => {
  it("accepts a fully valid meal", () => {
    expect(mealFormSchema.safeParse(validMeal).success).toBe(true);
  });

  it("rejects empty time", () => {
    expect(mealFormSchema.safeParse({ ...validMeal, time: "" }).success).toBe(false);
  });

  it("rejects empty name", () => {
    expect(mealFormSchema.safeParse({ ...validMeal, name: "" }).success).toBe(false);
  });

  it("rejects empty summary", () => {
    expect(mealFormSchema.safeParse({ ...validMeal, summary: "" }).success).toBe(false);
  });

  it.each(["workout", "rest"] as const)("accepts dayType %s", (dayType) => {
    expect(mealFormSchema.safeParse({ ...validMeal, dayType }).success).toBe(true);
  });

  it("rejects invalid dayType", () => {
    expect(mealFormSchema.safeParse({ ...validMeal, dayType: "training" }).success).toBe(false);
  });

  it("rejects negative calories", () => {
    expect(mealFormSchema.safeParse({ ...validMeal, calories: -1 }).success).toBe(false);
  });

  it("accepts zero calories", () => {
    expect(mealFormSchema.safeParse({ ...validMeal, calories: 0 }).success).toBe(true);
  });

  it.each([
    ["pG", { pG: -1 }],
    ["nG", { nG: -1 }],
    ["fG", { fG: -1 }],
  ] as const)("rejects negative %s", (_, patch) => {
    expect(mealFormSchema.safeParse({ ...validMeal, ...patch }).success).toBe(false);
  });

  it("accepts zero for all macro fields", () => {
    expect(
      mealFormSchema.safeParse({ ...validMeal, calories: 0, pG: 0, nG: 0, fG: 0 }).success,
    ).toBe(true);
  });

  it("rejects empty ingredients array", () => {
    expect(mealFormSchema.safeParse({ ...validMeal, ingredients: [] }).success).toBe(false);
  });

  it("rejects ingredient with empty name", () => {
    const ingredients = [{ id: "i1", name: "", amount: "100გ" }];
    expect(mealFormSchema.safeParse({ ...validMeal, ingredients }).success).toBe(false);
  });

  it("rejects ingredient with empty amount", () => {
    const ingredients = [{ id: "i1", name: "კვერცხი", amount: "" }];
    expect(mealFormSchema.safeParse({ ...validMeal, ingredients }).success).toBe(false);
  });

  it("accepts empty swaps array", () => {
    expect(mealFormSchema.safeParse({ ...validMeal, swaps: [] }).success).toBe(true);
  });

  it("accepts multiple valid ingredients", () => {
    const ingredients = [
      { id: "i1", name: "კვერცხი", amount: "3 ც" },
      { id: "i2", name: "ყველი", amount: "30გ" },
    ];
    expect(mealFormSchema.safeParse({ ...validMeal, ingredients }).success).toBe(true);
  });
});
