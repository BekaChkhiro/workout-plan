import { relations, sql } from "drizzle-orm";
import { index, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { dayTypeEnum } from "./enums";
import { mealLogs } from "./logs";
import { users } from "./users";

export const meals = pgTable(
  "meals",
  {
    id: uuid()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    dayType: dayTypeEnum().notNull(),
    time: text().notNull(),
    name: text().notNull(),
    summary: text().notNull(),
    calories: integer().notNull(),
    pG: integer().notNull(),
    nG: integer().notNull(),
    fG: integer().notNull(),
    sortOrder: integer().notNull(),
  },
  (t) => [index("meals_user_id_day_type_sort_order_idx").on(t.userId, t.dayType, t.sortOrder)],
);

export const mealIngredients = pgTable(
  "meal_ingredients",
  {
    id: uuid()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    mealId: uuid()
      .notNull()
      .references(() => meals.id, { onDelete: "cascade" }),
    name: text().notNull(),
    amount: text().notNull(),
    sortOrder: integer().notNull(),
  },
  (t) => [index("meal_ingredients_meal_id_sort_order_idx").on(t.mealId, t.sortOrder)],
);

export const mealSwaps = pgTable(
  "meal_swaps",
  {
    id: uuid()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    mealId: uuid()
      .notNull()
      .references(() => meals.id, { onDelete: "cascade" }),
    name: text().notNull(),
    sortOrder: integer().notNull(),
  },
  (t) => [index("meal_swaps_meal_id_sort_order_idx").on(t.mealId, t.sortOrder)],
);

export const mealsRelations = relations(meals, ({ one, many }) => ({
  user: one(users, {
    fields: [meals.userId],
    references: [users.id],
  }),
  ingredients: many(mealIngredients),
  swaps: many(mealSwaps),
  logs: many(mealLogs),
}));

export const mealIngredientsRelations = relations(mealIngredients, ({ one }) => ({
  meal: one(meals, {
    fields: [mealIngredients.mealId],
    references: [meals.id],
  }),
}));

export const mealSwapsRelations = relations(mealSwaps, ({ one }) => ({
  meal: one(meals, {
    fields: [mealSwaps.mealId],
    references: [meals.id],
  }),
}));

export const insertMealSchema = createInsertSchema(meals);
export const selectMealSchema = createSelectSchema(meals);
export const insertMealIngredientSchema = createInsertSchema(mealIngredients);
export const selectMealIngredientSchema = createSelectSchema(mealIngredients);
export const insertMealSwapSchema = createInsertSchema(mealSwaps);
export const selectMealSwapSchema = createSelectSchema(mealSwaps);

export type Meal = typeof meals.$inferSelect;
export type NewMeal = typeof meals.$inferInsert;
export type MealIngredient = typeof mealIngredients.$inferSelect;
export type NewMealIngredient = typeof mealIngredients.$inferInsert;
export type MealSwap = typeof mealSwaps.$inferSelect;
export type NewMealSwap = typeof mealSwaps.$inferInsert;
