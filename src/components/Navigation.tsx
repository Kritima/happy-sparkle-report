import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquarePlus, LayoutDashboard } from "lucide-react";

export const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="bg-card shadow-card border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            FeedbackHub
          </Link>
          <div className="flex gap-2">
            <Link to="/">
              <Button 
                variant={location.pathname === "/" ? "default" : "ghost"}
                className="flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Button>
            </Link>
            <Link to="/feedback">
              <Button 
                variant={location.pathname === "/feedback" ? "default" : "ghost"}
                className="flex items-center gap-2"
              >
                <MessageSquarePlus className="w-4 h-4" />
                Give Feedback
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
