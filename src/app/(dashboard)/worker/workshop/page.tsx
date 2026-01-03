
// app/(dashboard)/worker/workshop/page.tsx
"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";

interface WorkerWorkshopPageProps {
  clerkId: string;
}

export default function WorkerWorkshopPage({ clerkId }: WorkerWorkshopPageProps) {
  const huddles = useQuery(api.huddles.getHuddles, { clerkId });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold">Workshop Updates</h1>
        <p className="text-muted-foreground">Stay informed about workshop announcements</p>
      </div>

      <div className="space-y-4">
        {huddles?.map((huddle) => (
          <Card
            key={huddle._id}
            className={huddle.isPinned ? "border-primary bg-primary/5" : ""}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {huddle.title}
                    {huddle.isPinned && <Badge>Pinned</Badge>}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Posted by {huddle.poster?.fullName} •{" "}
                    {new Date(huddle.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant={huddle.type === "urgent" ? "destructive" : "default"}>
                  {huddle.type.replace("_", " ")}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{huddle.content}</p>
            </CardContent>
          </Card>
        ))}

        {huddles?.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No workshop updates yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}