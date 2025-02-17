
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";

interface LearningCardProps {
  title: string;
  description: string;
  progress?: number;
  onClick?: () => void;
}

export function LearningCard({ 
  title, 
  description, 
  progress = 0, 
  onClick 
}: LearningCardProps) {
  return (
    <Card className="card-hover cursor-pointer overflow-hidden group" onClick={onClick}>
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
          className="w-full bg-gradient-to-r from-theme-purple to-theme-teal text-white hover:opacity-90"
        >
          Continue Learning
        </Button>
      </CardContent>
    </Card>
  );
}
