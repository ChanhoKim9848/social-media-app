import { toast, useToast } from "@/hooks/use-toast";
import { PostsPage } from "@/lib/types";
import { useUploadThing } from "@/lib/uploadthing";
import { UpdateUserProfileValues } from "@/lib/validation";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { updateUserProfile } from "./action";

// function that use mutation to update user profile images on the feed and profile page immediately
export function useUpdateProfileMutation() {
  const {} = useToast();

  const router = useRouter();

  const queryClient = useQueryClient();

  //   upload on UploadThing
  const { startUpload: startAvatarUpload } = useUploadThing("avatar");

  //  mutation
  const mutation = useMutation({
    mutationFn: async ({
      values,
      avatar,
    }: {
      values: UpdateUserProfileValues;
      avatar?: File;
    }) => {
      return Promise.all([
        // update user profile image and upload avatar
        updateUserProfile(values),
        avatar && startAvatarUpload([avatar]),
      ]);
    },
    onSuccess: async ([updatedUser, uploadResult]) => {
      // new avatar
      const newAvatarUrl = uploadResult?.[0].serverData.avatarUrl;

      const queryFilter: QueryFilters = {
        queryKey: ["post-feed"],
      };

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilter,
        (oldData) => {
          // if old data does not exist, return nothing
          if (!oldData) return;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              posts: page.posts.map((post) => {
                if (post.user.id === updatedUser.id) {
                  return {
                    ...post,
                    user: {
                      ...updatedUser,
                      // if new avatar exists, use new one, otherwise use existing one
                      avatarUrl: newAvatarUrl || updatedUser.avatarUrl,
                    },
                  };
                }
                // if this post is not our post, we do not modify and return previous post
                return post;
              }),
            })),
          };
        },
      );

      // refresh router
      router.refresh();

      // toast message after updating profile
      toast({
        description: "Profile updated",
      });
    },

    // error handle
    onError(error, variables, context) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to update profile, please try again.",
      });
    },
  });
  return mutation;
}
    