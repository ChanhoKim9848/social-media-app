import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude, PostsPage } from "@/lib/types";
import { NextRequest } from "next/server";

// API GET request to fetch posts data on for-you feed
export async function GET(req: NextRequest) {
  try {
    // cursor for pagination
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

    // return the number of page
    const pageSize = 10;

    // authorization check
    const { user } = await validateRequest();

    // user does not eixst, then unauthorized error
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // get posts data from db 
    // and sort them from latest to oldest
    const posts = await prisma.post.findMany({
      include: getPostDataInclude(user.id),
      orderBy: { createdAt: "desc" },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    // if posts exist, show the size of posts, else null
    const nextCursor = posts.length > pageSize ? posts[pageSize].id : null;

    // Posts page is shown
    const data: PostsPage = {
      posts: posts.slice(0, pageSize),
      nextCursor,
    };

    // return success response
    return Response.json(data);
    
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
