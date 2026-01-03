
// app/(dashboard)/styles/page.tsx
"use client";

import { StyleFeed } from "@/components/styles/style-feed";

interface StylesPageProps {
  clerkId: string;
}

export default function StylesPage({ clerkId }: StylesPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold">Style Gallery</h1>
        <p className="text-muted-foreground">
          Browse our collection of tailoring styles
        </p>
      </div>

      <StyleFeed clerkId={clerkId} />
    </div>
  );
}
