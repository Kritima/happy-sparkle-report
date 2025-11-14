import { useNavigate } from "react-router-dom";
import { FeedbackForm, FeedbackData } from "@/components/FeedbackForm";
import { Navigation } from "@/components/Navigation";
import { Review, Sentiment } from "@/components/ReviewCard";
import heroBg from "@/assets/hero-bg.jpg";

const Feedback = () => {
  const navigate = useNavigate();

  // Sentiment analysis based on rating and feedback text
  const analyzeSentiment = (rating: number, improvement: string, favoriteSession: string): Sentiment => {
    // Rating 4-5 is positive
    if (rating >= 4) return "positive";
    
    // Rating 1-2 is negative
    if (rating <= 2) return "negative";
    
    // For rating 3, check text sentiment
    const positive = ["great", "excellent", "amazing", "wonderful", "fantastic", "love", "perfect", "awesome", "best", "good", "enjoyed"];
    const negative = ["bad", "terrible", "awful", "poor", "worst", "hate", "disappointed", "useless", "boring", "confusing"];
    
    const combinedText = `${improvement} ${favoriteSession}`.toLowerCase();
    
    const positiveCount = positive.filter(word => combinedText.includes(word)).length;
    const negativeCount = negative.filter(word => combinedText.includes(word)).length;
    
    if (positiveCount > negativeCount) return "positive";
    if (negativeCount > positiveCount) return "negative";
    return "neutral";
  };

  const handleFeedbackSubmit = (feedback: FeedbackData) => {
    const newReview: Review = {
      id: Date.now().toString(),
      email: feedback.email,
      rating: feedback.rating,
      favoriteSession: feedback.favoriteSession,
      improvement: feedback.improvement,
      topics: feedback.topics,
      otherTopic: feedback.otherTopic,
      sentiment: analyzeSentiment(feedback.rating, feedback.improvement, feedback.favoriteSession),
      timestamp: new Date(),
    };
    
    // Store in localStorage to share between pages
    const existingReviews = localStorage.getItem('reviews');
    const reviews = existingReviews ? JSON.parse(existingReviews) : [];
    reviews.unshift(newReview);
    localStorage.setItem('reviews', JSON.stringify(reviews));
    
    // Navigate to dashboard
    setTimeout(() => navigate('/'), 500);
  };

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
          <h1 className="text-5xl font-bold mb-4">Share Your Feedback</h1>
          <p className="text-xl opacity-90">We value your opinion and want to hear from you</p>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="max-w-2xl mx-auto">
          <FeedbackForm onSubmit={handleFeedbackSubmit} />
        </div>
      </div>
    </div>
  );
};

export default Feedback;
