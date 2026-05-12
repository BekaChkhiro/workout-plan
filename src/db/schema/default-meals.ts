import { relations, sql } from "drizzle-orm";
import { index, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { dayTypeEnum } from "./enums";

export const defaultMeals = pgTable(
  "default_meals",
  {
    id: uuid()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
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
  (t) => [index("default_meals_day_type_sort_order_idx").on(t.dayType, t.sortOrder)],
);

export const defaultMealIngredients = pgTable(
  "default_meal_ingredients",
  {
    id: uuid()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    defaultMealId: uuid()
      .notNull()
      .references(() => defaultMeals.id, { onDelete: "cascade" }),
    name: text().notNull(),
    amount: text().notNull(),
    sortOrder: integer().notNull(),
  },
  (t) => [
    index("default_meal_ingredients_default_meal_id_sort_order_idx").on(
      t.defaultMealId,
      t.sortOrder,
    ),
  ],
);

export const defaultMealSwaps = pgTable(
  "default_meal_swaps",
  {
    id: uuid()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    defaultMealId: uuid()
      .notNull()
      .references(() => defaultMeals.id, { onDelete: "cascade" }),
    name: text().notNull(),
    sortOrder: integer().notNull(),
  },
  (t) => [
    index("default_meal_swaps_default_meal_id_sort_order_idx").on(t.defaultMealId, t.sortOrder),
  ],
);

export const defaultMealsRelations = relations(defaultMeals, ({ many }) => ({
  ingredients: many(defaultMealIngredients),
  swaps: many(defaultMealSwaps),
}));

export const defaultMealIngredientsRelations = relations(defaultMealIngredients, ({ one }) => ({
  meal: one(defaultMeals, {
    fields: [defaultMealIngredients.defaultMealId],
    references: [defaultMeals.id],
  }),
}));

export const defaultMealSwapsRelations = relations(defaultMealSwaps, ({ one }) => ({
  meal: one(defaultMeals, {
    fields: [defaultMealSwaps.defaultMealId],
    references: [defaultMeals.id],
  }),
}));

export const insertDefaultMealSchema = createInsertSchema(defaultMeals);
export const selectDefaultMealSchema = createSelectSchema(defaultMeals);
export const insertDefaultMealIngredientSchema = createInsertSchema(defaultMealIngredients);
export const selectDefaultMealIngredientSchema = createSelectSchema(defaultMealIngredients);
export const insertDefaultMealSwapSchema = createInsertSchema(defaultMealSwaps);
export const selectDefaultMealSwapSchema = createSelectSchema(defaultMealSwaps);

export type DefaultMeal = typeof defaultMeals.$inferSelect;
export type NewDefaultMeal = typeof defaultMeals.$inferInsert;
export type DefaultMealIngredient = typeof defaultMealIngredients.$inferSelect;
export type NewDefaultMealIngredient = typeof defaultMealIngredients.$inferInsert;
export type DefaultMealSwap = typeof defaultMealSwaps.$inferSelect;
export type NewDefaultMealSwap = typeof defaultMealSwaps.$inferInsert;
