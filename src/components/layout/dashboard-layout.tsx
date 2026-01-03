// components/layout/dashboard-layout.tsx
"use client";

import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { UserRole } from "@/convex/schema";

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
      
      <div className="pl-64">
        <Header
          userName={user.fullName}
          userRole={user.role}
          clerkId={user.clerkId}
        />
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}