import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { NotificationCountInfo } from "@/lib/types";

// API GET request to get unread notification counts
export async function GET() {
  try {
    // logged in user
    const { user } = await validateRequest();

    // user does not eixst, then unauthorized error
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // notifications count of only unread ones
    const unreadCount = await prisma.notification.count({
      where: {
        recipientId: user.id,
        read: false,
      },
    });

    // notification count info data
    const data: NotificationCountInfo = {
      unreadCount,
    };

    // success response
    return Response.json(data);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
