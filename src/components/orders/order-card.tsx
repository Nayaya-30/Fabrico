// components/orders/order-card.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Clock, DollarSign } from "lucide-react";
import { OrderStatus } from "@/convex/schema";

interface OrderCardProps {
  order: {
    _id: string;
    orderNumber: string;
    status: OrderStatus;
    totalAmount: number;
    amountPaid: number;
    balance: number;
    estimatedCompletionDate: number;
    createdAt: number;
  };
  onViewClick: () => void;
}

const statusColors: Record<OrderStatus, "default" | "success" | "warning" | "destructive"> = {
  pending: "warning",
  confirmed: "info",
  fabric_received: "info",
  cutting: "info",
  sewing: "info",
  fitting: "info",
  finishing: "info",
  ready: "success",
  delivered: "success",
  cancelled: "destructive",
};

export function OrderCard({ order, onViewClick }: OrderCardProps) {
  const paymentStatus = order.balance === 0 ? "Paid" : "Pending";
  const daysRemaining = Math.ceil(
    (order.estimatedCompletionDate - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-base font-semibold">
            {order.orderNumber}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Placed {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <Badge variant={statusColors[order.status]}>
          {order.status.replace("_", " ")}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            Payment
          </span>
          <span className="font-medium">
            ₦{order.amountPaid.toLocaleString()} / ₦{order.totalAmount.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            Delivery
          </span>
          <span className={daysRemaining < 0 ? "text-destructive font-medium" : ""}>
            {daysRemaining < 0
              ? `${Math.abs(daysRemaining)} days overdue`
              : `${daysRemaining} days remaining`}
          </span>
        </div>

        <Button className="w-full" variant="outline" onClick={onViewClick}>
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}