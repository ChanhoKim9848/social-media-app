"use client";

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import Post from "@/components/posts/Post";
import PostsLoadingSkeleton from "@/components/PostsLoadingSkeleton";
import kyInstance from "@/lib/ky";
import { PostsPage } from "@/lib/types";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

// functions that shows following users' posts on the feed
export default function FollowingFeed() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,

    // infinite query to fetch new posts whenever user scrolls down and reaches the bottom
  } = useInfiniteQuery({
    queryKey: ["post-feed", "following"],

    // fetch data with query keys (following api to get following users' posts)
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          "/api/posts/following",
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<PostsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  //   if query status is loading, shows spin sign
  if (status === "pending") {
    return <PostsLoadingSkeleton />;
  }

  // successfully fetch the page, but there is no post at all
  if (status === "success" && !posts.length && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">
        No post found. Start following people to see their posts here.
      </p>
    );
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occurred while loading posts.
      </p>
    );
  }

  // call infiniteScrollContainer function that if user scroller down and reaches the bottom of the page,
  // the page loads more older posts
  return (
    <>
      <InfiniteScrollContainer
        className="space-y-5"
        onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
      >
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
        {isFetchingNextPage && (
          <Loader2 className="mx-auto my-3 animate-spin" />
        )}
      </InfiniteScrollContainer>
    </>
  );
}
