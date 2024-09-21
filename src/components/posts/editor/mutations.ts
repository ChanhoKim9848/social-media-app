import { useToast } from "@/hooks/use-toast";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { submitPost } from "./actions";
import { PostsPage } from "@/lib/types";
import { useSession } from "@/app/(main)/SessionProvider";

// function that updates the feed immediately after posts are created or deleted
// even if the page is loading
export function useSubmitPostMutation() {
  // toast message
  const { toast } = useToast();
  // query client
  const queryClient = useQueryClient();
  // user session
  const { user } = useSession();

  // mutation function to update page right after action executes
  const mutation = useMutation({
    mutationFn: submitPost,
    onSuccess: async (newPost) => {
      const queryFilter = {
        queryKey: ["post-feed"],
        predicate(query) {
          return (
            // mutation (update page) shows new posts right after created them
            // including for-you feed, and the feed on user's profile
            query.queryKey.includes("for-you") ||
            (query.queryKey.includes("user-posts") &&
              query.queryKey.includes(user.id))
          );
        },
      } satisfies QueryFilters;

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilter,
        (oldData) => {
          const firstPage = oldData?.pages[0];

          if (firstPage) {
            return {
              pageParams: oldData.pageParams,
              pages: [
                {
                  posts: [newPost, ...firstPage.posts],
                  nextCursor: firstPage.nextCursor,
                },
                ...oldData.pages.slice(1),
              ],
            };
          }
        },
      );

      //  Edge case: if data is empty, undefined or null, we invalidate the feed
      //  this only happens when we create a new post, before the first page is loaded
      queryClient.invalidateQueries({
        queryKey: queryFilter.queryKey,
        predicate(query) {
          return queryFilter.predicate(query) && !query.state.data;
        },
      });

      toast({
        description: "Post createdW",
      });
    },
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to post, Please try again.",
      });
    },
  });
  return mutation;
}
