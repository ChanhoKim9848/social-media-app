import { useToast } from "@/hooks/use-toast";
import {
  InfiniteData,
  QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { deleteComment, submitComment } from "./actions";
import { CommentsPage } from "@/lib/types";

// mutation for optimistic update for comments
export function useSubmitCommentMutation(postId: string) {
  // toast message
  const { toast } = useToast();
  // query client
  const queryClient = useQueryClient();

  // mutation
  const mutation = useMutation({
    mutationFn: submitComment,
    onSuccess: async (newComment) => {
      const queryKey: QueryKey = ["comments", postId];

      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<InfiniteData<CommentsPage, string | null>>(
        queryKey,
        (oldData) => {
          const firstPage = oldData?.pages[0];

          if (firstPage) {
            return {
              pageParams: oldData.pageParams,
              pages: [
                {
                  previousCursor: firstPage.previousCursor,
                  comments: [...firstPage.comments, newComment],
                },
                ...oldData.pages.slice(1),
              ],
            };
          }
        },
      );
      queryClient.invalidateQueries({
        queryKey,
        predicate(query) {
          return !query.state.data;
        },
      });
      // comment success message
      toast({
        description: "Commented",
      });
    },
    // error handle
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to submit comment, Please try again.",
      });
    },
  });
  return mutation;
}

export function useDeleteCommentMutation() {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: async (deletedComment) => {
      const queryKey: QueryKey = ["comments", deletedComment.postId];

      await queryClient.cancelQueries({ queryKey });

      // mutation for optimistic update after delete comment.
      queryClient.setQueryData<InfiniteData<CommentsPage, string | null>>(
        queryKey,
        (oldData) => {
          // if old data is null, return nothing.
          if (!oldData) return;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              previousCursor: page.previousCursor,
              comments: page.comments.filter((c) => c.id !== deletedComment.id),
            })),
          };
        },
      );
      // message after deletion.
      toast({
        description: `Comment deleted`,
      });
    },
    // error handle.
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to delete comment, Please try again",
      });
    },
  });

  return mutation;
}
