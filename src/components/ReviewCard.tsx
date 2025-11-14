import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, Minus, ThumbsDown } from "lucide-react";

export type Sentiment = "positive" | "neutral" | "negative";

export interface Review {
  id: string;
  name: string;
  email: string;
  message: string;
  sentiment: Sentiment;
  timestamp: Date;
}

interface ReviewCardProps {
  review: Review;
}

export const ReviewCard = ({ review }: ReviewCardProps) => {
  const sentimentConfig = {
    positive: {
      badge: "positive",
      icon: ThumbsUp,
      label: "Positive",
    },
    neutral: {
      badge: "neutral",
      icon: Minus,
      label: "Neutral",
    },
    negative: {
      badge: "negative",
      icon: ThumbsDown,
      label: "Negative",
    },
  };

  const config = sentimentConfig[review.sentiment];
  const Icon = config.icon;

  return (
    <Card className="shadow-card hover:shadow-elegant transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{review.name}</CardTitle>
            <CardDescription>{review.email}</CardDescription>
          </div>
          <Badge 
            variant={config.badge as any}
            className={`flex items-center gap-1 ${
              review.sentiment === "positive" ? "bg-positive text-positive-foreground" :
              review.sentiment === "neutral" ? "bg-neutral text-neutral-foreground" :
              "bg-negative text-negative-foreground"
            }`}
          >
            <Icon className="w-3 h-3" />
            {config.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-foreground">{review.message}</p>
        <p className="text-xs text-muted-foreground mt-4">
          {review.timestamp.toLocaleDateString()} at {review.timestamp.toLocaleTimeString()}
        </p>
      </CardContent>
    </Card>
  );
};
