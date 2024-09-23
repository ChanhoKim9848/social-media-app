import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { FollowerInfo } from "@/lib/types";

// GET request to get followers data
export async function GET(
  req: Request,
  { params: { userId } }: { params: { userId: string } },
) {
  try {
    // check if user is logged in
    const { user: loggedInUser } = await validateRequest();

    // if user is not logged in, error
    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // end point where we can fetch the current follower information
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        followers: {
          where: {
            followerId: loggedInUser.id,
          },
          select: {
            followerId: true,
          },
        },
        _count: {
          select: {
            followers: true,
          },
        },
      },
    });

    // if user does not exist, user not found error
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // follower data
    const data: FollowerInfo = {
      followers: user._count.followers,
      isFollowedByUser: !!user.followers.length,
    };

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST request to follow a user
export async function POST(
  req: Request,
  { params: { userId } }: { params: { userId: string } },
) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.$transaction([
      prisma.follow.upsert({
        where: {
          // many to many relation, follow other users and
          followerId_followingId: {
            followerId: loggedInUser.id,
            followingId: userId,
          },
        },
        // create data in other user's followers list in db
        create: {
          followerId: loggedInUser.id,
          followingId: userId,
        },
        // update user data
        update: {},
      }),
      prisma.notification.create({
        data: {
          issuerId: loggedInUser.id,
          recipientId: userId,
          type: "FOLLOW",
        },
      }),
    ]);

    // success reponse
    return new Response();

    // error handler
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE request after unfollow a user
export async function DELETE(
  req: Request,
  { params: { userId } }: { params: { userId: string } },
) {
  try {
    const { user: loggedInUser } = await validateRequest();

    // if user trying to unfollow is not same as logged in user, return unauthorized
    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    await prisma.$transaction([
      // delete follower data from db after unfollow 
      prisma.follow.deleteMany({
        where: {
          followerId: loggedInUser.id,
          followingId: userId,
        },
      }),
      // notification after unfollow
      prisma.notification.deleteMany({
        where: {
          issuerId: loggedInUser.id,
          recipientId: userId,
          type: "FOLLOW",
        },
      }),
    ]);

// delete follower data
    // await prisma.follow.deleteMany({
    //   where: {
    //     followerId: loggedInUser.id,
    //     followingId: userId,
    //   },
    // });
    
    return new Response();
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
