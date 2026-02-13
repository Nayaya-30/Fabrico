"use client";

import { UserRole } from "@/convex/schema";
import { Header } from "./header";
import { Sidebar } from "./sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: {
    fullName: string;
    role: UserRole;
    clerkId: string;
  };
}

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar userRole={user.role} />
      <div className="lg:pl-72">
        <Header userName={user.fullName} userRole={user.role} clerkId={user.clerkId} />
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
