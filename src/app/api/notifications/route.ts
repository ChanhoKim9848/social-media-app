import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { notificationsInclude, NotificationsPage } from "@/lib/types";
import { NextRequest } from "next/server";

// API GET request to get notification data
export async function GET(req: NextRequest) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

    // return the number of page
    const pageSize = 10;

    // authorization check
    const { user } = await validateRequest();

    // user does not eixst, then error
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // get notifications data from db
    // and display them on the notification list from latest to oldest
    const notifications = await prisma.notification.findMany({
      where: {
        recipientId: user.id,
      },
      include: notificationsInclude,
      orderBy: { createdAt: "desc" },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    // next cursor, if notification exists, show the size of notification
    // else null
    const nextCursor =
      notifications.length > pageSize ? notifications[pageSize].id : null;

    // notification page is shown
    const data: NotificationsPage = {
      notifications: notifications.slice(0, pageSize),
      nextCursor,
    };
    // return success response
    return Response.json(data);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
