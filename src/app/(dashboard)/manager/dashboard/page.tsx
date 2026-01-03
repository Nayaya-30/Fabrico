// app/(dashboard)/manager/dashboard/page.tsx
"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Package,
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

interface ManagerDashboardProps {
  clerkId: string;
  userName: string;
}

export default function ManagerDashboard({ clerkId, userName }: ManagerDashboardProps) {
  const orders = useQuery(api.orders.getAllOrders, { clerkId });
  const workload = useQuery(api.workers.getWorkerWorkload, { clerkId });
  const huddles = useQuery(api.huddles.getHuddles, { clerkId, limit: 5 });

  const activeOrders = orders?.filter(
    (o) => o.status !== "delivered" && o.status !== "cancelled"
  ) || [];

  const delayedOrders = activeOrders.filter(
    (o) => o.estimatedCompletionDate < Date.now()
  );

  const unassignedOrders = activeOrders.filter((o) => !o.assignedWorkerId);

  const availableWorkers = workload?.filter((w) => w.isAvailable) || [];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-primary/70 rounded-lg p-8 text-primary-foreground">
        <h1 className="text-3xl font-heading font-bold mb-2">
          Manager Dashboard - {userName}
        </h1>
        <p className="text-lg opacity-90">
          Managing {activeOrders.length} active orders across {workload?.length || 0} workers
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeOrders.length}</div>
            <p className="text-xs text-muted-foreground">In production</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unassigned</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{unassignedOrders.length}</div>
            <p className="text-xs text-muted-foreground">Need assignment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delayed</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{delayedOrders.length}</div>
            <p className="text-xs text-muted-foreground">Past due date</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Workers</CardTitle>
            <Users className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{availableWorkers.length}</div>
            <p className="text-xs text-muted-foreground">Ready for assignment</p>
          </CardContent>
        </Card>
      </div>

      {/* Worker Workload */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Worker Workload</CardTitle>
          <Link href="/workshop/workers">
            <Button variant="ghost" size="sm">
              Manage Workers
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workload?.slice(0, 5).map((worker) => (
              <div key={worker.worker.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                    {worker.worker.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{worker.worker.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{worker.activeOrders} active orders</span>
                      <span>•</span>
                      <span>⭐ {worker.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span>{worker.currentWorkload}</span>
                      <span className="text-muted-foreground">/ {worker.maxWorkload}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          worker.currentWorkload >= worker.maxWorkload
                            ? "bg-destructive"
                            : worker.currentWorkload >= worker.maxWorkload * 0.7
                            ? "bg-warning"
                            : "bg-success"
                        }`}
                        style={{
                          width: `${(worker.currentWorkload / worker.maxWorkload) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <Badge variant={worker.isAvailable ? "success" : "destructive"}>
                    {worker.isAvailable ? "Available" : "Full"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Unassigned Orders Alert */}
      {unassignedOrders.length > 0 && (
        <Card className="border-warning">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-warning" />
              Unassigned Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {unassignedOrders.map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between p-4 rounded-lg bg-warning/10 border border-warning/20"
                >
                  <div>
                    <p className="font-semibold">{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      Created: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Link href={`/orders/${order._id}/assign`}>
                    <Button size="sm">Assign Worker</Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delayed Orders Alert */}
      {delayedOrders.length > 0 && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delayed Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {delayedOrders.map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between p-4 rounded-lg bg-destructive/10 border border-destructive/20"
                >
                  <div>
                    <p className="font-semibold">{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      Was due: {new Date(order.estimatedCompletionDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Link href={`/orders/${order._id}`}>
                    <Button size="sm" variant="destructive">
                      Review
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}