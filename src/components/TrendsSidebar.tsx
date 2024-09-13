import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import UserAvatar from "./UserAvatar";
import { unstable_cache } from "next/cache";
import { formatNumber } from "@/lib/utils";
import FollowButton from "./FollowButton";
import { getUserDataSelect } from "@/lib/types";

export default function TrendsSidebar() {
  return (
    <div className="sticky top-[5.25rem] hidden h-fit w-72 flex-none space-y-5 md:block lg:w-80">
      {/* loading state and displaying sign before data is loaded for suggestion */}
      <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
        <FollowSuggestion />
        <TrendingTopics />
      </Suspense>
    </div>
  );
}

// function that recommends users whom the current user is not following.
async function FollowSuggestion() {
  // get current user data.
  const { user } = await validateRequest();

  // if user is not logged in, no users are recommended.
  if (!user) return null;

  //  user to follow function recommends other users account on the right side.
  const usersToFollow = await prisma.user.findMany({
    where: {
      // recommend users that current user is not following.
      NOT: {
        id: user.id,
      },
      followers:{
        none:{
          followerId: user.id,
        }
      }
    },
    // get a logged in user data
    select: getUserDataSelect(user.id),
    // maximum users to be recommended
    take: 5,
  });
  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">People You May Know</div>
      {usersToFollow.map((user) => (
        <div key={user.id} className="flex items-center justify-between gap-3">
          <Link
            href={`/users/${user.username}`}
            className="flex items-center gap-3"
          >
            <UserAvatar avatarUrl={user.avatarUrl} className="flex-none" />
            <div>
              <p className="line-clamp-1 break-all font-semibold hover:underline">
                {user.displayName}
              </p>
              <p className="line-clamp-1 break-all text-muted-foreground">
                @{user.username}
              </p>
            </div>
          </Link>
          <FollowButton
            userId={user.id}
            initialState={{
              // the number of followers
              followers: user._count.followers,
              isFollowedByUser: user.followers.some(
                ({ followerId }) => followerId === user.id,
              ),
            }}
          />
        </div>
      ))}
    </div>
  );
}

const getTrendingTopics = unstable_cache(
  async () => {
    // get most count of hashtag data from the database
    // raw query
    const result = await prisma.$queryRaw<{ hashtag: string; count: bigint }[]>`
            SELECT LOWER(unnest(regexp_matches(content, '#[[:alnum:]_]+','g'))) AS hashtag, COUNT(*) AS count
            FROM posts 
            GROUP BY (hashtag)
            ORDER BY count DESC, hashtag ASC
            LIMIT 5
        `;
    return result.map((row) => ({
      hashtag: row.hashtag,
      count: Number(row.count),
    }));
  },
  ["trending_topics"],
  {
    // the variable of the time that gets trending topics every revalidate secs
    revalidate: 60,
  },
);

// Trending topics (hashtags) function on the right side bar
// function that shows trending topics by hashtags on the right side of the page.
async function TrendingTopics() {
  const trendingTopics = await getTrendingTopics();
  return (
    // count the number of hashtags and sorted by ascending order
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">Trending topics</div>
      {trendingTopics.map(({ hashtag, count }) => {
        const title = hashtag.split("#")[1];

        // display hashtags from highest to lowest
        return (
          <Link key={title} href={`/hashtag/${title}`} className="block">
            <p
              className="line-clamp-1 break-all font-semibold hover:underline"
              title={hashtag}
            >
              {hashtag}
            </p>
            {/* format number function for big number of hashtag count */}
            <p className="text-sm text-muted-foreground">
              {formatNumber(count)}
              {/* plural or singular form of post by the number of count */}
              {count === 1 ? " post" : " posts"}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
