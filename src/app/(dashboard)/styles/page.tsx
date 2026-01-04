
// app/(dashboard)/styles/page.tsx
"use client";

import { StyleFeed } from "@/components/styles/style-feed";
import { useUser } from "@clerk/nextjs";

export default function StylesPage() {
  const { user } = useUser();
  const clerkId = user?.id ?? "";
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold">Style Gallery</h1>
        <p className="text-muted-foreground">
          Browse our collection of tailoring styles
        </p>
      </div>

      {clerkId && <StyleFeed clerkId={clerkId} />}
    </div>
  );
}
