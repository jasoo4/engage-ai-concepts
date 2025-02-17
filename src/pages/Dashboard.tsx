
import { LearningCard } from "@/components/LearningCard";
import { ProgressSection } from "@/components/ProgressSection";
import { Brain, Lightbulb, Network, Code } from "lucide-react";
import { SplashCursor } from "@/components/ui/splash-cursor";

const learningPaths = [
  {
    title: "Introduction to AI",
    description: "Learn the basics of artificial intelligence and its impact on our world.",
    progress: 65,
  },
  {
    title: "Machine Learning Fundamentals",
    description: "Discover how machines learn from data and make predictions.",
    progress: 30,
  },
  {
    title: "Neural Networks",
    description: "Explore how artificial neural networks mimic the human brain.",
    progress: 0,
  },
  {
    title: "AI Ethics",
    description: "Understand the ethical considerations in AI development.",
    progress: 0,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background animate-fade-in relative">
      <SplashCursor />
      <div className="container py-8 px-4 mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-block p-2 bg-primary/10 rounded-full mb-4 animate-float">
            <Brain className="w-8 h-8 text-theme-purple" />
          </div>
          <h1 className="text-4xl font-bold gradient-text">
            Learn AI Concepts
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore the fascinating world of artificial intelligence through interactive lessons and engaging content.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-semibold mb-6">Learning Paths</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {learningPaths.map((path, index) => (
                <div key={path.title} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <LearningCard {...path} />
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-6">Your Journey</h2>
            <ProgressSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
