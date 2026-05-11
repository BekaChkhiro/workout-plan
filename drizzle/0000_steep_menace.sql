CREATE TYPE "public"."day_type" AS ENUM('workout', 'rest');--> statement-breakpoint
CREATE TYPE "public"."intensity" AS ENUM('light', 'medium', 'strong', 'heavy');--> statement-breakpoint
CREATE TYPE "public"."theme" AS ENUM('light', 'dark', 'system');--> statement-breakpoint
CREATE TYPE "public"."workout_type" AS ENUM('pilates', 'cardio', 'combo', 'rest');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"name" text NOT NULL,
	"timezone" text DEFAULT 'Asia/Tbilisi' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_settings" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"calorie_target" integer DEFAULT 1250 NOT NULL,
	"p_target" integer DEFAULT 100 NOT NULL,
	"n_target" integer DEFAULT 120 NOT NULL,
	"f_target" integer DEFAULT 40 NOT NULL,
	"water_target_l" numeric(3, 2) DEFAULT '2.00' NOT NULL,
	"target_weight_kg" numeric(5, 2),
	"plan_start_date" date NOT NULL,
	"current_week_override" integer,
	"notif_meals" boolean DEFAULT true NOT NULL,
	"notif_workouts" boolean DEFAULT true NOT NULL,
	"notif_water" boolean DEFAULT true NOT NULL,
	"notif_weight" boolean DEFAULT true NOT NULL,
	"theme" "theme" DEFAULT 'system' NOT NULL,
	CONSTRAINT "user_settings_current_week_override_range" CHECK ("user_settings"."current_week_override" IS NULL OR ("user_settings"."current_week_override" BETWEEN 1 AND 4))
);
--> statement-breakpoint
CREATE TABLE "meal_ingredients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"meal_id" uuid NOT NULL,
	"name" text NOT NULL,
	"amount" text NOT NULL,
	"sort_order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "meal_swaps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"meal_id" uuid NOT NULL,
	"name" text NOT NULL,
	"sort_order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "meals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
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
CREATE TABLE "workouts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"week" integer NOT NULL,
	"weekday" integer NOT NULL,
	"type" "workout_type" NOT NULL,
	"title" text NOT NULL,
	"focus" text,
	"duration_min" integer,
	"intensity" "intensity" NOT NULL,
	"time_start" text,
	"time_end" text,
	"video_url" text,
	"description" text,
	CONSTRAINT "workouts_week_range" CHECK ("workouts"."week" BETWEEN 1 AND 4),
	CONSTRAINT "workouts_weekday_range" CHECK ("workouts"."weekday" BETWEEN 0 AND 6)
);
--> statement-breakpoint
CREATE TABLE "meal_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"meal_id" uuid NOT NULL,
	"date" date NOT NULL,
	"completed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "measurement_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"date" date NOT NULL,
	"waist_cm" numeric(5, 2),
	"arm_cm" numeric(5, 2),
	"thigh_cm" numeric(5, 2)
);
--> statement-breakpoint
CREATE TABLE "water_logs" (
	"user_id" uuid NOT NULL,
	"date" date NOT NULL,
	"glasses_count" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "water_logs_user_id_date_pk" PRIMARY KEY("user_id","date"),
	CONSTRAINT "water_logs_glasses_count_non_negative" CHECK ("water_logs"."glasses_count" >= 0)
);
--> statement-breakpoint
CREATE TABLE "weight_logs" (
	"user_id" uuid NOT NULL,
	"date" date NOT NULL,
	"kg" numeric(5, 2) NOT NULL,
	CONSTRAINT "weight_logs_user_id_date_pk" PRIMARY KEY("user_id","date"),
	CONSTRAINT "weight_logs_kg_positive" CHECK ("weight_logs"."kg" > 0)
);
--> statement-breakpoint
CREATE TABLE "workout_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"workout_id" uuid NOT NULL,
	"date" date NOT NULL,
	"completed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "progress_photos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"week" integer NOT NULL,
	"taken_at" timestamp with time zone DEFAULT now() NOT NULL,
	"blob_url" text NOT NULL,
	CONSTRAINT "progress_photos_week_range" CHECK ("progress_photos"."week" BETWEEN 1 AND 4)
);
--> statement-breakpoint
CREATE TABLE "push_subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"endpoint" text NOT NULL,
	"p256dh" text NOT NULL,
	"auth" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meal_ingredients" ADD CONSTRAINT "meal_ingredients_meal_id_meals_id_fk" FOREIGN KEY ("meal_id") REFERENCES "public"."meals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meal_swaps" ADD CONSTRAINT "meal_swaps_meal_id_meals_id_fk" FOREIGN KEY ("meal_id") REFERENCES "public"."meals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meals" ADD CONSTRAINT "meals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workouts" ADD CONSTRAINT "workouts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meal_logs" ADD CONSTRAINT "meal_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meal_logs" ADD CONSTRAINT "meal_logs_meal_id_meals_id_fk" FOREIGN KEY ("meal_id") REFERENCES "public"."meals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "measurement_logs" ADD CONSTRAINT "measurement_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "water_logs" ADD CONSTRAINT "water_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weight_logs" ADD CONSTRAINT "weight_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_logs" ADD CONSTRAINT "workout_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_logs" ADD CONSTRAINT "workout_logs_workout_id_workouts_id_fk" FOREIGN KEY ("workout_id") REFERENCES "public"."workouts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "progress_photos" ADD CONSTRAINT "progress_photos_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "push_subscriptions" ADD CONSTRAINT "push_subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_unique" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "sessions_user_id_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "meal_ingredients_meal_id_sort_order_idx" ON "meal_ingredients" USING btree ("meal_id","sort_order");--> statement-breakpoint
CREATE INDEX "meal_swaps_meal_id_sort_order_idx" ON "meal_swaps" USING btree ("meal_id","sort_order");--> statement-breakpoint
CREATE INDEX "meals_user_id_day_type_sort_order_idx" ON "meals" USING btree ("user_id","day_type","sort_order");--> statement-breakpoint
CREATE UNIQUE INDEX "workouts_user_id_week_weekday_unique" ON "workouts" USING btree ("user_id","week","weekday");--> statement-breakpoint
CREATE UNIQUE INDEX "meal_logs_user_id_meal_id_date_unique" ON "meal_logs" USING btree ("user_id","meal_id","date");--> statement-breakpoint
CREATE INDEX "meal_logs_user_id_date_idx" ON "meal_logs" USING btree ("user_id","date");--> statement-breakpoint
CREATE UNIQUE INDEX "measurement_logs_user_id_date_unique" ON "measurement_logs" USING btree ("user_id","date");--> statement-breakpoint
CREATE UNIQUE INDEX "workout_logs_user_id_workout_id_date_unique" ON "workout_logs" USING btree ("user_id","workout_id","date");--> statement-breakpoint
CREATE INDEX "workout_logs_user_id_date_idx" ON "workout_logs" USING btree ("user_id","date");--> statement-breakpoint
CREATE INDEX "progress_photos_user_id_week_taken_at_idx" ON "progress_photos" USING btree ("user_id","week","taken_at" DESC NULLS LAST);--> statement-breakpoint
CREATE UNIQUE INDEX "push_subscriptions_endpoint_unique" ON "push_subscriptions" USING btree ("endpoint");--> statement-breakpoint
CREATE INDEX "push_subscriptions_user_id_idx" ON "push_subscriptions" USING btree ("user_id");