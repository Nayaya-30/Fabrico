"use client";

import { Bell } from "lucide-react";
import { useQuery } from "convex/react";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { api } from "@/convex/_generated/api";

interface HeaderProps {
  userName: string;
  userRole: string;
  clerkId: string;
}

export function Header({ userName, userRole, clerkId }: HeaderProps) {
  const unreadCount = useQuery(api.notifications.getUnreadNotificationCount, { clerkId });

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/70 bg-background/85 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div>
        <h2 className="text-base font-semibold sm:text-lg">Welcome back, {userName}</h2>
        <p className="text-xs capitalize text-muted-foreground sm:text-sm">{userRole}</p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Notifications"
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-input bg-background hover:bg-accent"
        >
          <Bell className="h-4 w-4" />
          {unreadCount && unreadCount > 0 ? (
            <Badge variant="destructive" className="absolute -right-1 -top-1 h-5 min-w-[20px] rounded-full px-1">
              {unreadCount}
            </Badge>
          ) : null}
        </button>

        <ThemeToggle />

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-sm font-semibold text-primary-foreground">
          {userName.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
