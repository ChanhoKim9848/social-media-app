"use client";

import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { submitPost } from "./actions";
import UserAvatar from "@/components/UserAvatar";
import { useSession } from "@/app/(main)/SessionProvider";

export default function PostEditor() {
  // find the logged in user
  const { user } = useSession();

  // user editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
      }),
      Placeholder.configure({
        placeholder: "What are you saying?",
      }),
    ],
  });

  //   post input and text inside
  const input =
    editor?.getText({
      blockSeparator: "\n",
    }) || "";

  // submit post function
  async function onSubmit() {
    await submitPost(input);
    editor?.commands.clearContent();
  }

  // post layout
  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex gap-5">
        <UserAvatar avatarUrl={user.avatarUrl} className="hidden sm:inline" />
      </div>
    </div>
  );
}
