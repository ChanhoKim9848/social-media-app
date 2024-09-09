"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { postDataInclude } from "@/lib/types";

export async function deletePost(id: string) {
  // get user data from db
  const { user } = await validateRequest();

  //   if no user, error
  if (!user) throw new Error("Unauthorized");

  //   find by id of post
  const post = await prisma.post.findUnique({
    where: { id },
  });
  // no post, error
  if (!post) throw new Error("Post not found");

  //   if user and author of post are not the same, error
  if (post.userId !== user.id) throw new Error("Unauthorized");

  //   delete function
  const deletedPost = await prisma.post.delete({
    where: { id },
    include: postDataInclude,
  });
  return deletedPost;
}
