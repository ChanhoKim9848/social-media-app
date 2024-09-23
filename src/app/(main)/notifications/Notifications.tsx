"use client";

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import PostsLoadingSkeleton from "@/components/PostsLoadingSkeleton";
import kyInstance from "@/lib/ky";
import { NotificationsPage } from "@/lib/types";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Notification from "./Notification";
import { useEffect } from "react";

// functions that shows all the notifications
export default function Notifications() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,

    // infinite query to fetch new posts whenever user scrolls down and reaches the bottom
  } = useInfiniteQuery({
    // fetch data with query keys (following api to get all the posts displayed on the notification page)
    queryKey: ["post-feed", "bookmarks"],

    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          "/api/notifications",
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<NotificationsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const queryClient = useQueryClient();

  // mutation for optimistic update after read notifications
  // the count becomes immediately zero after read them
  const { mutate } = useMutation({
    mutationFn: () => kyInstance.patch("/api/notifications/mark-as-read"),
    onSuccess: () => {
      queryClient.setQueryData(["unread-notification-count"], {
        unreadCount: 0,
      });
    },
    // error handler
    onError(error) {
      console.error("Failed to mark notifications as read", error);
    },
  });

  // as soon as this component renders and comes to the screen
  // it will call mutate and mark all notifications as read
  useEffect(() => {
    mutate();
  }, [mutate]);

  const notifications = data?.pages.flatMap((page) => page.notifications) || [];

  //   if query status is loading, shows spin sign
  if (status === "pending") {
    return <PostsLoadingSkeleton />;
  }

  // successfully fetch the page, but there is no notifications at all
  if (status === "success" && !notifications.length && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">
        You do not have any notifications.
      </p>
    );
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occurred while loading notifications.
      </p>
    );
  }

  // call infiniteScrollContainer function that if user scroller down and reaches the bottom of the page,
  // the page loads more older posts
  return (
    // infinite scroll for notifications
    <InfiniteScrollContainer
      className="space-y-5"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {notifications.map((notification) => (
        // render new notification
        <Notification key={notification.id} notification={notification} />
      ))}
      {/* while fetching, show spin animation */}
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  );
}
