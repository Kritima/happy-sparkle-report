import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FeedbackForm } from "@/components/FeedbackForm";
import { ReviewCard, Review, Sentiment } from "@/components/ReviewCard";
import { PresentationMode } from "@/components/PresentationMode";
import { Presentation, LayoutGrid } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const Index = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showPresentation, setShowPresentation] = useState(false);
  const [filterMode, setFilterMode] = useState<"all" | "positive">("all");

  // Simple sentiment analysis based on keywords
  const analyzeSentiment = (message: string): Sentiment => {
    const positive = ["great", "excellent", "amazing", "wonderful", "fantastic", "love", "perfect", "awesome", "best", "good"];
    const negative = ["bad", "terrible", "awful", "poor", "worst", "hate", "disappointed", "useless"];
    
    const lowerMessage = message.toLowerCase();
    
    const positiveCount = positive.filter(word => lowerMessage.includes(word)).length;
    const negativeCount = negative.filter(word => lowerMessage.includes(word)).length;
    
    if (positiveCount > negativeCount) return "positive";
    if (negativeCount > positiveCount) return "negative";
    return "neutral";
  };

  const handleFeedbackSubmit = (feedback: { name: string; email: string; message: string }) => {
    const newReview: Review = {
      id: Date.now().toString(),
      name: feedback.name,
      email: feedback.email,
      message: feedback.message,
      sentiment: analyzeSentiment(feedback.message),
      timestamp: new Date(),
    };
    
    setReviews([newReview, ...reviews]);
  };

  const positiveReviews = reviews.filter(r => r.sentiment === "positive");
  const displayedReviews = filterMode === "positive" ? positiveReviews : reviews;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div 
        className="relative bg-gradient-hero text-white py-20 mb-12"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(16, 185, 129, 0.9) 100%), url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Feedback Management</h1>
          <p className="text-xl opacity-90">Collect, analyze, and showcase your positive reviews</p>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Feedback Form */}
          <div className="lg:col-span-1">
            <FeedbackForm onSubmit={handleFeedbackSubmit} />
          </div>

          {/* Reviews Dashboard */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">Reviews Dashboard</h2>
              <div className="flex gap-2">
                <Button
                  variant={filterMode === "all" ? "default" : "outline"}
                  onClick={() => setFilterMode("all")}
                >
                  <LayoutGrid className="w-4 h-4 mr-2" />
                  All ({reviews.length})
                </Button>
                <Button
                  variant={filterMode === "positive" ? "default" : "outline"}
                  onClick={() => setFilterMode("positive")}
                >
                  Positive ({positiveReviews.length})
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowPresentation(true)}
                  disabled={positiveReviews.length === 0}
                >
                  <Presentation className="w-4 h-4 mr-2" />
                  Present
                </Button>
              </div>
            </div>

            {displayedReviews.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-xl">No reviews yet. Submit feedback to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {displayedReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showPresentation && (
        <PresentationMode
          reviews={positiveReviews}
          onClose={() => setShowPresentation(false)}
        />
      )}
    </div>
  );
};

export default Index;
