
// app/(dashboard)/manager/orders/all/page.tsx
"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ChevronRight } from "lucide-react";
import { OrderStatus } from "@/convex/schema";

interface AllOrdersPageProps {
  clerkId: string;
}

export default function AllOrdersPage({ clerkId }: AllOrdersPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  
  const orders = useQuery(api.orders.getAllOrders, { clerkId });

  const filteredOrders = orders?.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold">All Orders</h1>
        <p className="text-muted-foreground">Manage and monitor all customer orders</p>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by order number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "all")}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="fabric_received">Fabric Received</option>
          <option value="cutting">Cutting</option>
          <option value="sewing">Sewing</option>
          <option value="fitting">Fitting</option>
          <option value="finishing">Finishing</option>
          <option value="ready">Ready</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {filteredOrders?.map((order) => (
              <div
                key={order._id}
                className="p-4 hover:bg-accent/50 transition cursor-pointer"
                onClick={() => (window.location.href = `/orders/${order._id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-semibold">{order.orderNumber}</p>
                      <Badge
                        variant={
                          order.status === "delivered"
                            ? "success"
                            : order.status === "cancelled"
                            ? "destructive"
                            : "default"
                        }
                      >
                        {order.status.replace("_", " ")}
                      </Badge>
                      {!order.assignedWorkerId && (
                        <Badge variant="warning">Unassigned</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Created: {new Date(order.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>Due: {new Date(order.estimatedCompletionDate).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>₦{order.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>

          {filteredOrders?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No orders found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
