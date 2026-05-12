import { config } from "dotenv";

config({ path: ".env.local" });

async function main() {
  const { db } = await import("./index");
  const { defaultMealIngredients, defaultMeals, defaultMealSwaps } = await import("./schema");
  const { defaultMealsSeed } = await import("./seed/default-meals");

  await db.delete(defaultMeals);

  for (const meal of defaultMealsSeed) {
    const [inserted] = await db
      .insert(defaultMeals)
      .values({
        dayType: meal.dayType,
        time: meal.time,
        name: meal.name,
        summary: meal.summary,
        calories: meal.calories,
        pG: meal.pG,
        nG: meal.nG,
        fG: meal.fG,
        sortOrder: meal.sortOrder,
      })
      .returning({ id: defaultMeals.id });

    if (!inserted) {
      throw new Error(`Failed to insert default meal: ${meal.name} (${meal.dayType})`);
    }

    if (meal.ingredients.length > 0) {
      await db.insert(defaultMealIngredients).values(
        meal.ingredients.map((ing, idx) => ({
          defaultMealId: inserted.id,
          name: ing.name,
          amount: ing.amount,
          sortOrder: idx + 1,
        })),
      );
    }

    if (meal.swaps.length > 0) {
      await db.insert(defaultMealSwaps).values(
        meal.swaps.map((name, idx) => ({
          defaultMealId: inserted.id,
          name,
          sortOrder: idx + 1,
        })),
      );
    }
  }

  console.log(`Seeded ${defaultMealsSeed.length} default meals.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
