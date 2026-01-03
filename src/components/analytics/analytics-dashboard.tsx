// components/analytics/analytics-dashboard.tsx
"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Users,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { Loader2 } from "lucide-react";

interface AnalyticsDashboardProps {
  clerkId: string;
}

export function AnalyticsDashboard({ clerkId }: AnalyticsDashboardProps) {
  const analytics = useQuery(api.analytics.getAdminAnalytics, { clerkId });

  if (analytics === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const metrics = [
    {
      title: "Total Revenue",
      value: `₦${analytics.summary.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      trend: "+12%",
      color: "text-success",
    },
    {
      title: "Total Orders",
      value: analytics.summary.totalOrders,
      icon: ShoppingBag,
      trend: "+8%",
      color: "text-info",
    },
    {
      title: "Active Orders",
      value: analytics.summary.activeOrders,
      icon: Clock,
      trend: "-5%",
      color: "text-warning",
    },
    {
      title: "Completed",
      value: analytics.summary.completedOrders,
      icon: CheckCircle,
      trend: "+15%",
      color: "text-success",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className={`text-xs ${metric.color} mt-1`}>{metric.trend} from last period</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.workerPerformance.slice(0, 5).map((worker, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                      {worker.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{worker.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {worker.ordersCompleted} orders
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₦{worker.revenue.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">
                      ⭐ {worker.rating.toFixed(1)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Completion Rate</span>
                <span className="text-sm font-bold">
                  {analytics.summary.completionRate.toFixed(1)}%
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-success"
                  style={{ width: `${analytics.summary.completionRate}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Average Order Value</span>
                <span className="text-sm font-bold">
                  ₦{analytics.summary.avgOrderValue.toLocaleString()}
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Pending Revenue</span>
                <span className="text-sm font-bold text-warning">
                  ₦{analytics.summary.pendingRevenue.toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}