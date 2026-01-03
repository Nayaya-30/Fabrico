// app/(dashboard)/worker/tasks/[id]/page.tsx
"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OrderProgressTracker } from "@/components/orders/order-progress-tracker";
import { ArrowLeft, Upload } from "lucide-react";
import Link from "next/link";

interface TaskDetailPageProps {
  params: { id: string };
  clerkId: string;
}

export default function TaskDetailPage({ params, clerkId }: TaskDetailPageProps) {
  const [notes, setNotes] = useState("");
  const [selectedStage, setSelectedStage] = useState<string>("");

  const order = useQuery(api.orders.getOrderById, {
    clerkId,
    orderId: params.id as Id<"orders">,
  });

  const updateProgress = useMutation(api.orders.updateOrderProgress);

  const handleUpdateProgress = async () => {
    if (!selectedStage) return;

    try {
      await updateProgress({
        clerkId,
        orderId: params.id as Id<"orders">,
        stage: selectedStage as any,
        notes,
      });

      setNotes("");
      setSelectedStage("");
      alert("Progress updated successfully!");
    } catch (error) {
      console.error("Failed to update progress:", error);
      alert("Failed to update progress");
    }
  };

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/worker/tasks">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-heading font-bold">{order.orderNumber}</h1>
          <p className="text-muted-foreground">Update task progress</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <OrderProgressTracker
            currentStatus={order.status}
            progress={order.progress || []}
          />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Update Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">New Stage</label>
                <select
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select stage...</option>
                  <option value="fabric_received">Fabric Received</option>
                  <option value="cutting">Cutting</option>
                  <option value="sewing">Sewing</option>
                  <option value="fitting">Fitting</option>
                  <option value="finishing">Finishing</option>
                  <option value="ready">Ready</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[100px]"
                  placeholder="Add any notes about this stage..."
                />
              </div>

              <Button
                className="w-full"
                onClick={handleUpdateProgress}
                disabled={!selectedStage}
              >
                Update Progress
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">Status</p>
                <Badge>{order.status.replace("_", " ")}</Badge>
              </div>
              <div>
                <p className="text-muted-foreground">Urgency</p>
                <Badge variant={order.urgency === "express" ? "destructive" : "default"}>
                  {order.urgency}
                </Badge>
              </div>
              <div>
                <p className="text-muted-foreground">Due Date</p>
                <p className="font-medium">
                  {new Date(order.estimatedCompletionDate).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
