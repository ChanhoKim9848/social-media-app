import { PostData, PostsPage } from "@/lib/types";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { deletePost } from "./actions";
import { useToast } from "@/hooks/use-toast";

export function useDeletePostMutation() {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const router = useRouter();
  const pathname = usePathname();

  const mutation = useMutation({
    // mutation function for delete post function
    mutationFn: deletePost,

    // delete post function
    onSuccess: async (deletedPost) => {
      const queryFilter: QueryFilters = { queryKey: ["post-feed"] };

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilter,
        (oldData) => {
          // feed is empty, we do not delete any post
          if (!oldData) return;

          // delete post and update the feed after
          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              posts: page.posts.filter((p) => p.id !== deletedPost.id),
            })),
          };
        },
      );

      // message afte deletion
      toast({
        description: `Post deleted`,
      });
      if (pathname === `/posts/${deletedPost.id}`) {
        router.push(`/users/${deletedPost.user.username}`);
      }
    },

    // error handle
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to delete post, Please try again",
      });
    },
  });

  return mutation;
}
