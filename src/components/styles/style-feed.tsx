// components/styles/style-feed.tsx
"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { StyleCard } from "./style-card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface StyleFeedProps {
  clerkId: string;
}

const categories = [
  "All",
  "suit",
  "dress",
  "shirt",
  "pants",
  "traditional",
  "accessories",
];

export function StyleFeed({ clerkId }: StyleFeedProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const styles = useQuery(api.styles.getStyles, {
    category: selectedCategory === "All" ? undefined : selectedCategory,
    clerkId,
  });

  if (styles === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
            className="whitespace-nowrap"
          >
            {category}
          </Button>
        ))}
      </div>

      {styles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No styles found in this category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {styles.map((style) => (
            <StyleCard
              key={style._id}
              style={style}
              clerkId={clerkId}
              onOrderClick={() => {
                // Navigate to order creation page
                window.location.href = `/orders/new?styleId=${style._id}`;
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
