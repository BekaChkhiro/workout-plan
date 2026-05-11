# Database Schema — Entity Sketch (T2.1)

Target: Neon Postgres via Drizzle ORM. This document is the source of
truth for the Drizzle table files to be created in T2.2
(`src/db/schema/*.ts`).

The shapes below are derived from:

- The entity list in `PROJECT_PLAN.md` § T2.1.
- Sample/visual data in `week-plan/screens/shared.jsx` (`TODAY`),
  `week-plan/screens/meals-c.jsx` (ingredients/swaps), and
  `week-plan/screens/plan-c.jsx` (4-week, 7-day workout grid).

## Naming & conventions

- Table names: `snake_case`, plural.
- Primary keys: `id uuid default gen_random_uuid() primary key`, except
  log tables keyed by `(user_id, date)` where noted.
- All user-scoped rows carry `user_id uuid not null references users(id)
on delete cascade`.
- Timestamps: `timestamptz`. `created_at` defaults to `now()`.
- Dates without time-of-day (logs by calendar day): `date`.
- Money/ratios: not used. Numeric values are integers (kcal, grams,
  glasses) or `numeric(5,2)` for weight kg / liters.
- Enums use Postgres native enums (declared once in `src/db/schema/enums.ts`).

## Enums

| Enum           | Values                               | Notes                                                                  |
| -------------- | ------------------------------------ | ---------------------------------------------------------------------- |
| `day_type`     | `workout`, `rest`                    | Distinguishes the two meal sets a user can be on for a given day.      |
| `workout_type` | `pilates`, `cardio`, `combo`, `rest` | Mirrors `plan-c.jsx` day labels (`პილატესი`, `კარდიო`, `კომბო`, etc.). |
| `intensity`    | `light`, `medium`, `strong`, `heavy` | Maps to the four-week ramp in `plan-c.jsx` (`weeks[].label`).          |
| `theme`        | `light`, `dark`, `system`            | User preference.                                                       |

## ER diagram (Mermaid)

```mermaid
erDiagram
  users ||--|| user_settings : has
  users ||--o{ sessions : owns
  users ||--o{ meals : defines
  users ||--o{ workouts : defines
  users ||--o{ meal_logs : logs
  users ||--o{ workout_logs : logs
  users ||--o{ water_logs : logs
  users ||--o{ weight_logs : logs
  users ||--o{ measurement_logs : logs
  users ||--o{ progress_photos : uploads
  users ||--o{ push_subscriptions : registers

  meals ||--o{ meal_ingredients : "has"
  meals ||--o{ meal_swaps : "offers"
  meals ||--o{ meal_logs : "completed-in"
  workouts ||--o{ workout_logs : "completed-in"

  users {
    uuid id PK
    text email UK
    text password_hash
    text name
    text timezone
    timestamptz created_at
  }
  sessions {
    text id PK
    uuid user_id FK
    timestamptz expires_at
  }
  user_settings {
    uuid user_id PK_FK
    int calorie_target
    int p_target
    int n_target
    int f_target
    numeric water_target_l
    numeric target_weight_kg
    date plan_start_date
    int current_week_override
    bool notif_meals
    bool notif_workouts
    bool notif_water
    bool notif_weight
    enum theme
  }
  meals {
    uuid id PK
    uuid user_id FK
    enum day_type
    text time
    text name
    text summary
    int calories
    int p_g
    int n_g
    int f_g
    int sort_order
  }
  meal_ingredients {
    uuid id PK
    uuid meal_id FK
    text name
    text amount
    int sort_order
  }
  meal_swaps {
    uuid id PK
    uuid meal_id FK
    text name
    int sort_order
  }
  workouts {
    uuid id PK
    uuid user_id FK
    int week
    int weekday
    enum type
    text title
    text focus
    int duration_min
    enum intensity
    text time_start
    text time_end
    text video_url
    text description
  }
  meal_logs {
    uuid id PK
    uuid user_id FK
    uuid meal_id FK
    date date
    timestamptz completed_at
  }
  workout_logs {
    uuid id PK
    uuid user_id FK
    uuid workout_id FK
    date date
    timestamptz completed_at
  }
  water_logs {
    uuid user_id PK_FK
    date date PK
    int glasses_count
  }
  weight_logs {
    uuid user_id PK_FK
    date date PK
    numeric kg
  }
  measurement_logs {
    uuid id PK
    uuid user_id FK
    date date
    numeric waist_cm
    numeric arm_cm
    numeric thigh_cm
  }
  progress_photos {
    uuid id PK
    uuid user_id FK
    int week
    timestamptz taken_at
    text blob_url
  }
  push_subscriptions {
    uuid id PK
    uuid user_id FK
    text endpoint UK
    text p256dh
    text auth
    timestamptz created_at
  }
```

## Tables

### `users`

Authentication identity. Email/password (Lucia) per `PROJECT_PLAN.md`.

| Column          | Type          | Constraints                              | Notes                              |
| --------------- | ------------- | ---------------------------------------- | ---------------------------------- |
| `id`            | `uuid`        | PK, `default gen_random_uuid()`          |                                    |
| `email`         | `text`        | NOT NULL, UNIQUE, citext via lower-check | Normalised lowercase at app layer. |
| `password_hash` | `text`        | NOT NULL                                 | Argon2id hash.                     |
| `name`          | `text`        | NOT NULL                                 | Display name (e.g. `"მეი"`).       |
| `timezone`      | `text`        | NOT NULL, default `'Asia/Tbilisi'`       | IANA TZ for date rollover.         |
| `created_at`    | `timestamptz` | NOT NULL, default `now()`                |                                    |

Indexes: `unique (email)`.

### `sessions` (Lucia)

| Column       | Type          | Constraints                                | Notes                    |
| ------------ | ------------- | ------------------------------------------ | ------------------------ |
| `id`         | `text`        | PK                                         | Opaque token from Lucia. |
| `user_id`    | `uuid`        | NOT NULL, FK → users(id) ON DELETE CASCADE |                          |
| `expires_at` | `timestamptz` | NOT NULL                                   |                          |

Indexes: `(user_id)`.

### `user_settings`

One row per user. `user_id` is both PK and FK (1:1).

| Column                  | Type           | Constraints                          | Notes                               |
| ----------------------- | -------------- | ------------------------------------ | ----------------------------------- |
| `user_id`               | `uuid`         | PK, FK → users(id) ON DELETE CASCADE |                                     |
| `calorie_target`        | `integer`      | NOT NULL, default `1250`             | Sample uses `goal: 1250`.           |
| `p_target`              | `integer`      | NOT NULL, default `100`              | Protein g/day.                      |
| `n_target`              | `integer`      | NOT NULL, default `120`              | Carb g/day (`ნახშირწყლები`).        |
| `f_target`              | `integer`      | NOT NULL, default `40`               | Fat g/day (`ცხიმი`).                |
| `water_target_l`        | `numeric(3,2)` | NOT NULL, default `2.00`             | Sample uses `goalLiters: 2`.        |
| `target_weight_kg`      | `numeric(5,2)` | NULL                                 | Optional goal weight.               |
| `plan_start_date`       | `date`         | NOT NULL                             | Anchor for derived `current_week`.  |
| `current_week_override` | `integer`      | NULL, CHECK between 1 and 4          | Manual override of the 4-week ramp. |
| `notif_meals`           | `boolean`      | NOT NULL, default `true`             |                                     |
| `notif_workouts`        | `boolean`      | NOT NULL, default `true`             |                                     |
| `notif_water`           | `boolean`      | NOT NULL, default `true`             |                                     |
| `notif_weight`          | `boolean`      | NOT NULL, default `true`             |                                     |
| `theme`                 | `theme`        | NOT NULL, default `'system'`         | Enum.                               |

### `meals`

The per-user meal plan rows — two sets keyed by `day_type`. Matches the
five-row meals list in `TODAY.meals`.

| Column       | Type       | Constraints                                | Notes                                              |
| ------------ | ---------- | ------------------------------------------ | -------------------------------------------------- |
| `id`         | `uuid`     | PK                                         |                                                    |
| `user_id`    | `uuid`     | NOT NULL, FK → users(id) ON DELETE CASCADE |                                                    |
| `day_type`   | `day_type` | NOT NULL                                   | `workout` or `rest`.                               |
| `time`       | `text`     | NOT NULL                                   | `"HH:MM"` 24h (sample uses `"10:00"`, `"20:00"`).  |
| `name`       | `text`     | NOT NULL                                   | e.g. `"საუზმე"`.                                   |
| `summary`    | `text`     | NOT NULL                                   | The `desc` line (`"კვერცხის ომლეტი + ბოსტნეული"`). |
| `calories`   | `integer`  | NOT NULL                                   | kcal.                                              |
| `p_g`        | `integer`  | NOT NULL                                   | Protein g.                                         |
| `n_g`        | `integer`  | NOT NULL                                   | Carb g.                                            |
| `f_g`        | `integer`  | NOT NULL                                   | Fat g.                                             |
| `sort_order` | `integer`  | NOT NULL                                   | Display order within `(user_id, day_type)`.        |

Indexes: `(user_id, day_type, sort_order)`.

### `meal_ingredients`

Lines under a meal (from `meals-c.jsx` `ingredients[]`).

| Column       | Type      | Constraints                                | Notes                               |
| ------------ | --------- | ------------------------------------------ | ----------------------------------- |
| `id`         | `uuid`    | PK                                         |                                     |
| `meal_id`    | `uuid`    | NOT NULL, FK → meals(id) ON DELETE CASCADE |                                     |
| `name`       | `text`    | NOT NULL                                   | e.g. `"გამომცხვარი ქათმის მკერდი"`. |
| `amount`     | `text`    | NOT NULL                                   | Free-form (`"150 გრ"`, `"3 ს.კ."`). |
| `sort_order` | `integer` | NOT NULL                                   |                                     |

Indexes: `(meal_id, sort_order)`.

### `meal_swaps`

Alternative options for a meal (`meals-c.jsx` `swaps[]`).

| Column       | Type      | Constraints                                | Notes                     |
| ------------ | --------- | ------------------------------------------ | ------------------------- |
| `id`         | `uuid`    | PK                                         |                           |
| `meal_id`    | `uuid`    | NOT NULL, FK → meals(id) ON DELETE CASCADE |                           |
| `name`       | `text`    | NOT NULL                                   | e.g. `"🐟 თევზი (150გ)"`. |
| `sort_order` | `integer` | NOT NULL                                   |                           |

Indexes: `(meal_id, sort_order)`.

### `workouts`

The 4-week × 7-day plan (28 rows per user once seeded). Matches the
`weeks[]` × `days[]` grid in `plan-c.jsx`.

| Column         | Type           | Constraints                                | Notes                                                              |
| -------------- | -------------- | ------------------------------------------ | ------------------------------------------------------------------ |
| `id`           | `uuid`         | PK                                         |                                                                    |
| `user_id`      | `uuid`         | NOT NULL, FK → users(id) ON DELETE CASCADE |                                                                    |
| `week`         | `integer`      | NOT NULL, CHECK between 1 and 4            |                                                                    |
| `weekday`      | `integer`      | NOT NULL, CHECK between 0 and 6            | 0 = Mon (matches `plan-c.jsx` ordering `ორშაბათი`…`კვირა`).        |
| `type`         | `workout_type` | NOT NULL                                   | `pilates`, `cardio`, `combo`, `rest`.                              |
| `title`        | `text`         | NOT NULL                                   | Short label (e.g. `"პილატესი"`).                                   |
| `focus`        | `text`         | NULL                                       | `sub` line — null on rest days.                                    |
| `duration_min` | `integer`      | NULL                                       | Null on rest days. Sample range `35–45`.                           |
| `intensity`    | `intensity`    | NOT NULL                                   | Inherits the week's ramp by default (`light/medium/strong/heavy`). |
| `time_start`   | `text`         | NULL                                       | `"HH:MM"` — sample uses `"18:30"`.                                 |
| `time_end`     | `text`         | NULL                                       | `"HH:MM"` — sample uses `"19:30"`.                                 |
| `video_url`    | `text`         | NULL                                       | Optional YouTube/Vimeo embed link.                                 |
| `description`  | `text`         | NULL                                       | Long-form description for the workout detail screen.               |

Indexes: `unique (user_id, week, weekday)`.

### `meal_logs`

One row per `(user_id, meal_id, date)` completion. UI marks meals
`done`/`active`/`upcoming` (`shared.jsx`); only `done` produces a row.

| Column         | Type          | Constraints                                | Notes                    |
| -------------- | ------------- | ------------------------------------------ | ------------------------ |
| `id`           | `uuid`        | PK                                         |                          |
| `user_id`      | `uuid`        | NOT NULL, FK → users(id) ON DELETE CASCADE |                          |
| `meal_id`      | `uuid`        | NOT NULL, FK → meals(id) ON DELETE CASCADE |                          |
| `date`         | `date`        | NOT NULL                                   | User-local calendar day. |
| `completed_at` | `timestamptz` | NOT NULL, default `now()`                  |                          |

Indexes: `unique (user_id, meal_id, date)`, `(user_id, date)`.

### `workout_logs`

| Column         | Type          | Constraints                                   | Notes |
| -------------- | ------------- | --------------------------------------------- | ----- |
| `id`           | `uuid`        | PK                                            |       |
| `user_id`      | `uuid`        | NOT NULL, FK → users(id) ON DELETE CASCADE    |       |
| `workout_id`   | `uuid`        | NOT NULL, FK → workouts(id) ON DELETE CASCADE |       |
| `date`         | `date`        | NOT NULL                                      |       |
| `completed_at` | `timestamptz` | NOT NULL, default `now()`                     |       |

Indexes: `unique (user_id, workout_id, date)`, `(user_id, date)`.

### `water_logs`

Per-day glass counter. Composite PK `(user_id, date)` — upsert on tap.
Sample shows `filled: 5, total: 8` glasses (= 1.25 / 2 L).

| Column          | Type      | Constraints                          | Notes |
| --------------- | --------- | ------------------------------------ | ----- |
| `user_id`       | `uuid`    | PK, FK → users(id) ON DELETE CASCADE |       |
| `date`          | `date`    | PK                                   |       |
| `glasses_count` | `integer` | NOT NULL, default `0`, CHECK >= 0    |       |

### `weight_logs`

| Column    | Type           | Constraints                          | Notes |
| --------- | -------------- | ------------------------------------ | ----- |
| `user_id` | `uuid`         | PK, FK → users(id) ON DELETE CASCADE |       |
| `date`    | `date`         | PK                                   |       |
| `kg`      | `numeric(5,2)` | NOT NULL, CHECK > 0                  |       |

### `measurement_logs`

Optional waist/arm/thigh tape measurements per day.

| Column     | Type           | Constraints                                | Notes |
| ---------- | -------------- | ------------------------------------------ | ----- |
| `id`       | `uuid`         | PK                                         |       |
| `user_id`  | `uuid`         | NOT NULL, FK → users(id) ON DELETE CASCADE |       |
| `date`     | `date`         | NOT NULL                                   |       |
| `waist_cm` | `numeric(5,2)` | NULL                                       |       |
| `arm_cm`   | `numeric(5,2)` | NULL                                       |       |
| `thigh_cm` | `numeric(5,2)` | NULL                                       |       |

Indexes: `unique (user_id, date)`.

### `progress_photos`

Vercel Blob URL per uploaded photo, scoped to the week.

| Column     | Type          | Constraints                                | Notes                                        |
| ---------- | ------------- | ------------------------------------------ | -------------------------------------------- |
| `id`       | `uuid`        | PK                                         |                                              |
| `user_id`  | `uuid`        | NOT NULL, FK → users(id) ON DELETE CASCADE |                                              |
| `week`     | `integer`     | NOT NULL, CHECK between 1 and 4            |                                              |
| `taken_at` | `timestamptz` | NOT NULL, default `now()`                  |                                              |
| `blob_url` | `text`        | NOT NULL                                   | `https://*.public.blob.vercel-storage.com/…` |

Indexes: `(user_id, week, taken_at desc)`.

### `push_subscriptions`

Web Push (VAPID) endpoints. One device = one row.

| Column       | Type          | Constraints                                | Notes                             |
| ------------ | ------------- | ------------------------------------------ | --------------------------------- |
| `id`         | `uuid`        | PK                                         |                                   |
| `user_id`    | `uuid`        | NOT NULL, FK → users(id) ON DELETE CASCADE |                                   |
| `endpoint`   | `text`        | NOT NULL, UNIQUE                           | Browser-issued push endpoint URL. |
| `p256dh`     | `text`        | NOT NULL                                   | Client public key (base64url).    |
| `auth`       | `text`        | NOT NULL                                   | Client auth secret (base64url).   |
| `created_at` | `timestamptz` | NOT NULL, default `now()`                  |                                   |

Indexes: `unique (endpoint)`, `(user_id)`.

## Relationships summary

- `users` 1—1 `user_settings` (PK = FK).
- `users` 1—N `sessions`, `meals`, `workouts`, `meal_logs`,
  `workout_logs`, `water_logs`, `weight_logs`, `measurement_logs`,
  `progress_photos`, `push_subscriptions`.
- `meals` 1—N `meal_ingredients`, `meal_swaps`, `meal_logs`.
- `workouts` 1—N `workout_logs`.
- All FKs `ON DELETE CASCADE` so account deletion fully removes user data.

## Mapping to sample data

| `TODAY` field      | Maps to                                                                    |
| ------------------ | -------------------------------------------------------------------------- |
| `kcal.goal`        | `user_settings.calorie_target`                                             |
| `kcal.eaten`       | derived: sum of `meals.calories` for rows in `meal_logs` for the date      |
| `macros[].goal`    | `user_settings.{p,n,f}_target`                                             |
| `macros[].value`   | derived: sum of `meals.{p,n,f}_g` over today's `meal_logs`                 |
| `water.total`      | `ceil(user_settings.water_target_l / 0.25)` (1 glass = 0.25 L)             |
| `water.filled`     | `water_logs.glasses_count` for today                                       |
| `water.goalLiters` | `user_settings.water_target_l`                                             |
| `meals[]`          | `meals` filtered by today's `day_type`, ordered by `sort_order`            |
| `meals[].state`    | derived from `meal_logs` (done) + `time` vs. now (active/upcoming)         |
| `workout`          | `workouts` row at `(current_week, today_weekday)`                          |
| `weekBadge`        | derived: `plan_start_date` → current week 1–4 (or `current_week_override`) |

## Open questions (for T2.2)

- `email`: use Postgres `citext` extension vs. lowercasing at the app
  layer? Default: app-layer normalisation, plain `text` column.
- `weekday` numbering: storing `0 = Monday` (matches the design) — note
  this differs from JS `Date.getDay()` (`0 = Sunday`). Conversion will
  live in a single helper.
- `meal_logs.date`, `workout_logs.date`, `water_logs.date`,
  `weight_logs.date`: all interpreted in the user's `timezone`; queries
  must convert from `now() AT TIME ZONE users.timezone` before keying.
