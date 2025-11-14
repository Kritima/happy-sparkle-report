import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";

export interface FeedbackData {
  email: string;
  rating: number;
  favoriteSession: string;
  improvement: string;
  topics: string[];
  otherTopic?: string;
}

interface FeedbackFormProps {
  onSubmit: (feedback: FeedbackData) => void;
}

const topicOptions = [
  "AI & ML",
  "Cloud Computing",
  "Android & Flutter",
  "Web & Frontend",
  "Women Techmakers",
  "Startups & Product",
  "Other"
];

export const FeedbackForm = ({ onSubmit }: FeedbackFormProps) => {
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState<string>("");
  const [favoriteSession, setFavoriteSession] = useState("");
  const [improvement, setImprovement] = useState("");
  const [topics, setTopics] = useState<string[]>([]);
  const [otherTopic, setOtherTopic] = useState("");

  const handleTopicChange = (topic: string, checked: boolean) => {
    if (checked) {
      setTopics([...topics, topic]);
    } else {
      setTopics(topics.filter(t => t !== topic));
      if (topic === "Other") {
        setOtherTopic("");
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !rating || !favoriteSession || !improvement || topics.length === 0) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (topics.includes("Other") && !otherTopic) {
      toast({
        title: "Missing information",
        description: "Please specify the other topic",
        variant: "destructive",
      });
      return;
    }

    onSubmit({ 
      email, 
      rating: parseInt(rating), 
      favoriteSession, 
      improvement, 
      topics,
      otherTopic: topics.includes("Other") ? otherTopic : undefined
    });
    
    setEmail("");
    setRating("");
    setFavoriteSession("");
    setImprovement("");
    setTopics([]);
    setOtherTopic("");
    
    toast({
      title: "Feedback submitted! 🎉",
      description: "Thank you for your feedback",
    });
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>DevFest Feedback 2025</CardTitle>
        <CardDescription>
          Thank you for joining DevFest! 💡<br/>
          Your feedback helps us make next year even better. This form takes less than 1 minute
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div className="space-y-3">
            <Label className="text-base">⭐ Overall, how was your DevFest experience? <span className="text-destructive">*</span></Label>
            <RadioGroup value={rating} onValueChange={setRating}>
              <div className="flex gap-4 items-center">
                <span className="text-sm text-muted-foreground">Lowest</span>
                {[1, 2, 3, 4, 5].map((value) => (
                  <div key={value} className="flex items-center space-x-2">
                    <RadioGroupItem value={value.toString()} id={`rating-${value}`} />
                    <Label htmlFor={`rating-${value}`} className="cursor-pointer">{value}</Label>
                  </div>
                ))}
                <span className="text-sm text-muted-foreground">Highest</span>
              </div>
            </RadioGroup>
          </div>

          {/* Favorite Session */}
          <div className="space-y-2">
            <Label htmlFor="favoriteSession" className="text-base">
              💬 Favourite session or speaker? <span className="text-destructive">*</span>
            </Label>
            <Input
              id="favoriteSession"
              placeholder="Your answer"
              value={favoriteSession}
              onChange={(e) => setFavoriteSession(e.target.value)}
              required
            />
          </div>

          {/* Improvement */}
          <div className="space-y-2">
            <Label htmlFor="improvement" className="text-base">
              🚀 What's one thing we can improve next time? <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="improvement"
              placeholder="Your answer"
              value={improvement}
              onChange={(e) => setImprovement(e.target.value)}
              rows={3}
              required
            />
          </div>

          {/* Topics */}
          <div className="space-y-3">
            <Label className="text-base">
              🎓 What topics would you like to see next year? <span className="text-destructive">*</span>
            </Label>
            <div className="space-y-3">
              {topicOptions.map((topic) => (
                <div key={topic} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={topic}
                      checked={topics.includes(topic)}
                      onCheckedChange={(checked) => handleTopicChange(topic, checked as boolean)}
                    />
                    <Label htmlFor={topic} className="cursor-pointer font-normal">
                      {topic}
                    </Label>
                  </div>
                  {topic === "Other" && topics.includes("Other") && (
                    <Input
                      placeholder="Please specify..."
                      value={otherTopic}
                      onChange={(e) => setOtherTopic(e.target.value)}
                      className="ml-6"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-base">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" size="lg">Submit</Button>
        </form>
      </CardContent>
    </Card>
  );
};
