import { relations, sql } from "drizzle-orm";
import { check, index, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { users } from "./users";

export const progressPhotos = pgTable(
  "progress_photos",
  {
    id: uuid()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    week: integer().notNull(),
    takenAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    blobUrl: text().notNull(),
  },
  (t) => [
    index("progress_photos_user_id_week_taken_at_idx").on(t.userId, t.week, t.takenAt.desc()),
    check("progress_photos_week_range", sql`${t.week} BETWEEN 1 AND 4`),
  ],
);

export const progressPhotosRelations = relations(progressPhotos, ({ one }) => ({
  user: one(users, {
    fields: [progressPhotos.userId],
    references: [users.id],
  }),
}));

export const insertProgressPhotoSchema = createInsertSchema(progressPhotos);
export const selectProgressPhotoSchema = createSelectSchema(progressPhotos);

export type ProgressPhoto = typeof progressPhotos.$inferSelect;
export type NewProgressPhoto = typeof progressPhotos.$inferInsert;
