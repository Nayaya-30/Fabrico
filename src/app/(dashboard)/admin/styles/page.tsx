
// app/(dashboard)/admin/styles/page.tsx
"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, Eye, TrendingUp } from "lucide-react";
import Link from "next/link";

interface AdminStylesPageProps {
  clerkId: string;
}

export default function AdminStylesPage({ clerkId }: AdminStylesPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const styles = useQuery(api.styles.getStyles, { clerkId });
  const deleteStyle = useMutation(api.styles.deleteStyle);

  const filteredStyles = styles?.filter((style) =>
    style.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    style.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (styleId: string) => {
    if (confirm("Are you sure you want to delete this style?")) {
      try {
        await deleteStyle({ clerkId, styleId });
      } catch (error) {
        console.error("Failed to delete style:", error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">Style Management</h1>
          <p className="text-muted-foreground">Manage your style catalog</p>
        </div>
        <Link href="/admin/styles/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Style
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <Card className="md:col-span-3">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search styles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workers?.reduce((sum, w) => sum + (w.profile?.totalCompletedOrders || 0), 0) || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search workers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {filteredWorkers?.map((worker) => {
          const workerWorkload = workload?.find((w) => w.worker.id === worker._id);
          return (
            <Card key={worker._id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-lg">
                      {worker.fullName.charAt(0)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{worker.fullName}</CardTitle>
                      <p className="text-sm text-muted-foreground">{worker.email}</p>
                    </div>
                  </div>
                  <Badge variant={worker.profile?.isAvailable ? "success" : "destructive"}>
                    {worker.profile?.isAvailable ? "Available" : "Busy"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {worker.profile?.specializations && worker.profile.specializations.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Specializations</p>
                    <div className="flex gap-2 flex-wrap">
                      {worker.profile.specializations.map((spec) => (
                        <Badge key={spec} variant="secondary">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {worker.profile?.badges && worker.profile.badges.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Achievements</p>
                    <div className="flex gap-2 flex-wrap">
                      {worker.profile.badges.map((badge) => (
                        <Badge key={badge} variant="default">
                          <Award className="h-3 w-3 mr-1" />
                          {badge.replace("_", " ")}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <p className="text-2xl font-bold">⭐ {worker.profile?.rating.toFixed(1) || "N/A"}</p>
                    <p className="text-xs text-muted-foreground">Rating</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{worker.profile?.totalCompletedOrders || 0}</p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">
                      {workerWorkload?.currentWorkload || 0}/{workerWorkload?.maxWorkload || 5}
                    </p>
                    <p className="text-xs text-muted-foreground">Workload</p>
                  </div>
                </div>

                {workerWorkload && (
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span>Current Workload</span>
                      <span className="text-muted-foreground">
                        {((workerWorkload.currentWorkload / workerWorkload.maxWorkload) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          workerWorkload.currentWorkload >= workerWorkload.maxWorkload
                            ? "bg-destructive"
                            : workerWorkload.currentWorkload >= workerWorkload.maxWorkload * 0.7
                            ? "bg-warning"
                            : "bg-success"
                        }`}
                        style={{
                          width: `${(workerWorkload.currentWorkload / workerWorkload.maxWorkload) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}