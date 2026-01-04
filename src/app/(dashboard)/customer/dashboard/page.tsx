// app/(dashboard)/customer/dashboard/page.tsx
"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  Heart,
  Plus,
  TrendingUp,
  Package,
} from "lucide-react";
import Link from "next/link";
import { OrderCard } from "@/components/orders/order-card";
import { StyleCard } from "@/components/styles/style-card";
import { useUser } from "@clerk/nextjs";

export default function CustomerDashboard() {
  const { user } = useUser();
  const clerkId = user?.id ?? "";
  const orders = useQuery(api.orders.getCustomerOrders, clerkId ? { clerkId } : "skip");
  const savedStyles = useQuery(api.styles.getUserSavedStyles, clerkId ? { clerkId } : "skip");
  const notifications = useQuery(api.notifications.getNotifications, clerkId ? {
    clerkId,
    limit: 5,
  } : "skip");

  const activeOrders = orders?.filter(
    (o) => o.status !== "delivered" && o.status !== "cancelled"
  ) || [];

  const completedOrders = orders?.filter((o) => o.status === "delivered") || [];

  const pendingPayments = orders?.reduce((sum, o) => sum + o.balance, 0) || 0;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-primary/70 rounded-lg p-8 text-primary-foreground">
        <h1 className="text-3xl font-heading font-bold mb-2">
          Welcome back, {user?.fullName || ""}! 👋
        </h1>
        <p className="text-lg opacity-90 mb-4">
          You have {activeOrders.length} active order{activeOrders.length !== 1 ? "s" : ""} in progress
        </p>
        <Link href="/styles">
          <Button variant="secondary" size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Browse Styles
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeOrders.length}</div>
            <p className="text-xs text-muted-foreground">Currently in production</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedOrders.length}</div>
            <p className="text-xs text-muted-foreground">Successfully delivered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payment</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{pendingPayments.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Outstanding balance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved Styles</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{savedStyles?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Your favorites</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Active Orders</CardTitle>
          <Link href="/orders">
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {activeOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No active orders</p>
              <Link href="/styles">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Place New Order
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeOrders.slice(0, 3).map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  onViewClick={() => {
                    window.location.href = `/orders/${order._id}`;
                  }}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {notifications && notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className="flex items-start gap-4 p-4 rounded-lg bg-muted/50"
                >
                  <div className="flex-1">
                    <p className="font-medium">{notification.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <Badge variant="default">New</Badge>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No recent activity
            </p>
          )}
        </CardContent>
      </Card>

      {/* Saved Styles */}
      {savedStyles && savedStyles.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Saved Styles</CardTitle>
            <Link href="/styles/saved">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {savedStyles.slice(0, 4).map((style) => (
                <StyleCard
                  key={style._id}
                  style={style}
                  clerkId={clerkId}
                  onOrderClick={() => {
                    window.location.href = `/orders/new?styleId=${style._id}`;
                  }}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
