import { validateRequest } from "@/auth";
import streamServerClient from "@/lib/stream";

export async function GET() {
  try {

    // logged in user data
    const { user } = await validateRequest();

    console.log("Calling get-token for user: ", user?.id);

    // user does not eixst, then unauthorized error
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    //   token valid time
    const expirationTime = Math.floor(Date.now() / 1000) + 60 * 60;

    //   time when it is issued, current time, there will be time difference between the server and client
    //   subtract 1 min to fix the time difference and pretend that token is issued a min earlier
    const issuedAt = Math.floor(Date.now() / 1000) - 60;

    // create user token for stream chat
    const token = streamServerClient.createToken(
      user.id,
      expirationTime,
      issuedAt,
    );

    return Response.json({ token });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
