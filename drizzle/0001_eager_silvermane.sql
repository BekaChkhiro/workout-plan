CREATE TABLE "default_meal_ingredients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"default_meal_id" uuid NOT NULL,
	"name" text NOT NULL,
	"amount" text NOT NULL,
	"sort_order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "default_meal_swaps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"default_meal_id" uuid NOT NULL,
	"name" text NOT NULL,
	"sort_order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "default_meals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"day_type" "day_type" NOT NULL,
	"time" text NOT NULL,
	"name" text NOT NULL,
	"summary" text NOT NULL,
	"calories" integer NOT NULL,
	"p_g" integer NOT NULL,
	"n_g" integer NOT NULL,
	"f_g" integer NOT NULL,
	"sort_order" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "default_meal_ingredients" ADD CONSTRAINT "default_meal_ingredients_default_meal_id_default_meals_id_fk" FOREIGN KEY ("default_meal_id") REFERENCES "public"."default_meals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "default_meal_swaps" ADD CONSTRAINT "default_meal_swaps_default_meal_id_default_meals_id_fk" FOREIGN KEY ("default_meal_id") REFERENCES "public"."default_meals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "default_meal_ingredients_default_meal_id_sort_order_idx" ON "default_meal_ingredients" USING btree ("default_meal_id","sort_order");--> statement-breakpoint
CREATE INDEX "default_meal_swaps_default_meal_id_sort_order_idx" ON "default_meal_swaps" USING btree ("default_meal_id","sort_order");--> statement-breakpoint
CREATE INDEX "default_meals_day_type_sort_order_idx" ON "default_meals" USING btree ("day_type","sort_order");