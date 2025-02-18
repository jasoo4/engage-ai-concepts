import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LessonContent } from "@/components/LessonContent";
import { LessonQuiz } from "@/components/LessonQuiz";
import { useToast } from "@/hooks/use-toast";

// This would typically come from your backend/API
const lessonsData = [
  {
    id: "intro-to-ai",
    title: "What is Artificial Intelligence?",
    description: "Learn about the basics of AI and how it's changing our world",
    content: [
      {
        type: "text" as const,
        content: "AI is like teaching computers to think and make decisions, just like humans—but much faster!\n\nImagine having a super-smart helper that can process huge amounts of information in seconds and learn from patterns to make useful decisions. That's what AI does!"
      },
      {
        type: "text" as const,
        content: "Here are some real-world examples of AI in action:\n\n• Spotify & Netflix: AI suggests music and movies based on what you like\n• Google Translate: AI understands languages and translates them in real-time\n• TikTok: AI recommends videos based on your interests\n• Self-driving cars: AI processes sensor data to navigate safely"
      },
      {
        type: "image" as const,
        content: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
        caption: "Companies using AI in their products - From streaming services to translation tools"
      },
      {
        type: "image" as const,
        content: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
        caption: "Social media platforms like TikTok use AI for content recommendations"
      }
    ],
    quiz: [
      {
        question: "Which of these is an example of AI?",
        options: [
          "A calculator",
          "Siri or Alexa",
          "A light bulb",
          "A regular thermostat"
        ],
        correctAnswer: 1
      },
      {
        question: "What makes AI different from regular computer programs?",
        options: [
          "It runs faster",
          "It uses more electricity",
          "It can learn and adapt from experience",
          "It's more expensive"
        ],
        correctAnswer: 2
      },
      {
        question: "Which of these tasks is AI commonly used for?",
        options: [
          "Basic math calculations",
          "Turning lights on and off",
          "Recommending movies based on your preferences",
          "Storing files on a computer"
        ],
        correctAnswer: 2
      }
    ]
  },
  {
    id: "how-ai-learns",
    title: "How AI Learns",
    description: "Discover how AI systems learn from data and make predictions",
    content: [
      {
        type: "text" as const,
        content: "AI learns by recognizing patterns in data, just like how you learn from experience.\n\nExample: If you see 100 pictures of cats and dogs, you'll recognize them. AI does the same but much faster!"
      },
      {
        type: "text" as const,
        content: "Here's the basic AI learning process:\n\n1️⃣ Data → AI looks at examples (like pictures, text, numbers)\n2️⃣ Patterns → AI finds similarities and differences\n3️⃣ Predictions → AI makes decisions based on what it learned"
      },
      {
        type: "text" as const,
        content: "Real-World Examples:\n\n• Self-Driving Cars: AI learns traffic rules and recognizes people, cars, and stop signs\n• Face Recognition (Snapchat, iPhone): AI recognizes faces for unlocking phones and applying filters"
      },
      {
        type: "image" as const,
        content: "/placeholder.svg",
        caption: "AI Learning Process Visualization"
      }
    ],
    quiz: [
      {
        question: "How does AI learn?",
        options: [
          "By memorizing one example",
          "By finding patterns in data",
          "By guessing randomly"
        ],
        correctAnswer: 1
      },
      {
        question: "What's the first step in AI learning?",
        options: [
          "Making predictions",
          "Looking at data examples",
          "Installing software"
        ],
        correctAnswer: 1
      },
      {
        question: "Which is a real-world example of AI learning?",
        options: [
          "A calculator doing math",
          "A camera taking photos",
          "Face recognition in phones"
        ],
        correctAnswer: 2
      }
    ]
  }
];

export default function Lesson() {
  const [currentLesson, setCurrentLesson] = useState(0);
  const [currentStep, setCurrentStep] = useState<"content" | "quiz">("content");
  const [isCompleted, setIsCompleted] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleQuizComplete = (score: number) => {
    if (score === 100) {
      setIsCompleted(true);
      toast({
        title: "Congratulations! 🎉",
        description: "You've mastered this lesson! Moving on to the next one.",
      });
      
      // Check if there's a next lesson
      if (currentLesson < lessonsData.length - 1) {
        setTimeout(() => {
          setCurrentLesson(currentLesson + 1);
          setCurrentStep("content");
          setIsCompleted(false);
        }, 2000);
      }
    } else {
      toast({
        title: "Keep trying! 💪",
        description: "You need to score 100% to move to the next lesson.",
        variant: "destructive",
      });
      setCurrentStep("content"); // Reset to content view to try again
    }
  };

  const lessonData = lessonsData[currentLesson];

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
