"use client";

import useFollowerInfo from "@/hooks/useFollowerInfo";
import { FollowerInfo } from "@/lib/types";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
import kyInstance from "@/lib/ky";
import { useToast } from "@/hooks/use-toast";

interface FollowButtonProps {
  userId: string;
  initialState: FollowerInfo;
}

// follow button function
export default function FollowButton({
  userId,
  initialState,
}: FollowButtonProps) {
  // toast message function
  const { toast } = useToast();

  // get query 
  const queryClient = useQueryClient();
  // get user data
  const { data } = useFollowerInfo(userId, initialState);

  const queryKey: QueryKey = ["follower-info", userId];

  // if user follows other user, call delete api (delete user id from other user's followers list)
  // if user unfollows other user, call post api (put user id into other user's followers list)
  const { mutate } = useMutation({
    mutationFn: () =>
      data.isFollowedByUser
        ? kyInstance.delete(`/api/users/${userId}/followers`)
        : kyInstance.post(`/api/users/${userId}/followers`),
    onMutate: async () => {
      const queryKey: QueryKey = ["follower-info", userId];

      await queryClient.cancelQueries({ queryKey });

      const previousState = queryClient.getQueryData<FollowerInfo>(queryKey);

    // Follow / Unfollow handle
    // mutation for updating ui right after user follow/unfollow others
      queryClient.setQueryData<FollowerInfo>(queryKey, () => ({
        followers:
          (previousState?.followers || 0) +
          (previousState?.isFollowedByUser ? -1 : 1),
        isFollowedByUser: !previousState?.isFollowedByUser,
      }));
      return { previousState };
    },

    // error handle
    onError(error, variables, context) {
      queryClient.setQueryData(queryKey, context?.previousState);
      console.error(error);
      toast({
        variant: "destructive",
        description: "Something went wrong, please try again.",
      });
    },
  });

  return (
    <Button
      // update after follow / unfollow
      variant={data.isFollowedByUser ? "secondary" : "default"}
      onClick={() => mutate()}
    >
      {/* if following, show Unfollow button, else Follow */}
      {data.isFollowedByUser ? "Unfollow" : "Follow"}
    </Button>
  );
}
