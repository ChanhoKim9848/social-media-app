import { validateRequest } from "@/auth";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { Bell, Bookmark, Home, Mail } from "lucide-react";
import Link from "next/link";
import NotificationsButton from "./NotificationsButton";
import MessagesButton from "./MessagesButton";
import streamServerClient from "@/lib/stream";

interface MenubarProps {
  className?: string;
}

// Menu bar functions and layouts
export default async function Menubar({ className }: MenubarProps) {
  // logged in user
  const { user } = await validateRequest();

  // if user is not logged in, return null
  if (!user) return null;
  // unread notification count from database
  const [unreadNotificationsCount, unreadMessagesCount] = await Promise.all([
    prisma.notification.count({
      where: {
        recipientId: user.id,
        read: false,
      },
    }),
    (await streamServerClient.getUnreadCount(user.id)).total_unread_count,
  ]);

  return (
    <div className={className}>
      {/* Home button */}
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Home"
        asChild
      >
        <Link href="/">
          <Home />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>
      {/* fetch notifications button that has unread notifications count */}
      <NotificationsButton
        initialState={{ unreadCount: unreadNotificationsCount }}
      />
      {/* Messages button */}
      <MessagesButton initialState={{ unreadCount: unreadMessagesCount }} />

      {/* Bookmarks button */}
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Bookmarks"
        asChild
      >
        <Link href="/bookmarks">
          <Bookmark />
          <span className="hidden lg:inline">Bookmarks</span>
        </Link>
      </Button>
    </div>
  );
}
