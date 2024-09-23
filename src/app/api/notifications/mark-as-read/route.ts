import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";

// PATCH request to update data
export async function PATCH() {
  try {
    // logged in user
    const { user } = await validateRequest();

    // user does not eixst, then unauthorized error
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // update notification after read
    await prisma.notification.updateMany({
      where: {
        recipientId: user.id,
        read: false,
      },
      data: {
        read: true,
      },
    });

    return new Response();
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
