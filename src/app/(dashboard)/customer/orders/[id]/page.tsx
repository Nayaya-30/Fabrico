// app/(dashboard)/customer/orders/[id]/page.tsx
"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OrderProgressTracker } from "@/components/orders/order-progress-tracker";
import {
  Download,
  MessageSquare,
  CreditCard,
  Star,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface OrderDetailPageProps {
  params: { id: string };
  clerkId: string;
}

export default function OrderDetailPage({ params, clerkId }: OrderDetailPageProps) {
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(5);

  const order = useQuery(api.orders.getOrderById, {
    clerkId,
    orderId: params.id as Id<"orders">,
  });

  if (order === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Order not found</p>
      </div>
    );
  }

  const canRate = order.status === "delivered" && order.assignedWorkerId;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/orders">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-heading font-bold">{order.orderNumber}</h1>
            <p className="text-muted-foreground">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <Badge variant={order.status === "delivered" ? "success" : "default"}>
          {order.status.replace("_", " ")}
        </Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Tracker */}
          <OrderProgressTracker
            currentStatus={order.status}
            progress={order.progress || []}
          />

          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.styleId && (
                <div>
                  <p className="text-sm font-medium mb-1">Selected Style</p>
                  <p className="text-sm text-muted-foreground">Style #{order.styleId}</p>
                </div>
              )}

              {order.customerNotes && (
                <div>
                  <p className="text-sm font-medium mb-1">Your Notes</p>
                  <p className="text-sm text-muted-foreground">{order.customerNotes}</p>
                </div>
              )}

              <div>
                <p className="text-sm font-medium mb-1">Urgency</p>
                <Badge variant={order.urgency === "express" ? "destructive" : "default"}>
                  {order.urgency}
                </Badge>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Estimated Completion</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.estimatedCompletionDate).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Payment Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm">Base Price</span>
                <span className="font-medium">₦{order.basePrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Fabric Cost</span>
                <span className="font-medium">₦{order.fabricCost.toLocaleString()}</span>
              </div>
              {order.additionalCharges > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm">Additional Charges</span>
                  <span className="font-medium">
                    ₦{order.additionalCharges.toLocaleString()}
                  </span>
                </div>
              )}
              {order.discount > 0 && (
                <div className="flex justify-between text-success">
                  <span className="text-sm">Discount</span>
                  <span className="font-medium">-₦{order.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold">₦{order.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-success">
                  <span className="text-sm">Paid</span>
                  <span className="font-medium">₦{order.amountPaid.toLocaleString()}</span>
                </div>
                {order.balance > 0 && (
                  <div className="flex justify-between text-warning">
                    <span className="text-sm">Balance</span>
                    <span className="font-medium">₦{order.balance.toLocaleString()}</span>
                  </div>
                )}
              </div>

              {order.balance > 0 && (
                <Button className="w-full">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pay Balance
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full">
                <MessageSquare className="mr-2 h-4 w-4" />
                Contact Support
              </Button>

              {order.status === "delivered" && (
                <Button variant="outline" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download Invoice
                </Button>
              )}

              {canRate && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowRatingModal(true)}
                >
                  <Star className="mr-2 h-4 w-4" />
                  Rate Work
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
