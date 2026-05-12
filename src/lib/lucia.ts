import "server-only";

import { cache } from "react";
import { eq } from "drizzle-orm";
import { Lucia, TimeSpan } from "lucia";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { cookies } from "next/headers";

import { db } from "@/db";
import { sessions, users } from "@/db/schema";

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
  sessionExpiresIn: new TimeSpan(365, "d"),
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    },
  },
  getUserAttributes: (attrs) => ({
    email: attrs.email,
    name: attrs.name,
    timezone: attrs.timezone,
    createdAt: attrs.createdAt,
  }),
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      email: string;
      name: string;
      timezone: string;
      createdAt: Date;
      passwordHash: string;
    };
  }
}

export type { Session, User } from "lucia";

const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export const validateRequest = cache(async () => {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(lucia.sessionCookieName)?.value ?? null;

  if (!sessionId) {
    return { user: null, session: null } as const;
  }

  const result = await lucia.validateSession(sessionId);

  try {
    if (!result.session) {
      const blank = lucia.createBlankSessionCookie();
      cookieStore.set(blank.name, blank.value, blank.attributes);
    } else if (result.session.expiresAt.getTime() - Date.now() < ONE_YEAR_MS - THIRTY_DAYS_MS) {
      // Session last refreshed >30 days ago — extend to now + 1 year
      const newExpiresAt = new Date(Date.now() + ONE_YEAR_MS);
      await db
        .update(sessions)
        .set({ expiresAt: newExpiresAt })
        .where(eq(sessions.id, result.session.id));
      const refreshed = lucia.createSessionCookie(result.session.id);
      cookieStore.set(refreshed.name, refreshed.value, {
        ...refreshed.attributes,
        expires: newExpiresAt,
      });
    }
  } catch {
    // Cookie writes fail during static rendering — swallow silently
  }

  return result;
});
