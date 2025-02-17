
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface LessonQuizProps {
  questions: Question[];
  onComplete: (score: number) => void;
}

export function LessonQuiz({ questions, onComplete }: LessonQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResults(true);
      const correctAnswers = selectedAnswers.reduce((acc, answer, index) => {
        return acc + (answer === questions[index].correctAnswer ? 1 : 0);
      }, 0);
      const score = Math.round((correctAnswers / questions.length) * 100);
      onComplete(score);
    }
  };

  const question = questions[currentQuestion];
  const hasAnswered = selectedAnswers[currentQuestion] !== undefined;

  if (showResults) {
    return (
      <div className="text-center space-y-4">
        <h3 className="text-xl font-semibold">Quiz Completed!</h3>
        <p className="text-muted-foreground">
          You can now move on to the next lesson.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          <span>
            {selectedAnswers.filter(a => a !== undefined).length} answered
          </span>
        </div>
        
        <h3 className="text-xl font-semibold">{question.question}</h3>
        
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={cn(
                "w-full p-4 text-left rounded-lg border transition-all",
                selectedAnswers[currentQuestion] === index
                  ? "border-theme-purple bg-theme-purple/5"
                  : "border-border hover:border-theme-purple/50"
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleNext}
          disabled={!hasAnswered}
          className="bg-gradient-to-r from-theme-purple to-theme-teal text-white hover:opacity-90"
        >
          {currentQuestion === questions.length - 1 ? "Finish Quiz" : "Next Question"}
        </Button>
      </div>
    </div>
  );
}
