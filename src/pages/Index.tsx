import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ReviewCard, Review } from "@/components/ReviewCard";
import { PresentationMode } from "@/components/PresentationMode";
import { Navigation } from "@/components/Navigation";
import { Presentation, LayoutGrid, MessageSquarePlus } from "lucide-react";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

const Index = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showPresentation, setShowPresentation] = useState(false);
  const [filterMode, setFilterMode] = useState<"all" | "positive">("all");

  // Load reviews from localStorage
  useEffect(() => {
    const loadReviews = () => {
      const stored = localStorage.getItem('reviews');
      if (stored) {
        const parsedReviews = JSON.parse(stored);
        // Convert timestamp strings back to Date objects
        const reviewsWithDates = parsedReviews.map((r: any) => ({
          ...r,
          timestamp: new Date(r.timestamp)
        }));
        setReviews(reviewsWithDates);
      }
    };
    
    loadReviews();
    
    // Listen for storage changes from other tabs/pages
    window.addEventListener('storage', loadReviews);
    
    // Custom event for same-page updates
    const handleReviewUpdate = () => loadReviews();
    window.addEventListener('reviewsUpdated', handleReviewUpdate);
    
    return () => {
      window.removeEventListener('storage', loadReviews);
      window.removeEventListener('reviewsUpdated', handleReviewUpdate);
    };
  }, []);

  const positiveReviews = reviews.filter(r => r.sentiment === "positive");
  const displayedReviews = filterMode === "positive" ? positiveReviews : reviews;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
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
          <h1 className="text-5xl font-bold mb-4">Reviews Dashboard</h1>
          <p className="text-xl opacity-90">View, filter, and present your customer feedback</p>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="w-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">All Reviews</h2>
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
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground mb-4">No reviews yet. Start collecting feedback!</p>
              <Link to="/feedback">
                <Button size="lg">
                  <MessageSquarePlus className="w-5 h-5 mr-2" />
                  Give Feedback
                </Button>
              </Link>
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
