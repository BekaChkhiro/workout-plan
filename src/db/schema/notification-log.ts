import { relations, sql } from "drizzle-orm";
import { pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { users } from "./users";

export const notificationLog = pgTable(
  "notification_log",
  {
    id: uuid()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    kind: text().notNull(), // 'meal' | 'workout' | 'water' | 'weight'
    targetAt: timestamp({ withTimezone: true }).notNull(),
    sentAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("notification_log_user_kind_target_unique").on(t.userId, t.kind, t.targetAt)],
);

export const notificationLogRelations = relations(notificationLog, ({ one }) => ({
  user: one(users, {
    fields: [notificationLog.userId],
    references: [users.id],
  }),
}));

export type NotificationLog = typeof notificationLog.$inferSelect;
export type NewNotificationLog = typeof notificationLog.$inferInsert;
