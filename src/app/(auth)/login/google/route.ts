import { google } from "@/auth";
import { generateCodeVerifier, generateState } from "arctic";
import { cookies } from "next/headers";

// get request to get google profile and email after the authentication.
export async function GET() {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  const url = await google.createAuthorizationURL(state, codeVerifier, {
    scopes: ["profile", "email"],
  });

  // lucia documentation : get cookie
  cookies().set("state", state, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    // if we wait longer than this, before we get redirect, cookies are not valid anymore
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  cookies().set("code_verifier", codeVerifier, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    // if we wait longer than this, before we get redirect, cookies are not valid anymore
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  return Response.redirect(url);
}
