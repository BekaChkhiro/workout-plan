import { relations } from "drizzle-orm";
import { boolean, check, date, integer, numeric, pgTable, uuid } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { themeEnum } from "./enums";
import { users } from "./users";

export const userSettings = pgTable(
  "user_settings",
  {
    userId: uuid()
      .primaryKey()
      .references(() => users.id, { onDelete: "cascade" }),
    calorieTarget: integer().notNull().default(1250),
    pTarget: integer().notNull().default(100),
    nTarget: integer().notNull().default(120),
    fTarget: integer().notNull().default(40),
    waterTargetL: numeric({ precision: 3, scale: 2 }).notNull().default("2.00"),
    targetWeightKg: numeric({ precision: 5, scale: 2 }),
    planStartDate: date().notNull(),
    currentWeekOverride: integer(),
    notifMeals: boolean().notNull().default(true),
    notifWorkouts: boolean().notNull().default(true),
    notifWater: boolean().notNull().default(true),
    notifWeight: boolean().notNull().default(true),
    theme: themeEnum().notNull().default("system"),
  },
  (t) => [
    check(
      "user_settings_current_week_override_range",
      sql`${t.currentWeekOverride} IS NULL OR (${t.currentWeekOverride} BETWEEN 1 AND 4)`,
    ),
  ],
);

export const userSettingsRelations = relations(userSettings, ({ one }) => ({
  user: one(users, {
    fields: [userSettings.userId],
    references: [users.id],
  }),
}));

export const insertUserSettingsSchema = createInsertSchema(userSettings);
export const selectUserSettingsSchema = createSelectSchema(userSettings);

export type UserSettings = typeof userSettings.$inferSelect;
export type NewUserSettings = typeof userSettings.$inferInsert;
