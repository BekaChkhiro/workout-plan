import { describe, expect, it } from "vitest";

import {
  buildMealNotification,
  buildWaterNotification,
  buildWeightNotification,
  buildWorkoutNotification,
} from "@/lib/notification-content";

describe("buildMealNotification", () => {
  const meal = { id: "m1", name: "კვერცხის ომლეტი", summary: "ბოსტნეული", calories: 280 };

  it("title contains meal name with emoji", () => {
    expect(buildMealNotification(meal).title).toBe("🍳 კვერცხის ომლეტი");
  });

  it("body contains summary and calorie count in Georgian", () => {
    expect(buildMealNotification(meal).body).toBe("ბოსტნეული (280 კკალ)");
  });

  it("omits calorie suffix when calories is 0", () => {
    expect(buildMealNotification({ ...meal, calories: 0 }).body).toBe("ბოსტნეული");
  });

  it("sets tag to meal-<id>", () => {
    expect(buildMealNotification(meal).tag).toBe("meal-m1");
  });

  it("deep-links to today screen", () => {
    expect(buildMealNotification(meal).url).toBe("/");
  });
});

describe("buildWorkoutNotification", () => {
  const workout = {
    id: "w1",
    title: "პილატესი",
    timeStart: "18:30",
    durationMin: 45,
    focus: null,
  };

  it("title contains time with Georgian postposition -ზე", () => {
    expect(buildWorkoutNotification(workout).title).toBe("💪 18:30-ზე");
  });

  it("body contains title and duration in Georgian (წთ)", () => {
    expect(buildWorkoutNotification(workout).body).toBe("პილატესი · 45 წთ");
  });

  it("includes focus area in body when present", () => {
    expect(buildWorkoutNotification({ ...workout, focus: "Core" }).body).toBe(
      "პილატესი · 45 წთ · Core",
    );
  });

  it("falls back to title in title when no timeStart", () => {
    expect(buildWorkoutNotification({ ...workout, timeStart: null }).title).toBe("💪 პილატესი");
  });

  it("falls back to duration-only body when no timeStart", () => {
    expect(buildWorkoutNotification({ ...workout, timeStart: null }).body).toBe("45 წთ");
  });

  it("sets tag to workout-<id>", () => {
    expect(buildWorkoutNotification(workout).tag).toBe("workout-w1");
  });

  it("deep-links to today screen", () => {
    expect(buildWorkoutNotification(workout).url).toBe("/");
  });
});

describe("buildWaterNotification", () => {
  it("title is Georgian water reminder", () => {
    expect(buildWaterNotification(5, 8).title).toBe("💧 წყლის დროა!");
  });

  it("body shows current / target glasses in Georgian (ჭიქა)", () => {
    expect(buildWaterNotification(5, 8).body).toBe("5/8 ჭიქა.");
  });

  it("body reflects different progress values", () => {
    expect(buildWaterNotification(0, 8).body).toBe("0/8 ჭიქა.");
    expect(buildWaterNotification(7, 8).body).toBe("7/8 ჭიქა.");
  });

  it("uses stable tag so reminders replace each other", () => {
    expect(buildWaterNotification(3, 8).tag).toBe("water");
  });

  it("deep-links to today screen", () => {
    expect(buildWaterNotification(5, 8).url).toBe("/");
  });
});

describe("buildWeightNotification", () => {
  it("title is Georgian weight entry prompt", () => {
    expect(buildWeightNotification().title).toBe("⚖️ წონის ჩაწერა");
  });

  it("body is Georgian morning weight instruction", () => {
    expect(buildWeightNotification().body).toBe("დილის წონის ჩაწერა");
  });

  it("deep-links to progress screen", () => {
    expect(buildWeightNotification().url).toBe("/progress");
  });

  it("uses stable weight tag", () => {
    expect(buildWeightNotification().tag).toBe("weight");
  });
});
