import { useToast } from "@/hooks/use-toast";
import kyInstance from "@/lib/ky";
import { BookmarkInfo } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { BookmarkIcon } from "lucide-react";

interface BookmarkButtonProps {
  postId: string;
  initialState: BookmarkInfo;
}

// Bookmark button function
export default function BookmarkButton({
  postId,
  initialState,
}: BookmarkButtonProps) {
  // toast message function
  const { toast } = useToast();
  // get query
  const queryClient = useQueryClient();

  const queryKey: QueryKey = ["bookmark-info", postId];

  // fetch bookmark data of the post
  const { data } = useQuery({
    queryKey: ["bookmark-info", postId],
    queryFn: () =>
      kyInstance.get(`/api/posts/${postId}/bookmark`).json<BookmarkInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  });

  // mutation for optimistic update
  const { mutate } = useMutation({
    mutationFn: () =>
      data.isBookmarkedByUser
        ? kyInstance.delete(`/api/posts/${postId}/bookmark`)
        : kyInstance.post(`/api/posts/${postId}/bookmark`),
    onMutate: async () => {
      // as soon as click the button, it will show toast message
      toast({
        // prefix decided after checking bookmark state
        description: `${data.isBookmarkedByUser ? "Unbookmarked" : "Bookmarked"}`,
      });

      await queryClient.cancelQueries({ queryKey });

      const previousState = queryClient.getQueryData<BookmarkInfo>(queryKey);

      queryClient.setQueryData<BookmarkInfo>(queryKey, () => ({
        isBookmarkedByUser: !previousState?.isBookmarkedByUser,
      }));

      return { previousState };
    },
    onError(error, variables, context) {
      queryClient.setQueryData(queryKey, context?.previousState);
      console.error(error);
      toast({
        variant: "destructive",
        description: "Something went wrong, please try again.",
      });
    },
  });

  // bookmark icon action
  return (
    <button onClick={() => mutate()} className="flex items-center gap-2">
      <BookmarkIcon
        className={cn(
          "size-5",

          // if is book marked, fill bookmark icon
          data.isBookmarkedByUser && "fill-primary text-primary",
        )}
      />
    </button>
  );
}
