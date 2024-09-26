import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude, PostsPage } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // search queries in the search params
    const q = req.nextUrl.searchParams.get("q") || "";

    // cursor for pagination
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

    // & for combination search
    const searchQuery = q.split(" ").join(" & ");

    // return the number of page
    const pageSize = 10;

    // authorization check
    const { user } = await validateRequest();

    // user does not eixst, then unauthorized error
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const posts = await prisma.post.findMany({
      where: {
        OR: [
          {
            content: {
              search: searchQuery,
            },
          },
          {
            user: {
              displayName: {
                search: searchQuery,
              },
            },
          },
          {
            user: {
              username: {
                search: searchQuery,
              },
            },
          },
        ],
      },
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
