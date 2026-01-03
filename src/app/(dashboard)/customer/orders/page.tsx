
// app/(dashboard)/customer/orders/page.tsx
"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OrderCard } from "@/components/orders/order-card";
import { Search, Plus, Package } from "lucide-react";
import Link from "next/link";

interface CustomerOrdersPageProps {
  clerkId: string;
}

export default function CustomerOrdersPage({ clerkId }: CustomerOrdersPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const orders = useQuery(api.orders.getCustomerOrders, { clerkId });

  const filteredOrders = orders?.filter((order) =>
    order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeOrders = filteredOrders?.filter(
    (o) => o.status !== "delivered" && o.status !== "cancelled"
  );

  const completedOrders = filteredOrders?.filter((o) => o.status === "delivered");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">My Orders</h1>
          <p className="text-muted-foreground">
            Track and manage all your tailoring orders
          </p>
        </div>
        <Link href="/customer/orders/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Order
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {activeOrders && activeOrders.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Active Orders</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeOrders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                onViewClick={() => {
                  window.location.href = `/customer/orders/${order._id}`;
                }}
              />
            ))}
          </div>
        </div>
      )}

      {completedOrders && completedOrders.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Completed Orders</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedOrders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                onViewClick={() => {
                  window.location.href = `/customer/orders/${order._id}`;
                }}
              />
            ))}
          </div>
        </div>
      )}

      {filteredOrders?.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No orders found</p>
            <Link href="/customer/orders/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Place Your First Order
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
