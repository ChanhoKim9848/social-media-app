"use client";

import useFollowerInfo from "@/hooks/useFollowerInfo";
import { FollowerInfo } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

interface FollowerCountProps {
  userId: string;
  initialState: FollowerInfo;
}

// Follower count for optimistic update on user profile
export default function FollowerCount({
  userId,
  initialState,
}: FollowerCountProps) {
  // everytime we update follower account by following a user,
  // we get cached data back, so we get optimistic update value back
  // instead of static count that we get from the server
  const { data } = useFollowerInfo(userId, initialState);

  return (
    <span>
      Followers:{" "}
      <span className="font-semibold">{formatNumber(data.followers)}</span>
    </span>
  );
}
