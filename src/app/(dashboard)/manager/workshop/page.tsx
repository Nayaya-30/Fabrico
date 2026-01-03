
// app/(dashboard)/manager/workshop/page.tsx
"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import Link from "next/link";

interface WorkshopPageProps {
  clerkId: string;
}

export default function WorkshopPage({ clerkId }: WorkshopPageProps) {
  const workload = useQuery(api.workers.getWorkerWorkload, { clerkId });
  const huddles = useQuery(api.huddles.getHuddles, { clerkId });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">Workshop Management</h1>
          <p className="text-muted-foreground">Monitor team and manage workshop operations</p>
        </div>
        <Link href="/manager/workshop/workers">
          <Button>
            <Users className="mr-2 h-4 w-4" />
            View All Workers
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Workload</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workload?.slice(0, 5).map((worker) => (
              <div key={worker.worker.id} className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3 flex-1">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                    {worker.worker.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{worker.worker.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {worker.activeOrders} active orders • ⭐ {worker.rating.toFixed(1)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-32">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span>{worker.currentWorkload}</span>
                      <span className="text-muted-foreground">/ {worker.maxWorkload}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          worker.currentWorkload >= worker.maxWorkload
                            ? "bg-destructive"
                            : worker.currentWorkload >= worker.maxWorkload * 0.7
                            ? "bg-warning"
                            : "bg-success"
                        }`}
                        style={{
                          width: `${(worker.currentWorkload / worker.maxWorkload) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <Badge variant={worker.isAvailable ? "success" : "destructive"}>
                    {worker.isAvailable ? "Available" : "Full"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Workshop Updates</CardTitle>
          <Button variant="outline" size="sm">
            Create Huddle
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {huddles?.slice(0, 5).map((huddle) => (
              <div
                key={huddle._id}
                className={`p-4 rounded-lg border ${
                  huddle.isPinned ? "bg-primary/5 border-primary" : ""
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{huddle.title}</h4>
                    {huddle.isPinned && <Badge>Pinned</Badge>}
                  </div>
                  <Badge variant={huddle.type === "urgent" ? "destructive" : "default"}>
                    {huddle.type}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{huddle.content}</p>
                <p className="text-xs text-muted-foreground">
                  {huddle.poster?.fullName} • {new Date(huddle.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}