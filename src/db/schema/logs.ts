import { relations, sql } from "drizzle-orm";
import {
  check,
  date,
  index,
  integer,
  numeric,
  pgTable,
  primaryKey,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { meals } from "./meals";
import { users } from "./users";
import { workouts } from "./workouts";

export const mealLogs = pgTable(
  "meal_logs",
  {
    id: uuid()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    mealId: uuid()
      .notNull()
      .references(() => meals.id, { onDelete: "cascade" }),
    date: date().notNull(),
    completedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("meal_logs_user_id_meal_id_date_unique").on(t.userId, t.mealId, t.date),
    index("meal_logs_user_id_date_idx").on(t.userId, t.date),
  ],
);

export const workoutLogs = pgTable(
  "workout_logs",
  {
    id: uuid()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    workoutId: uuid()
      .notNull()
      .references(() => workouts.id, { onDelete: "cascade" }),
    date: date().notNull(),
    completedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("workout_logs_user_id_workout_id_date_unique").on(t.userId, t.workoutId, t.date),
    index("workout_logs_user_id_date_idx").on(t.userId, t.date),
  ],
);

export const waterLogs = pgTable(
  "water_logs",
  {
    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    date: date().notNull(),
    glassesCount: integer().notNull().default(0),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.date] }),
    check("water_logs_glasses_count_non_negative", sql`${t.glassesCount} >= 0`),
  ],
);

export const weightLogs = pgTable(
  "weight_logs",
  {
    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    date: date().notNull(),
    kg: numeric({ precision: 5, scale: 2 }).notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.date] }),
    check("weight_logs_kg_positive", sql`${t.kg} > 0`),
  ],
);

export const measurementLogs = pgTable(
  "measurement_logs",
  {
    id: uuid()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    date: date().notNull(),
    waistCm: numeric({ precision: 5, scale: 2 }),
    armCm: numeric({ precision: 5, scale: 2 }),
    thighCm: numeric({ precision: 5, scale: 2 }),
  },
  (t) => [uniqueIndex("measurement_logs_user_id_date_unique").on(t.userId, t.date)],
);

export const mealLogsRelations = relations(mealLogs, ({ one }) => ({
  user: one(users, {
    fields: [mealLogs.userId],
    references: [users.id],
  }),
  meal: one(meals, {
    fields: [mealLogs.mealId],
    references: [meals.id],
  }),
}));

export const workoutLogsRelations = relations(workoutLogs, ({ one }) => ({
  user: one(users, {
    fields: [workoutLogs.userId],
    references: [users.id],
  }),
  workout: one(workouts, {
    fields: [workoutLogs.workoutId],
    references: [workouts.id],
  }),
}));

export const waterLogsRelations = relations(waterLogs, ({ one }) => ({
  user: one(users, {
    fields: [waterLogs.userId],
    references: [users.id],
  }),
}));

export const weightLogsRelations = relations(weightLogs, ({ one }) => ({
  user: one(users, {
    fields: [weightLogs.userId],
    references: [users.id],
  }),
}));

export const measurementLogsRelations = relations(measurementLogs, ({ one }) => ({
  user: one(users, {
    fields: [measurementLogs.userId],
    references: [users.id],
  }),
}));

export const insertMealLogSchema = createInsertSchema(mealLogs);
export const selectMealLogSchema = createSelectSchema(mealLogs);
export const insertWorkoutLogSchema = createInsertSchema(workoutLogs);
export const selectWorkoutLogSchema = createSelectSchema(workoutLogs);
export const insertWaterLogSchema = createInsertSchema(waterLogs);
export const selectWaterLogSchema = createSelectSchema(waterLogs);
export const insertWeightLogSchema = createInsertSchema(weightLogs);
export const selectWeightLogSchema = createSelectSchema(weightLogs);
export const insertMeasurementLogSchema = createInsertSchema(measurementLogs);
export const selectMeasurementLogSchema = createSelectSchema(measurementLogs);

export type MealLog = typeof mealLogs.$inferSelect;
export type NewMealLog = typeof mealLogs.$inferInsert;
export type WorkoutLog = typeof workoutLogs.$inferSelect;
export type NewWorkoutLog = typeof workoutLogs.$inferInsert;
export type WaterLog = typeof waterLogs.$inferSelect;
export type NewWaterLog = typeof waterLogs.$inferInsert;
export type WeightLog = typeof weightLogs.$inferSelect;
export type NewWeightLog = typeof weightLogs.$inferInsert;
export type MeasurementLog = typeof measurementLogs.$inferSelect;
export type NewMeasurementLog = typeof measurementLogs.$inferInsert;
