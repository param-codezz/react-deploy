import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Eye,
  RotateCw,
  CheckCircle,
  XCircle,
} from "lucide-react";
import QuestionSolution from "@/components/ui/custom/QuestionSolution";
import { Progress } from "@/components/ui/progress";

// The CircularProgress component remains the same
// ...

export default function QuestionCarousel({ questions = [] }) {
  // ... (all state and functions remain the same)
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [checked, setChecked] = useState([]);
  const [showSolution, setShowSolution] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const score = React.useMemo(() => {
    return answers.filter((a, i) => a === questions[i].correctAnswer).length;
  }, [answers, questions]);

  const currentQuestion = questions[current];
  const progressPercent = ((current + 1) / questions.length) * 100;

  const selectOption = (index) => {
    if (checked[current]) return;
    const updated = [...answers];
    updated[current] = index;
    setAnswers(updated);
  };

  const isSelected = (index) => answers[current] === index;

  const handleCheck = () => {
    if (answers[current] === undefined) return;
    const updated = [...checked];
    updated[current] = true;
    setChecked(updated);
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrent(0);
    setAnswers([]);
    setChecked([]);
    setIsFinished(false);
  };

  if (isFinished) {
    const scorePercentage =
      questions.length > 0 ? (score / questions.length) * 100 : 0;

    return (
      <div className="w-full max-w-2xl mx-auto space-y-4 py-4">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Quiz Complete!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* --- MODIFIED SCORE SECTION --- */}
            <div className="relative flex items-center justify-center h-36">
              {/* Gauge is absolutely positioned behind the text */}
              <div className="absolute">
                <CircularProgress
                  size={140} // Smaller circle
                  strokeWidth={10} // Slightly thinner stroke
                  progress={scorePercentage}
                />
              </div>
              {/* Score text is now a flex column for compact stacking */}
              <div className="relative text-center flex flex-col">
                <span className="text-4xl font-bold tracking-tighter">
                  {score}
                </span>
                <span className="text-sm text-muted-foreground -mt-1">
                  out of {questions.length}
                </span>
              </div>
            </div>
            {/* --- END OF MODIFIED SECTION --- */}

            <div className="space-y-3 max-h-96 overflow-y-auto pr-4">
              <h3 className="font-semibold sticky top-0 bg-card pb-2">
                Review Your Answers
              </h3>
              {questions.map((q, idx) => {
                const userAnswer = answers[idx];
                const isCorrect = userAnswer === q.correctAnswer;
                return (
                  <div
                    key={idx}
                    className="flex items-start text-sm p-3 rounded-md border"
                  >
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 mr-3 text-green-600 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 mr-3 text-red-600 flex-shrink-0" />
                    )}
                    <div className="flex-grow">
                      <p className="font-medium">{q.question}</p>
                      <p
                        className={cn(
                          "mt-1",
                          isCorrect ? "text-green-700" : "text-red-700"
                        )}
                      >
                        Your answer: {q.options[userAnswer] ?? "Not answered"}
                      </p>
                      {!isCorrect && (
                        <p className="mt-1 text-gray-600">
                          Correct answer: {q.options[q.correctAnswer]}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <Button onClick={handleRestart} className="w-full">
              <RotateCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- Quiz view remains the same ---
  return (
    // ... rest of the component is unchanged
    <div className="w-full max-w-2xl mx-auto space-y-4 py-4">
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Previous
        </Button>
        <div className="w-full text-center space-y-2">
          <div>
            <b>{current + 1}</b> of {questions.length}
          </div>
          <Progress value={progressPercent} className="h-2 flex-1" />
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNext}
          disabled={current === questions.length - 1 && !checked[current]}
        >
          {current === questions.length - 1 ? (
            "Finish"
          ) : (
            <>
              Next <ArrowRight className="w-4 h-4 ml-1" />
            </>
          )}
        </Button>
      </div>
      {currentQuestion && (
        <>
          <Card className="shadow-none border-0">
            <CardContent className="space-y-4 py-6">
              <p className="font-semibold">
                Q{current + 1}: {currentQuestion.question}
              </p>
              <div className="grid grid-cols-2 gap-3">
                {currentQuestion.options.map((opt, idx) => (
                  <Button
                    key={idx}
                    variant={isSelected(idx) ? "default" : "outline"}
                    className={cn(
                      "text-sm border h-auto py-2 whitespace-normal text-left justify-start",
                      checked[current] &&
                        idx === currentQuestion.correctAnswer &&
                        "border-green-500 bg-green-100 text-green-800",
                      checked[current] &&
                        isSelected(idx) &&
                        idx !== currentQuestion.correctAnswer &&
                        "border-red-800 bg-red-200 text-red-800"
                    )}
                    onClick={() => selectOption(idx)}
                    disabled={checked[current]}
                  >
                    {opt}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
          <div className="flex flex-col sm:flex-row justify-between gap-2">
            <Dialog open={showSolution} onOpenChange={setShowSolution}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto" variant="secondary">
                  <Eye className="w-4 h-4 mr-1" /> View Solution
                </Button>
              </DialogTrigger>
              <DialogContent className="min-w-xl">
                <DialogHeader>
                  <DialogTitle>Solution</DialogTitle>
                </DialogHeader>
                <div className="mt-2">
                  <QuestionSolution question={currentQuestion} />
                </div>
              </DialogContent>
            </Dialog>
            <Button
              className="bg-green-700 hover:bg-green-600 text-white w-full sm:w-auto"
              onClick={handleCheck}
              disabled={checked[current] || answers[current] === undefined}
            >
              <BadgeCheck className="w-4 h-4 mr-1" /> Check Answer
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

// ... CircularProgress component is unchanged
function CircularProgress({ size = 120, strokeWidth = 10, progress = 0 }) {
  const center = size / 2;
  const radius = size / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        className="text-gray-200 dark:text-gray-700"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        fill="transparent"
        r={radius}
        cx={center}
        cy={center}
      />
      <circle
        className="text-blue-600"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        fill="transparent"
        r={radius}
        cx={center}
        cy={center}
        style={{ transition: "stroke-dashoffset 0.5s ease-in-out" }}
      />
    </svg>
  );
}
