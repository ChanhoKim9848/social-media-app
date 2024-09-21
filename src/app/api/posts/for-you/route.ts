import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude, PostsPage } from "@/lib/types";
import { NextRequest } from "next/server";

// API GET request to get posts data on for-you feed
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

    const posts = await prisma.post.findMany({
      include: getPostDataInclude(user.id),
      orderBy: { createdAt: "desc" },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const nextCursor = posts.length > pageSize ? posts[pageSize].id : null;

    const data: PostsPage = {
      posts: posts.slice(0, pageSize),
      nextCursor,
    };

    return Response.json(data);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
