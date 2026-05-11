import { pgEnum } from "drizzle-orm/pg-core";

export const dayTypeEnum = pgEnum("day_type", ["workout", "rest"]);

export const workoutTypeEnum = pgEnum("workout_type", ["pilates", "cardio", "combo", "rest"]);

export const intensityEnum = pgEnum("intensity", ["light", "medium", "strong", "heavy"]);

export const themeEnum = pgEnum("theme", ["light", "dark", "system"]);
