"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import streamServerClient from "@/lib/stream";
import { getUserDataSelect } from "@/lib/types";
import {
  updateUserProfileSchema,
  UpdateUserProfileValues,
} from "@/lib/validation";

// update user profile function
export async function updateUserProfile(values: UpdateUserProfileValues) {
  // update profile schema
  const validateValues = updateUserProfileSchema.parse(values);

  // logged in user
  const { user } = await validateRequest();
  // if user is not logged in but try to edit profile, error
  if (!user) throw new Error("Unauthorized");

  // transaction for updated user and partial update user
  const updatedUser = await prisma.$transaction(async (tx) => {
    // update user data of the profile in db
    const updatedUser = await tx.user.update({
      where: { id: user.id },
      data: validateValues,
      select: getUserDataSelect(user.id),
    });
    await streamServerClient.partialUpdateUser({
      id: user.id,
      set: {
        name: validateValues.displayName,
      },
    });
    return updatedUser;
  });

  return updatedUser;
}
