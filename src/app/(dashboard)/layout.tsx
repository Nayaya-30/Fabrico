"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { api } from "@/convex/_generated/api";

export default function DashboardLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const convexUser = useQuery(api.auth.getCurrentUser, user ? { clerkId: user.id } : "skip");

  if (!isLoaded) {
    return <div className="p-6 text-sm text-muted-foreground">Loading workspace...</div>;
  }

  if (!user) {
    router.replace("/sign-in");
    return null;
  }

  if (!convexUser) {
    return <div className="p-6 text-sm text-muted-foreground">Setting up your account...</div>;
  }

  return (
    <DashboardLayout
      user={{
        fullName: convexUser.fullName,
        role: convexUser.role,
        clerkId: user.id,
      }}
    >
      {children}
    </DashboardLayout>
  );
}
