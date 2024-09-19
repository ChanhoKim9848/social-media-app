import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { BookmarkInfo } from "@/lib/types";

// GET request to get the post's bookmarks data
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

    // find bookmark data from db
    const bookmark = await prisma.bookmark.findUnique({
      where:{
        userId_postId:{
          userId:loggedInUser.id,
          postId,
        }
      }
    })

    // bookmark data
    const data:BookmarkInfo={
      isBookmarkedByUser:!!bookmark,
    }


    return Response.json(data);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST request to bookmark a post
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

    // put bookmark data into db after bookmarking
    await prisma.bookmark.upsert({
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
    });

    // success response
    return new Response();

  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE request for cancellation of bookmark
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

    // bookmark cancel and delete data from db
    await prisma.bookmark.deleteMany({
      where: {
        userId: loggedInUser.id,
        postId,
      },
    });
    // success response 
    return new Response()

    // error handler
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
