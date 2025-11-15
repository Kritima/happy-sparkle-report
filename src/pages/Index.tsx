import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ReviewCard, Review } from "@/components/ReviewCard";
import { PresentationMode } from "@/components/PresentationMode";
import { Navigation } from "@/components/Navigation";
import { Presentation, LogOut, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import heroBg from "@/assets/hero-bg.jpg";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showPresentation, setShowPresentation] = useState(false);
  const [filterMode, setFilterMode] = useState<"all" | "positive">("all");
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminAndLoadReviews = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/login');
          return;
        }

        // Check if user has admin role
        const { data: roles, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .eq('role', 'admin')
          .maybeSingle();

        if (error || !roles) {
          toast({
            title: "Access Denied",
            description: "You don't have permission to access this page.",
            variant: "destructive",
          });
          await supabase.auth.signOut();
          navigate('/login');
          return;
        }

        setIsAdmin(true);
        
        // Load reviews from localStorage
        const loadReviews = () => {
          const storedReviews = localStorage.getItem('reviews');
          if (storedReviews) {
            const parsedReviews = JSON.parse(storedReviews);
            const reviewsWithDates = parsedReviews.map((review: any) => ({
              ...review,
              timestamp: new Date(review.timestamp)
            }));
            setReviews(reviewsWithDates);
          }
        };

        loadReviews();

        // Listen for storage changes
        const handleStorageChange = () => {
          loadReviews();
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('reviewAdded', loadReviews as EventListener);

        setLoading(false);

        return () => {
          window.removeEventListener('storage', handleStorageChange);
          window.removeEventListener('reviewAdded', loadReviews as EventListener);
        };
      } catch (error) {
        console.error('Error checking admin status:', error);
        navigate('/login');
      }
    };

    checkAdminAndLoadReviews();
  }, [navigate, toast]);

  const displayedReviews = filterMode === "positive" 
    ? reviews.filter(r => r.sentiment === "positive")
    : reviews;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    });
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

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
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-5xl font-bold mb-4">DevFest Feedback Dashboard</h1>
              <p className="text-xl opacity-90">View and manage event feedback</p>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border-white/30"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="w-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Feedback Reviews</h2>
            <div className="flex gap-2">
              <Button
                variant={filterMode === "all" ? "default" : "outline"}
                onClick={() => setFilterMode("all")}
              >
                All ({reviews.length})
              </Button>
              <Button
                variant={filterMode === "positive" ? "default" : "outline"}
                onClick={() => setFilterMode("positive")}
              >
                Positive ({reviews.filter(r => r.sentiment === "positive").length})
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowPresentation(true)}
                className="flex items-center gap-2"
              >
                <Presentation className="w-4 h-4" />
                Present
              </Button>
            </div>
          </div>

          {displayedReviews.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-lg border border-border">
              <p className="text-muted-foreground mb-4">No reviews yet</p>
              <Link to="/feedback">
                <Button>Give Feedback</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </div>
      </div>

      {showPresentation && (
        <PresentationMode
          reviews={reviews.filter(r => r.sentiment === "positive")}
          onClose={() => setShowPresentation(false)}
        />
      )}
    </div>
  );
};

export default Index;
