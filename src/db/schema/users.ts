import { relations, sql } from "drizzle-orm";
import { pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { mealLogs } from "./logs";
import { measurementLogs, waterLogs, weightLogs } from "./logs";
import { workoutLogs } from "./logs";
import { meals } from "./meals";
import { progressPhotos } from "./progress";
import { pushSubscriptions } from "./push";
import { sessions } from "./sessions";
import { userSettings } from "./settings";
import { workouts } from "./workouts";

export const users = pgTable(
  "users",
  {
    id: uuid()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    email: text().notNull(),
    passwordHash: text().notNull(),
    name: text().notNull(),
    timezone: text().notNull().default("Asia/Tbilisi"),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("users_email_unique").on(t.email)],
);

export const usersRelations = relations(users, ({ one, many }) => ({
  settings: one(userSettings, {
    fields: [users.id],
    references: [userSettings.userId],
  }),
  sessions: many(sessions),
  meals: many(meals),
  workouts: many(workouts),
  mealLogs: many(mealLogs),
  workoutLogs: many(workoutLogs),
  waterLogs: many(waterLogs),
  weightLogs: many(weightLogs),
  measurementLogs: many(measurementLogs),
  progressPhotos: many(progressPhotos),
  pushSubscriptions: many(pushSubscriptions),
}));

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
