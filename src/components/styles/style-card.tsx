// components/styles/style-card.tsx
"use client";

import { useState } from "react";
import { Heart, Bookmark, ShoppingBag } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface StyleCardProps {
  style: {
    _id: Id<"styles">;
    title: string;
    description: string;
    images: string[];
    category: string;
    basePrice: number;
    likes: number;
    difficulty: "easy" | "medium" | "hard";
    isLiked?: boolean;
    isSaved?: boolean;
  };
  clerkId: string;
  onOrderClick?: () => void;
}

export function StyleCard({ style, clerkId, onOrderClick }: StyleCardProps) {
  const [liked, setLiked] = useState(style.isLiked || false);
  const [saved, setSaved] = useState(style.isSaved || false);
  const [likesCount, setLikesCount] = useState(style.likes);

  const likeStyle = useMutation(api.styles.likeStyle);
  const saveStyle = useMutation(api.styles.saveStyle);

  const handleLike = async () => {
    try {
      const result = await likeStyle({
        clerkId,
        styleId: style._id,
      });

      setLiked(result.liked);
      setLikesCount((prev) => (result.liked ? prev + 1 : prev - 1));
    } catch (error) {
      console.error("Failed to like style:", error);
    }
  };

  const handleSave = async () => {
    try {
      const result = await saveStyle({
        clerkId,
        styleId: style._id,
      });

      setSaved(result.saved);
    } catch (error) {
      console.error("Failed to save style:", error);
    }
  };

  const difficultyColors = {
    easy: "success",
    medium: "warning",
    hard: "destructive",
  } as const;

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={style.images[0] || "/placeholder-style.jpg"}
          alt={style.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        <div className="absolute top-2 right-2 flex gap-2">
          <Badge variant={difficultyColors[style.difficulty]}>
            {style.difficulty}
          </Badge>
        </div>

        <div className="absolute top-2 left-2">
          <Badge variant="secondary">{style.category}</Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">{style.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {style.description}
        </p>
        <p className="text-lg font-bold">₦{style.basePrice.toLocaleString()}</p>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLike}
          className={liked ? "text-primary" : ""}
        >
          <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSave}
          className={saved ? "text-primary" : ""}
        >
          <Bookmark className={`h-5 w-5 ${saved ? "fill-current" : ""}`} />
        </Button>

        <span className="text-sm text-muted-foreground flex-1">
          {likesCount} likes
        </span>

        <Button size="sm" onClick={onOrderClick}>
          <ShoppingBag className="h-4 w-4 mr-2" />
          Order
        </Button>
      </CardFooter>
    </Card>
  );
}
