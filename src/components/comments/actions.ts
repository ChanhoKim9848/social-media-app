"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getCommentDataInclude, PostData } from "@/lib/types";
import { createCommentSchema } from "@/lib/validation";

// function that submits new comment to the database after create new comments
export async function submitComment({
  post,
  content,
}: {
  post: PostData;
  content: string;
}) {
  // authenticated user
  const { user } = await validateRequest();

  // if user does not exist, throw unauthorized
  if (!user) throw Error("Unauthorized");

  const { content: contentValidated } = createCommentSchema.parse({ content });

  const [newComment] = await prisma.$transaction([
    // create new comment data in db
    prisma.comment.create({
      data: {
        content: contentValidated,
        postId: post.id,
        userId: user.id,
      },
      include: getCommentDataInclude(user.id),
    }),
    // notification if the author of post is different from the user who commented
    ...(post.user.id != user.id
      ? [
          prisma.notification.create({
            data: {
              issuerId: user.id,
              recipientId: post.user.id,
              postId: post.id,
              type: "COMMENT",
            },
          }),
        ]
      : []),
  ]);

  return newComment;
}

// functiom that delete comments
export async function deleteComment(id: string) {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const comment = await prisma.comment.findUnique({
    where: { id },
  });
  if (!comment) throw new Error("Comment not found");

  if (comment.userId !== user.id) throw new Error("Unauthorized");

  const deletedComment = await prisma.comment.delete({
    where: { id },
    include: getCommentDataInclude(user.id),
  });
  return deletedComment;
}
