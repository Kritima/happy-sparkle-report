import { Review } from "./ReviewCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface PresentationModeProps {
  reviews: Review[];
  onClose: () => void;
}

export const PresentationMode = ({ reviews, onClose }: PresentationModeProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentReview = reviews[currentIndex];

  const goToNext = () => {
    if (currentIndex < reviews.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (reviews.length === 0) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
        <div className="text-center">
          <Button onClick={onClose} variant="ghost" className="absolute top-4 right-4">
            <X className="w-6 h-6" />
          </Button>
          <p className="text-2xl text-muted-foreground">No positive reviews yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-hero z-50 flex items-center justify-center p-8">
      <Button onClick={onClose} variant="ghost" className="absolute top-4 right-4 text-white hover:bg-white/20">
        <X className="w-6 h-6" />
      </Button>

      <div className="max-w-4xl w-full">
        <Card className="shadow-elegant">
          <CardContent className="p-12">
            <div className="text-center space-y-6">
              <div className="text-6xl mb-8">⭐</div>
              <h2 className="text-4xl font-bold text-foreground">{currentReview.name}</h2>
              <p className="text-2xl text-foreground leading-relaxed italic">
                "{currentReview.message}"
              </p>
              <p className="text-muted-foreground">
                {currentReview.timestamp.toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between mt-8">
          <Button
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            variant="secondary"
            size="lg"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Previous
          </Button>
          
          <span className="text-white text-lg font-medium">
            {currentIndex + 1} / {reviews.length}
          </span>
          
          <Button
            onClick={goToNext}
            disabled={currentIndex === reviews.length - 1}
            variant="secondary"
            size="lg"
          >
            Next
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};
