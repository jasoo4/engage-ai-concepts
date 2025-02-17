
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, ArrowLeft, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LessonContent } from "@/components/LessonContent";
import { LessonQuiz } from "@/components/LessonQuiz";
import { useToast } from "@/hooks/use-toast";

// This would typically come from your backend/API
const lessonData = {
  id: "intro-to-ai",
  title: "What is Artificial Intelligence?",
  description: "Learn about the basics of AI and how it's changing our world",
  content: [
    {
      type: "text" as const,
      content: "Artificial Intelligence (AI) is like teaching computers to think and learn, similar to how humans do. Imagine teaching a computer to recognize pictures of cats - that's AI in action!"
    },
    {
      type: "image" as const,
      content: "/placeholder.svg",
      caption: "AI learning process visualization"
    },
    {
      type: "text" as const,
      content: "AI systems can:\n• Learn from examples\n• Find patterns in data\n• Make decisions\n• Solve problems"
    }
  ],
  quiz: [
    {
      question: "What is AI primarily designed to do?",
      options: [
        "Replace all human jobs",
        "Help computers think and learn",
        "Make video games more fun",
        "Store lots of data"
      ],
      correctAnswer: 1
    },
    {
      question: "Which of these is an example of AI in action?",
      options: [
        "A calculator adding numbers",
        "Saving a file on a computer",
        "A computer recognizing faces in photos",
        "Sending an email"
      ],
      correctAnswer: 2
    }
  ]
};

export default function Lesson() {
  const [currentStep, setCurrentStep] = useState<"content" | "quiz">("content");
  const [isCompleted, setIsCompleted] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleQuizComplete = (score: number) => {
    setIsCompleted(true);
    toast({
      title: "Lesson Completed! 🎉",
      description: `You scored ${score}% on the quiz. Keep up the great work!`,
    });
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="bg-gradient-to-r from-theme-purple/10 to-theme-teal/10 py-8">
        <div className="container px-4 mx-auto max-w-4xl">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Learning Paths
          </Button>
          
          <div className="flex items-center space-x-3">
            <div className="bg-white/80 p-2 rounded-full">
              <Brain className="w-6 h-6 text-theme-purple" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">
                {lessonData.title}
              </h1>
              <p className="text-muted-foreground mt-1">
                {lessonData.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 mx-auto max-w-4xl mt-8">
        <Card className="p-6">
          {currentStep === "content" ? (
            <>
              <LessonContent content={lessonData.content} />
              <div className="mt-8 flex justify-end">
                <Button
                  size="lg"
                  onClick={() => setCurrentStep("quiz")}
                  className="bg-gradient-to-r from-theme-purple to-theme-teal text-white hover:opacity-90"
                >
                  Take Quiz
                </Button>
              </div>
            </>
          ) : (
            <LessonQuiz 
              questions={lessonData.quiz}
              onComplete={handleQuizComplete}
            />
          )}
        </Card>

        {isCompleted && (
          <div className="mt-6 text-center animate-fade-in">
            <div className="inline-flex items-center space-x-2 text-green-600 bg-green-50 px-4 py-2 rounded-full">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Lesson Completed!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
