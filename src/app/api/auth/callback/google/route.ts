import { google, lucia } from "@/auth";
import kyInstance from "@/lib/ky";
import prisma from "@/lib/prisma";
import streamServerClient from "@/lib/stream";
import { slugify } from "@/lib/utils";
import { OAuth2RequestError } from "arctic";
import { generateIdFromEntropySize } from "lucia";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  // values we get back from google
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");

  // value from the saved cookie
  const storedState = cookies().get("state")?.value;
  const storedCodeVerifier = cookies().get("code_verifier")?.value;

  if (
    // comparison for security
    !code ||
    !state ||
    !storedState ||
    !storedCodeVerifier ||
    state !== storedState
  ) {
    // error response
    return new Response(null, { status: 400 });
  }
  try {
    // request access tokens
    const tokens = await google.validateAuthorizationCode(
      code,
      storedCodeVerifier,
    );

    // fetch google user information:
    // send the tokens to google server again to get user information
    //  end point of google server
    const googleUser = await kyInstance
      .get(
        "https://www.googleapis.com/oauth2/v1/userinfo",
        {
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
          },
        },
        //   only need id and name of the user
        //  email is not needed as the user logged in with google email.
      )
      .json<{ id: string; name: string }>();

    // search google user id from db and put the value into existingUser
    const existingUser = await prisma.user.findUnique({
      where: {
        googleId: googleUser.id,
      },
    });

    // if this google user already exists, this user just logins
    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
      return new Response(null, {
        status: 302,
        headers: {
          // front page
          Location: "/",
        },
      });
    }

    const userId = generateIdFromEntropySize(10);

    const username = slugify(googleUser.name) + "-" + userId.slice(0, 4);

    await prisma.$transaction(async (tx) => {
      // if user and email do not exist in db
      await tx.user.create({
        data: {
          id: userId,
          username,
          displayName: googleUser.name,
          googleId: googleUser.id,
        },
      });
      // stream user
      await streamServerClient.upsertUser({
        id: userId,
        username,
        name: username,
      });
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return new Response(null, {
      status: 302,
      headers: {
        // front page
        Location: "/",
      },
    });
  } catch (error) {
    console.error(error);
    if (error instanceof OAuth2RequestError) {
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
}
