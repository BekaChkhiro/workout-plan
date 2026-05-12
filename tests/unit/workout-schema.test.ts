import { describe, expect, it } from "vitest";

import { workoutFormSchema } from "@/lib/workout-editor-schema";

const validWorkout = {
  type: "pilates" as const,
  title: "დილის პილატესი",
  focus: null,
  durationMin: 45,
  intensity: "medium" as const,
  timeStart: null,
  timeEnd: null,
  videoUrl: null,
  description: null,
};

describe("workoutFormSchema", () => {
  it("accepts a fully valid workout", () => {
    expect(workoutFormSchema.safeParse(validWorkout).success).toBe(true);
  });

  it("rejects empty title and reports the Georgian error message", () => {
    const result = workoutFormSchema.safeParse({ ...validWorkout, title: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path[0] === "title");
      expect(issue?.message).toBe("სათაური სავალდებულოა");
    }
  });

  it.each(["pilates", "cardio", "combo", "rest"] as const)("accepts type %s", (type) => {
    expect(workoutFormSchema.safeParse({ ...validWorkout, type }).success).toBe(true);
  });

  it("rejects invalid type enum", () => {
    expect(workoutFormSchema.safeParse({ ...validWorkout, type: "yoga" }).success).toBe(false);
  });

  it.each(["light", "medium", "strong", "heavy"] as const)("accepts intensity %s", (intensity) => {
    expect(workoutFormSchema.safeParse({ ...validWorkout, intensity }).success).toBe(true);
  });

  it("rejects invalid intensity enum", () => {
    expect(workoutFormSchema.safeParse({ ...validWorkout, intensity: "extreme" }).success).toBe(
      false,
    );
  });

  it("accepts null videoUrl", () => {
    expect(workoutFormSchema.safeParse({ ...validWorkout, videoUrl: null }).success).toBe(true);
  });

  it("accepts empty string videoUrl", () => {
    expect(workoutFormSchema.safeParse({ ...validWorkout, videoUrl: "" }).success).toBe(true);
  });

  it("accepts valid https videoUrl", () => {
    expect(
      workoutFormSchema.safeParse({
        ...validWorkout,
        videoUrl: "https://youtube.com/watch?v=abc123",
      }).success,
    ).toBe(true);
  });

  it("accepts valid http videoUrl", () => {
    expect(
      workoutFormSchema.safeParse({ ...validWorkout, videoUrl: "http://example.com/video" })
        .success,
    ).toBe(true);
  });

  it("rejects malformed videoUrl and reports the Georgian error message", () => {
    const result = workoutFormSchema.safeParse({ ...validWorkout, videoUrl: "not-a-url" });
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path[0] === "videoUrl");
      expect(issue?.message).toBe("არასწორი URL");
    }
  });

  it("rejects ftp videoUrl", () => {
    const result = workoutFormSchema.safeParse({ ...validWorkout, videoUrl: "ftp://files.com/v" });
    expect(result.success).toBe(false);
  });

  it("accepts null for all nullable fields simultaneously", () => {
    expect(
      workoutFormSchema.safeParse({
        ...validWorkout,
        focus: null,
        durationMin: null,
        timeStart: null,
        timeEnd: null,
        videoUrl: null,
        description: null,
      }).success,
    ).toBe(true);
  });

  it("rejects durationMin below the minimum of 5", () => {
    expect(workoutFormSchema.safeParse({ ...validWorkout, durationMin: 4 }).success).toBe(false);
  });

  it("rejects durationMin above the maximum of 180", () => {
    expect(workoutFormSchema.safeParse({ ...validWorkout, durationMin: 181 }).success).toBe(false);
  });
});
