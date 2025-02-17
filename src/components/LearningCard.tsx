
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LearningCardProps {
  id?: string;
  title: string;
  description: string;
  progress?: number;
}

export function LearningCard({ 
  id = "intro-to-ai",
  title, 
  description, 
  progress = 0
}: LearningCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="card-hover cursor-pointer overflow-hidden group">
      <CardHeader className="space-y-1">
        <div className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-theme-purple" />
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{description}</p>
        {progress > 0 && (
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-theme-purple transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
        <Button 
          variant="default"
          size="default"
          className="w-full bg-gradient-to-r from-theme-purple to-theme-teal text-white hover:opacity-90"
          onClick={() => navigate(`/lesson/${id}`)}
        >
          Continue Learning
        </Button>
      </CardContent>
    </Card>
  );
}
