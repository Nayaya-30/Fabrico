// components/orders/order-progress-tracker.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Circle } from "lucide-react";
import { OrderStatus } from "@/convex/schema";

interface OrderProgressTrackerProps {
  currentStatus: OrderStatus;
  progress: Array<{
    stage: OrderStatus;
    timestamp: number;
    notes?: string;
    images?: string[];
  }>;
}

const stages: Array<{ status: OrderStatus; label: string }> = [
  { status: "confirmed", label: "Order Confirmed" },
  { status: "fabric_received", label: "Fabric Received" },
  { status: "cutting", label: "Cutting" },
  { status: "sewing", label: "Sewing" },
  { status: "fitting", label: "Fitting" },
  { status: "finishing", label: "Finishing" },
  { status: "ready", label: "Ready for Pickup" },
  { status: "delivered", label: "Delivered" },
];

export function OrderProgressTracker({ currentStatus, progress }: OrderProgressTrackerProps) {
  const currentIndex = stages.findIndex((s) => s.status === currentStatus);
  const completedStages = new Set(progress.map((p) => p.stage));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {stages.map((stage, index) => {
            const isCompleted = completedStages.has(stage.status);
            const isCurrent = stage.status === currentStatus;
            const progressEntry = progress.find((p) => p.stage === stage.status);

            return (
              <div key={stage.status} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                      isCompleted || isCurrent
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted bg-background"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Circle className="h-5 w-5" />
                    )}
                  </div>
                  {index < stages.length - 1 && (
                    <div
                      className={`h-12 w-0.5 ${
                        isCompleted ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </div>

                <div className="flex-1 pb-6">
                  <div className="flex items-center gap-2 mb-1">
                    <p
                      className={`font-medium ${
                        isCompleted || isCurrent
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {stage.label}
                    </p>
                    {isCurrent && <Badge>Current</Badge>}
                  </div>

                  {progressEntry && (
                    <>
                      <p className="text-sm text-muted-foreground">
                        {new Date(progressEntry.timestamp).toLocaleString()}
                      </p>
                      
                      {progressEntry.notes && (
                        <p className="text-sm mt-2">{progressEntry.notes}</p>
                      )}

                      {progressEntry.images && progressEntry.images.length > 0 && (
                        <div className="flex gap-2 mt-2">
                          {progressEntry.images.map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt="Progress"
                              className="h-20 w-20 rounded-lg object-cover border"
                            />
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
