import { validateRequest } from "@/auth";
import FollowButton from "@/components/FollowButton";
import FollowerCount from "@/components/FollowerCount";
import TrendsSidebar from "@/components/TrendsSidebar";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/UserAvatar";
import prisma from "@/lib/prisma";
import { FollowerInfo, getUserDataSelect, UserData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { formatDate } from "date-fns";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import UserPosts from "./UserPosts";

interface PageProps {
  params: { username: string };
}

// get user data from db
const getUser = cache(async (username: string, loggedInUserId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive",
      },
    },
    select: getUserDataSelect(loggedInUserId),
  });
  //   if user not found, return user
  if (!user) notFound();
  return user;
});

// function generates metadata of the user
export async function generateMetadata({
  params: { username },
}: PageProps): Promise<Metadata> {
  // get currently logged-in user's data
  const { user: loggedInUser } = await validateRequest();

  //   if user is not logged in, return nothing
  if (!loggedInUser) return {};

  const user = await getUser(username, loggedInUser.id);

  //   return display name of the user
  return {
    title: `${user.displayName}(@${user.username})`,
  };
}

// page of the user profile and layout
export default async function Page({ params: { username } }: PageProps) {
  const { user: loggedInUser } = await validateRequest();

  //   if user is not logged in, the text below will be displayed
  if (!loggedInUser) {
    return (
      <p className="text-destructive">
        You&apos;are not authorized to view this page
      </p>
    );
  }
  // get user data with username and logged in user
  const user = await getUser(username, loggedInUser.id);
  // layout and rendering pages
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <UserProfile user={user} loggedInUserId={loggedInUser.id} />
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h2 className="text-center text-2xl font-bold">
            {user.displayName}&apos;s posts
            </h2> 
        </div>
        <UserPosts userId={user.id}/>
      </div>
      <TrendsSidebar />
    </main>
  );
}

// get user data which only has the number of posts and followers
interface UserProfileProps {
  user: UserData;
  loggedInUserId: string;
}

// user profile data and layout
async function UserProfile({ user, loggedInUserId }: UserProfileProps) {
  const followerInfo: FollowerInfo = {
    // user profile shows the followers number and
    followers: user._count.followers,
    isFollowedByUser: user.followers.some(
      // checks if logged-in user is following the user of the profile
      ({ followerId }) => followerId === loggedInUserId,
    ),
  };
  return (
    <div className="h-fit w-full space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <UserAvatar
        avatarUrl={user.avatarUrl}
        size={250}
        className="mx-auto size-full max-h-60 max-w-60 rounded-full"
      />
      <div className="flex flex-wrap gap-3 sm:flex-nowrap">
        <div className="me-auto space-y-3">
          <div>
            <h1 className="text-3xl font-bold">{user.displayName}</h1>
            <div className="text-muted-foreground">@{user.username} </div>
          </div>
          {/* member date format */}
          <div>
            Member since:&nbsp;&nbsp;
            <span className="font-thin">
              {formatDate(user.createdAt, "d MMM, yyyy")}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span>
              Posts:{" "}
              <span className="font-semibold">
                {formatNumber(user._count.posts)}
              </span>
            </span>
            <FollowerCount userId={user.id} initialState={followerInfo} />
          </div>
        </div>
        {/* Edit profile button */}
        {/* if profile user is same as logged in user */}
        {user.id === loggedInUserId ? (
          <Button>Edit Profile</Button>
        ) : (
          <FollowButton userId={user.id} initialState={followerInfo} />
        )}
      </div>
      {/* optional user biography */}
      {user.bio && (
        <>
          <hr />
          <div className="overflow-hidden whitespace-pre-line break-words">
            {user.bio}
          </div>
        </>
      )}
    </div>
  );
}
