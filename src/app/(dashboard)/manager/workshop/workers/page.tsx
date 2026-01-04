
// app/(dashboard)/manager/workshop/workers/page.tsx
"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award } from "lucide-react";
import { useUser } from "@clerk/nextjs";

export default function WorkersListPage() {
  const { user } = useUser();
  const clerkId = user?.id ?? "";
  const workers = useQuery(api.workers.getWorkers, clerkId ? { clerkId } : "skip");
  const workload = useQuery(api.workers.getWorkerWorkload, clerkId ? { clerkId } : "skip");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold">Workers</h1>
        <p className="text-muted-foreground">View and manage your tailoring team</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workers?.map((worker) => {
          const workerWorkload = workload?.find((w) => w.worker.id === worker._id);
          return (
            <Card key={worker._id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                      {worker.fullName.charAt(0)}
                    </div>
                    <div>
                      <CardTitle className="text-base">{worker.fullName}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        ⭐ {worker.profile?.rating.toFixed(1) || "N/A"}
                      </p>
                    </div>
                  </div>
                  <Badge variant={worker.profile?.isAvailable ? "success" : "destructive"}>
                    {worker.profile?.isAvailable ? "Available" : "Busy"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {worker.profile?.badges && worker.profile.badges.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {worker.profile.badges.map((badge) => (
                      <Badge key={badge} variant="default" className="text-xs">
                        <Award className="h-3 w-3 mr-1" />
                        {badge.replace("_", " ")}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold">{worker.profile?.totalCompletedOrders || 0}</p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {workerWorkload?.currentWorkload || 0}/{workerWorkload?.maxWorkload || 5}
                    </p>
                    <p className="text-xs text-muted-foreground">Workload</p>
                  </div>
                </div>

                {workerWorkload && (
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        workerWorkload.currentWorkload >= workerWorkload.maxWorkload
                          ? "bg-destructive"
                          : "bg-success"
                      }`}
                      style={{
                        width: `${(workerWorkload.currentWorkload / workerWorkload.maxWorkload) * 100}%`,
                      }}
                    />
                  </div>
                )}

                <Button variant="outline" className="w-full" size="sm">
                  View Details
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
