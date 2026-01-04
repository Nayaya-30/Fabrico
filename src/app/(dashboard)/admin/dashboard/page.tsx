// app/(dashboard)/admin/dashboard/page.tsx
"use client";

import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  Package,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const { user } = useUser();
  const clerkId = user?.id ?? "";
  const analytics = useQuery(api.analytics.getAdminAnalytics, clerkId ? { clerkId } : "skip");

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Complete overview of your business operations
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/styles/new">
            <Button>Add Style</Button>
          </Link>
          <Link href="/admin/users">
            <Button variant="outline">Manage Users</Button>
          </Link>
        </div>
      </div>

      {/* Analytics Dashboard */}
      {clerkId && <AnalyticsDashboard clerkId={clerkId} />}

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="hover:shadow-lg transition cursor-pointer">
          <Link href="/admin/orders">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Manage</p>
                  <p className="text-xl font-semibold">Orders</p>
                </div>
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition cursor-pointer">
          <Link href="/admin/users">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Manage</p>
                  <p className="text-xl font-semibold">Users</p>
                </div>
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition cursor-pointer">
          <Link href="/admin/styles">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-warning/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Manage</p>
                  <p className="text-xl font-semibold">Styles</p>
                </div>
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition cursor-pointer">
          <Link href="/admin/workers">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-info/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-info" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Manage</p>
                  <p className="text-xl font-semibold">Workers</p>
                </div>
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition cursor-pointer">
          <Link href="/admin/payments">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">View</p>
                  <p className="text-xl font-semibold">Payments</p>
                </div>
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition cursor-pointer">
          <Link href="/admin/settings">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">System</p>
                  <p className="text-xl font-semibold">Settings</p>
                </div>
              </div>
            </CardContent>
          </Link>
        </Card>
      </div>
    </div>
  );
}
