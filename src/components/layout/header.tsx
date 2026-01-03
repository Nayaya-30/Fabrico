// components/layout/header.tsx
"use client";

import { Bell } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface HeaderProps {
  userName: string;
  userRole: string;
  clerkId: string;
}

export function Header({ userName, userRole, clerkId }: HeaderProps) {
  const unreadCount = useQuery(api.notifications.getUnreadNotificationCount, {
    clerkId,
  });

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
      <div>
        <h2 className="text-lg font-semibold">Welcome back, {userName}</h2>
        <p className="text-sm text-muted-foreground capitalize">{userRole}</p>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground">
          <Bell className="h-5 w-5" />
          {unreadCount && unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 h-5 min-w-[20px] rounded-full px-1"
            >
              {unreadCount}
            </Badge>
          )}
        </button>

        <ThemeToggle />

        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-semibold">
          {userName.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}