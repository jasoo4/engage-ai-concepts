
import { Button } from "@/components/ui/button";
import { SplashCursor } from "@/components/ui/splash-cursor";
import { Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full overflow-hidden bg-background relative">
      <SplashCursor />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative z-10 text-center space-y-8 px-4 max-w-3xl mx-auto">
          <div className="inline-block p-4 bg-primary/10 rounded-full mb-4 animate-float">
            <Brain className="w-12 h-12 text-theme-purple" />
          </div>
          <h1 className="text-6xl font-bold gradient-text animate-fade-in">
            Learn AI Concepts
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "200ms" }}>
            Begin your journey into the fascinating world of artificial intelligence
          </p>
          <div className="animate-fade-in" style={{ animationDelay: "400ms" }}>
            <Button
              size="lg"
              className="bg-gradient-to-r from-theme-purple to-theme-teal text-white hover:opacity-90 text-lg px-8"
              onClick={() => navigate("/dashboard")}
            >
              Start Learning
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
