
// app/(dashboard)/worker/tasks/page.tsx
"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertCircle, ChevronRight, Package } from "lucide-react";
import { useUser } from "@clerk/nextjs";

export default function TasksPage() {
  const { user } = useUser();
  const clerkId = user?.id ?? "";
  const orders = useQuery(api.orders.getWorkerAssignedOrders, clerkId ? { clerkId } : "skip");

  const activeOrders = orders?.filter(
    (o) => o.status !== "delivered" && o.status !== "cancelled"
  );

  const urgentOrders = activeOrders?.filter(
    (o) => o.urgency === "express" || o.urgency === "rush"
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold">My Tasks</h1>
        <p className="text-muted-foreground">
          {activeOrders?.length || 0} active assignment{activeOrders?.length !== 1 ? "s" : ""}
        </p>
      </div>

      {urgentOrders && urgentOrders.length > 0 && (
        <Card className="border-warning">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="h-5 w-5 text-warning" />
              <h2 className="font-semibold text-lg">Urgent Tasks</h2>
            </div>
            <div className="space-y-3">
              {urgentOrders.map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between p-4 rounded-lg bg-warning/10 border border-warning/20 cursor-pointer hover:bg-warning/20 transition"
                  onClick={() => (window.location.href = `/worker/tasks/${order._id}`)}
                >
                  <div>
                    <p className="font-semibold">{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      Due: {new Date(order.estimatedCompletionDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">{order.urgency}</Badge>
                    <ChevronRight className="h-5 w-5" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {activeOrders?.map((order) => (
              <div
                key={order._id}
                className="p-4 hover:bg-accent/50 transition cursor-pointer"
                onClick={() => (window.location.href = `/worker/tasks/${order._id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-semibold">{order.orderNumber}</p>
                      <Badge>{order.status.replace("_", " ")}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Due: {new Date(order.estimatedCompletionDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>

          {activeOrders?.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No active tasks</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
