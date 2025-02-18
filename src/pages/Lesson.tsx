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
        content: "https://images.unsplash.com/photo-1518770660439-4636190af475",
        caption: "Circuit board representing the intricate neural networks in AI systems"
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
  },
  {
    id: "ai-vs-humans",
    title: "AI vs. Humans",
    description: "Understanding the differences between AI and human intelligence",
    content: [
      {
        type: "text" as const,
        content: "AI is powerful, but it's not smarter than humans—it just processes information much faster!\n\nLet's compare what each does best:\n\n👤 Humans are great at:\n• Understanding emotions and feelings\n• Being creative and original\n• Using common sense\n• Adapting to new situations\n\n🤖 AI excels at:\n• Fast calculations\n• Pattern recognition\n• Processing huge amounts of data\n• Repetitive tasks and automation"
      },
      {
        type: "text" as const,
        content: "Real-World Examples:\n\n♟️ AI Wins at Chess:\nAI can beat world chess champions because it can calculate millions of possible moves super fast. But it doesn't 'understand' the game like humans do—it just follows patterns and calculations.\n\n🎨 AI Can't Replace Artists:\nWhile AI can create impressive artwork by combining existing styles and patterns, it doesn't truly understand creativity, emotion, or meaning like human artists do."
      },
      {
        type: "image" as const,
        content: "https://images.unsplash.com/photo-1518770660439-4636190af475",
        caption: "AI excels at processing data and patterns, while humans excel at creativity and emotional understanding"
      }
    ],
    quiz: [
      {
        question: "What is something AI cannot do well?",
        options: [
          "Solve math problems",
          "Understand emotions",
          "Recommend YouTube videos"
        ],
        correctAnswer: 1
      },
      {
        question: "Why can AI beat humans at chess?",
        options: [
          "Because it understands the game better",
          "Because it's more creative",
          "Because it can calculate moves faster"
        ],
        correctAnswer: 2
      },
      {
        question: "Which is a unique human strength compared to AI?",
        options: [
          "Processing large amounts of data",
          "Making creative and original art",
          "Performing repetitive tasks"
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "ml-basics",
    title: "Machine Learning Basics",
    description: "Understanding the fundamentals of Machine Learning",
    content: [
      {
        type: "text" as const,
        content: "Machine Learning is a type of AI that helps computers learn from experience without being explicitly programmed!\n\nThink of it like teaching a child:\n• First, you show them examples (Training Data)\n• They learn patterns from these examples (Learning)\n• Finally, they can recognize similar things on their own (Prediction)"
      },
      {
        type: "text" as const,
        content: "There are three main types of Machine Learning:\n\n1️⃣ Supervised Learning:\n• Like learning with a teacher\n• Computer learns from labeled examples\n• Example: Spam email detection\n\n2️⃣ Unsupervised Learning:\n• Learning without labels\n• Finding patterns in data\n• Example: Customer grouping\n\n3️⃣ Reinforcement Learning:\n• Learning through trial and error\n• Getting rewards for correct actions\n• Example: Game playing AI"
      },
      {
        type: "image" as const,
        content: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4",
        caption: "Machine Learning processes vast amounts of data to find patterns and make predictions"
      }
    ],
    quiz: [
      {
        question: "What is Machine Learning?",
        options: [
          "A type of computer programming",
          "Learning from experience without explicit programming",
          "A type of computer hardware"
        ],
        correctAnswer: 1
      },
      {
        question: "Which type of ML learns from labeled examples?",
        options: [
          "Unsupervised Learning",
          "Reinforcement Learning",
          "Supervised Learning"
        ],
        correctAnswer: 2
      },
      {
        question: "What is an example of Reinforcement Learning?",
        options: [
          "Spam detection",
          "Customer grouping",
          "Game playing AI"
        ],
        correctAnswer: 2
      }
    ]
  },
  {
    id: "ml-applications",
    title: "Machine Learning Applications",
    description: "Explore real-world applications of Machine Learning",
    content: [
      {
        type: "text" as const,
        content: "Machine Learning is everywhere in our daily lives! Let's see where it's used:\n\n🏥 Healthcare:\n• Disease diagnosis from medical images\n• Predicting patient outcomes\n• Drug discovery\n\n🛍️ Shopping:\n• Product recommendations\n• Inventory management\n• Price optimization"
      },
      {
        type: "text" as const,
        content: "🎮 Entertainment:\n• Game AI opponents\n• Music and movie recommendations\n• Content moderation\n\n🚗 Transportation:\n• Traffic prediction\n• Route optimization\n• Self-driving vehicles"
      },
      {
        type: "image" as const,
        content: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
        caption: "Machine Learning powers many everyday technologies, from healthcare to entertainment"
      }
    ],
    quiz: [
      {
        question: "Which sector uses ML for disease diagnosis?",
        options: [
          "Entertainment",
          "Healthcare",
          "Transportation"
        ],
        correctAnswer: 1
      },
      {
        question: "How does ML help in shopping?",
        options: [
          "By designing store layouts",
          "By making product recommendations",
          "By managing store employees"
        ],
        correctAnswer: 1
      },
      {
        question: "What is a transportation application of ML?",
        options: [
          "Traffic prediction",
          "Car manufacturing",
          "Road construction"
        ],
        correctAnswer: 0
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
