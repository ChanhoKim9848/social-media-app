import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import prisma from "./lib/prisma";
import { Lucia, Session, User } from "lucia";
import { cache } from "react";
import { cookies } from "next/headers";

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },

  // everytime we fetch our session on the frontend,
  //  we automatically get passed with this field
  getUserAttributes(databaseUserAttributes) {
    return {
      id: databaseUserAttributes.id,
      username: databaseUserAttributes.username,
      displayName: databaseUserAttributes.displayName,
      avatarUrl: databaseUserAttributes.avatarUrl,
      googleId: databaseUserAttributes.googleId,
    };
  },
});

// define session
// Defining custom session attributes requires 2 steps.
// First, add the required columns to the session table.
// You can type it by declaring the Register.DatabaseSessionAttributes type.
declare module "lucia" {
  // register
  interface Register {
    lucia: typeof lucia;
    DatabaseUserAttributes: databaseUserAttributes;
  }
}

// user data field
//Create a DatabaseUserAttributes interface in the module declaration
//and add your database columns.
// By default, Lucia will not expose any database columns to the User type.
// To add a username field to it, use the getUserAttributes() option.
interface databaseUserAttributes {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  googleId: string | null;
}

// user validate request
// This will check for the session cookie, validate it, and set a new cookie if necessary.
// Make sure to catch errors when setting cookies and wrap the function with cache()
// to prevent unnecessary database calls. To learn more, see the Validating requests page.

// CSRF protection should be implemented but Next.js handles it when using form actions
// (but not for API routes).

export const validateRequest = cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    // get user id from cookies
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;

    // if user is not logged in, return session to null
    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    const result = await lucia.validateSession(sessionId);
    // next.js throws when you attempt to set cookie when rendering page
    try {
      if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
    } catch {}

    return result;
  },
);
