import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { LikeInfo } from "@/lib/types";

// GET request to get the post's likes data
export async function GET(
  req: Request,
  { params: { postId } }: { params: { postId: string } },
) {
  try {
    // check if user is logged in
    const { user: loggedInUser } = await validateRequest();

    // if user is not logged in, error
    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        likes: {
          where: {
            userId: loggedInUser.id,
          },
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    // post does not exist, post not found
    if (!post) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    const data: LikeInfo = {
      likes: post._count.likes,
      isLikedByUser: !!post.likes.length,
    };

    return Response.json(data);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST request to like a post
export async function POST(
  req: Request,
  { params: { postId } }: { params: { postId: string } },
) {
  try {
    // check if user is logged in
    const { user: loggedInUser } = await validateRequest();

    // if user is not logged in, error
    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        userId: true,
      },
    });

    // if post does not exist, error 404
    if (!post) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    // transaction: either below two operations succeed or fail as a whole,
    // if second one fails,
    // the first one will be rolled back and show error message instead.
    await prisma.$transaction([
      // upsert like of post data into db
      prisma.like.upsert({
        where: {
          userId_postId: {
            userId: loggedInUser.id,
            postId,
          },
        },
        create: {
          userId: loggedInUser.id,
          postId,
        },
        update: {},
      }),

      // create notification data in db
      ...(loggedInUser.id !== post.userId
        ? [
            prisma.notification.create({
              data: {
                issuerId: loggedInUser.id,
                recipientId: post.userId,
                postId,
                type: "LIKE",
              },
            }),
          ]
        : // if they are the same (same user will not have notificiation for likes),
          // return empty array (no notification)
          []),
    ]);

    return new Response();
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE request to unlike
export async function DELETE(
  req: Request,
  { params: { postId } }: { params: { postId: string } },
) {
  try {
    // check if user is logged in
    const { user: loggedInUser } = await validateRequest();

    // if user is not logged in, error
    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        userId: true,
      },
    });

    // if post does not exist, error 404
    if (!post) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    await prisma.$transaction([
      // unlike and delete data from db
      prisma.like.deleteMany({
        where: {
          userId: loggedInUser.id,
          postId,
        },
      }),
      // delete notification data from db 
      prisma.notification.deleteMany({
        where: {
          issuerId: loggedInUser.id,
          recipientId: post.userId,
          postId,
          type: "LIKE",
        },
      }),
    ]);

    // success response
    return new Response();

    // error handler
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
