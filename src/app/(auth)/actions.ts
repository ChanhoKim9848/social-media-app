"use server";

import { lucia, validateRequest } from "@/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  // current session
  const { session } = await validateRequest();

  //   if session does not exist, user not logged
  if (!session) {
    throw new Error("Unauthorized");
  }

  //   logout, invalidate session
  await lucia.invalidateSession(session.id);

  //   empty session cookie
  const sessionCookie = lucia.createBlankSessionCookie();

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  //   page goes to login page
  return redirect("/login");
}
