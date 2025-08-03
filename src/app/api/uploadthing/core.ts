import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import streamServerClient from "@/lib/stream";
import { createUploadthing, FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";

const f = createUploadthing();

export const fileRouter = {
  avatar: f({
    image: { maxFileSize: "512KB" },
  })
    .middleware(async () => {
      const { user } = await validateRequest();
      if (!user) throw new UploadThingError("Unauthorized");
      return { user };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        const oldAvatarUrl = metadata.user.avatarUrl;

        if (oldAvatarUrl) {
          // To delete old file, get key from UploadThing URL starting at '/f/'
          const key = oldAvatarUrl.split("/f/")[1];
          if (key) {
            await new UTApi().deleteFiles(key);
          }
        }

        const newAvatarUrl = file.url; // Use UploadThing's exact URL, no replace!

        await prisma.user.update({
          where: { id: metadata.user.id },
          data: { avatarUrl: newAvatarUrl },
        });

        await streamServerClient.partialUpdateUser({
          id: metadata.user.id,
          set: { image: newAvatarUrl },
        });

        return { avatarUrl: newAvatarUrl };
      } catch (error) {
        console.error("Avatar upload error:", error);
        throw new UploadThingError("Failed to process avatar upload");
      }
    }),

  attachment: f({
    image: { maxFileSize: "4MB", maxFileCount: 5 },
    video: { maxFileSize: "64MB", maxFileCount: 5 },
  })
    .middleware(async () => {
      const { user } = await validateRequest();
      if (!user) throw new UploadThingError("Unauthorized");
      return { user };
    })
    .onUploadComplete(async ({ file }) => {
      try {
        // Save exact UploadThing file url (no replace)
        const newUrl = file.url;

        const media = await prisma.media.create({
          data: {
            url: newUrl,
            type: file.type.startsWith("image") ? "IMAGE" : "VIDEO",
          },
        });

        return { mediaId: media.id };
      } catch (error) {
        console.error("Media upload error:", error);
        throw new UploadThingError("Failed to store media");
      }
    }),
} satisfies FileRouter;

export type AppFileRouter = typeof fileRouter;
