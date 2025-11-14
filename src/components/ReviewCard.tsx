import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, Minus, ThumbsDown, Star } from "lucide-react";

export type Sentiment = "positive" | "neutral" | "negative";

export interface Review {
  id: string;
  email: string;
  rating: number;
  favoriteSession: string;
  improvement: string;
  topics: string[];
  otherTopic?: string;
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
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= review.rating
                        ? "fill-primary text-primary"
                        : "fill-muted text-muted"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{review.rating}/5</span>
            </div>
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
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">💬 Favourite Session</p>
          <p className="text-foreground">{review.favoriteSession}</p>
        </div>
        
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">🚀 Improvement Suggestion</p>
          <p className="text-foreground">{review.improvement}</p>
        </div>
        
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">🎓 Interested Topics</p>
          <div className="flex flex-wrap gap-2">
            {review.topics.map((topic) => (
              <Badge key={topic} variant="outline">
                {topic === "Other" && review.otherTopic ? review.otherTopic : topic}
              </Badge>
            ))}
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground pt-2 border-t">
          {review.timestamp.toLocaleDateString()} at {review.timestamp.toLocaleTimeString()}
        </p>
      </CardContent>
    </Card>
  );
};
