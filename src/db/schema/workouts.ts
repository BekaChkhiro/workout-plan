import { relations, sql } from "drizzle-orm";
import { check, integer, pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { intensityEnum, workoutTypeEnum } from "./enums";
import { workoutLogs } from "./logs";
import { users } from "./users";

export const workouts = pgTable(
  "workouts",
  {
    id: uuid()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    week: integer().notNull(),
    weekday: integer().notNull(),
    type: workoutTypeEnum().notNull(),
    title: text().notNull(),
    focus: text(),
    durationMin: integer(),
    intensity: intensityEnum().notNull(),
    timeStart: text(),
    timeEnd: text(),
    videoUrl: text(),
    description: text(),
  },
  (t) => [
    uniqueIndex("workouts_user_id_week_weekday_unique").on(t.userId, t.week, t.weekday),
    check("workouts_week_range", sql`${t.week} BETWEEN 1 AND 4`),
    check("workouts_weekday_range", sql`${t.weekday} BETWEEN 0 AND 6`),
  ],
);

export const workoutsRelations = relations(workouts, ({ one, many }) => ({
  user: one(users, {
    fields: [workouts.userId],
    references: [users.id],
  }),
  logs: many(workoutLogs),
}));

export const insertWorkoutSchema = createInsertSchema(workouts);
export const selectWorkoutSchema = createSelectSchema(workouts);

export type Workout = typeof workouts.$inferSelect;
export type NewWorkout = typeof workouts.$inferInsert;
