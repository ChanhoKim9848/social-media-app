import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { createUploadthing, FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";

const f = createUploadthing();

// file router
export const fileRouter = {
  avatar: f({
    // max image size
    image: { maxFileSize: "512KB" },
  })
    .middleware(async () => {
      const { user } = await validateRequest();

      //   if user is not logged in, throw error
      if (!user) throw new UploadThingError("Unauthorized");

      return { user };
    })

    // upload image file on Uploadthing
    .onUploadComplete(async ({ metadata, file }) => {
      const oldAvatarUrl = metadata.user.avatarUrl;

      // old avatar handle
      if (oldAvatarUrl) {
        const key = oldAvatarUrl.split(
          `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
        )[1];

        // delete old avatar after updating
        await new UTApi().deleteFiles(key);
      }

      const newAvatarUrl = file.url.replace(
        "/f/",
        `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
      );

      //   update user avatar image on the database
      await prisma.user.update({
        where: { id: metadata.user.id },
        data: {
          avatarUrl: newAvatarUrl,
        },
      });
      return { avatarUrl: newAvatarUrl };
    }),
  // media type is image or video
  // maximum file size and count
  attachment: f({
    image: { maxFileSize: "4MB", maxFileCount: 5 },
    video: { maxFileSize: "64MB", maxFileCount: 5 },
  })
    .middleware(async () => {
      const { user } = await validateRequest();

      if (!user) throw new UploadThingError("Unauthorized");

      return {};
    })
    .onUploadComplete(async ({ file }) => {
      // store media on uploadthing
      const media = await prisma.media.create({
        data: {
          url: file.url.replace(
            "/f/",
            `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
          ),
          type: file.type.startsWith("image") ? "IMAGE" : "VIDEO",
        },
      });
      return { mediaId: media.id };
    }),
} satisfies FileRouter;

export type AppFileRouter = typeof fileRouter;
