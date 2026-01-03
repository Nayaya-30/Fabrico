// app/(dashboard)/worker/dashboard/page.tsx
"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Scissors,
  Trophy,
} from "lucide-react";
import Link from "next/link";

interface WorkerDashboardProps {
  clerkId: string;
  userName: string;
}

export default function WorkerDashboard({ clerkId, userName }: WorkerDashboardProps) {
  const user = useQuery(api.auth.getCurrentUser, { clerkId });
  const assignedOrders = useQuery(api.orders.getWorkerAssignedOrders, { clerkId });
  const workerProfile = useQuery(api.workers.getWorkerProfile, { clerkId });
  const huddles = useQuery(api.huddles.getHuddles, { clerkId, limit: 5 });

  const activeOrders = assignedOrders?.filter(
    (o) => o.status !== "delivered" && o.status !== "cancelled"
  ) || [];

  const urgentOrders = activeOrders.filter((o) => o.urgency === "express" || o.urgency === "rush");
  const completedToday = assignedOrders?.filter(
    (o) => o.status === "delivered" && 
    new Date(o.deliveredAt!).toDateString() === new Date().toDateString()
  ).length || 0;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-primary/70 rounded-lg p-8 text-primary-foreground">
        <h1 className="text-3xl font-heading font-bold mb-2">
          Good day, {userName}! 👋
        </h1>
        <p className="text-lg opacity-90 mb-4">
          You have {activeOrders.length} active assignment{activeOrders.length !== 1 ? "s" : ""}
        </p>
        <div className="flex gap-4">
          <div className="bg-white/20 rounded-lg px-4 py-2">
            <p className="text-sm opacity-80">Rating</p>
            <p className="text-2xl font-bold">⭐ {workerProfile?.rating.toFixed(1) || "N/A"}</p>
          </div>
          <div className="bg-white/20 rounded-lg px-4 py-2">
            <p className="text-sm opacity-80">Completed Orders</p>
            <p className="text-2xl font-bold">{workerProfile?.totalCompletedOrders || 0}</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <Scissors className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeOrders.length}</div>
            <p className="text-xs text-muted-foreground">
              {workerProfile?.currentWorkload || 0} / {workerProfile?.maxWorkload || 5} workload
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent</CardTitle>
            <AlertCircle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{urgentOrders.length}</div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{completedToday}</div>
            <p className="text-xs text-muted-foreground">Great progress!</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Badges</CardTitle>
            <Trophy className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workerProfile?.badges.length || 0}</div>
            <p className="text-xs text-muted-foreground">Achievement badges</p>
          </CardContent>
        </Card>
      </div>

      {/* Badges Section */}
      {workerProfile && workerProfile.badges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              {workerProfile.badges.map((badge) => (
                <Badge key={badge} variant="default" className="text-sm px-4 py-2">
                  <Trophy className="h-4 w-4 mr-2" />
                  {badge.replace("_", " ").toUpperCase()}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Urgent Tasks */}
      {urgentOrders.length > 0 && (
        <Card className="border-warning">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              Urgent Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {urgentOrders.map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between p-4 rounded-lg bg-warning/10 border border-warning/20"
                >
                  <div>
                    <p className="font-semibold">{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      Due: {new Date(order.estimatedCompletionDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">{order.urgency}</Badge>
                    <Link href={`/tasks/${order._id}`}>
                      <Button size="sm">Update</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Assignments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>My Tasks</CardTitle>
          <Link href="/tasks">
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {activeOrders.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No active assignments</p>
              <p className="text-sm text-muted-foreground mt-2">
                Great job! You're all caught up.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeOrders.slice(0, 5).map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition"
                >
                  <div className="flex-1">
                    <p className="font-semibold">{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      Status: {order.status.replace("_", " ")}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Due Date</p>
                      <p className="text-sm font-medium">
                        {new Date(order.estimatedCompletionDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Link href={`/tasks/${order._id}`}>
                      <Button size="sm">View</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Workshop Huddles */}
      {huddles && huddles.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Workshop Updates</CardTitle>
            <Link href="/workshop">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {huddles.map((huddle) => (
                <div
                  key={huddle._id}
                  className={`p-4 rounded-lg border ${
                    huddle.isPinned ? "bg-primary/5 border-primary" : ""
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold">{huddle.title}</h4>
                    <Badge variant={huddle.type === "urgent" ? "destructive" : "default"}>
                      {huddle.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{huddle.content}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Posted {new Date(huddle.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
