import React, { useState, useMemo } from "react";
import BackButton from "@/components/ui/backButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TypographyH3 } from "@/components/ui/typography";
import {
  Settings,
  Check,
  AlertCircle,
  RotateCw,
  CheckSquare,
} from "lucide-react";
import {
  Difficulty,
  generateQuestionSet,
} from "@/utils/questionUtils/questionFactory";
import QuestionTypeSelector from "./QuestionTypeSelector";
import QuestionCarousel from "./QuestionCarousel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import QuestionSolution from "@/components/ui/custom/QuestionSolution";

export default function Quiz() {
  const [difficulty, setDifficulty] = useState(String(Difficulty.MEDIUM));
  const [questionTypes, setQuestionTypes] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isCustomQuestionOpen, setIsCustomQuestionOpen] = useState(false);
  const [customAnswers, setCustomAnswers] = useState([]);
  const [customChecked, setCustomChecked] = useState([]);

  // Score calculation for the custom worksheet
  const customQuizStats = useMemo(() => {
    const totalChecked = customChecked.filter(Boolean).length;
    if (totalChecked === 0) {
      return { score: 0, totalChecked: 0 };
    }

    let score = 0;
    for (let i = 0; i < questions.length; i++) {
      if (customChecked[i]) {
        const isCorrect =
          String(customAnswers[i]).trim().toLowerCase() ===
          String(questions[i].correctAnswer).toLowerCase();
        if (isCorrect) {
          score++;
        }
      }
    }
    return { score, totalChecked };
  }, [customAnswers, customChecked, questions]);

  const generateQuestions = () => {
    if (questionTypes.length === 0) {
      // Optional: Add a toast or alert to inform the user to select a type.
      console.log("Please select at least one question type.");
      return;
    }
    const result = generateQuestionSet(questionTypes, Number(difficulty));

    // Reset everything
    setDialogOpen(false);
    setIsCustomQuestionOpen(false);
    setQuestions(result);
    setCustomAnswers(Array(result.length).fill(""));
    setCustomChecked(Array(result.length).fill(false));

    if (difficulty === String(Difficulty.CUSTOM)) {
      setIsCustomQuestionOpen(true);
    } else {
      setDialogOpen(true);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setQuestions([]);
  };

  // Handlers for the score card buttons
  const handleCheckAll = () => {
    const newCheckedState = customChecked.map((isChecked, index) => {
      return isChecked || customAnswers[index].trim() !== "";
    });
    setCustomChecked(newCheckedState);
  };

  const handleReset = () => {
    setCustomAnswers(Array(questions.length).fill(""));
    setCustomChecked(Array(questions.length).fill(false));
  };

  return (
    <>
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex flex-row items-center gap-2">
          <BackButton className="max-w-min mx-0" />
          <TypographyH3>Quiz</TypographyH3>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-1">
              <Settings className="h-6 w-6" />
              Quiz Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label>Difficulty</Label>
                <Select
                  value={difficulty}
                  onValueChange={(value) => setDifficulty(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={String(Difficulty.EASY)}>
                      Easy
                    </SelectItem>
                    <SelectItem value={String(Difficulty.MEDIUM)}>
                      Normal
                    </SelectItem>
                    <SelectItem value={String(Difficulty.HARD)}>
                      Hard
                    </SelectItem>
                    <Separator />
                    <SelectItem value={String(Difficulty.CUSTOM)}>
                      Custom (Worksheet)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label>Question Types</Label>
                <QuestionTypeSelector
                  onChange={setQuestionTypes}
                  onGenerate={generateQuestions}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {isCustomQuestionOpen && (
          <>
            {/* SCORE & ACTIONS CARD */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Worksheet Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">
                      Score: {customQuizStats.score} /{" "}
                      {customQuizStats.totalChecked}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {questions.length - customQuizStats.totalChecked}{" "}
                      questions remaining
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleCheckAll}
                      variant="outline"
                      size="sm"
                    >
                      <CheckSquare className="h-4 w-4 mr-2" />
                      Check All
                    </Button>
                    <Button
                      onClick={handleReset}
                      variant="destructive"
                      size="sm"
                    >
                      <RotateCw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CUSTOM QUESTIONS LIST */}
            <div className="my-6 space-y-2 shadow p-1 pt-4 rounded-lg">
              <div className="grid grid-cols-[60px_1fr_160px_160px_100px] items-center gap-4 px-4 font-semibold text-muted-foreground border-b pb-2">
                <span>Q.No</span>
                <span>Question</span>
                <span>Your Answer</span>
                <span>Correct Answer</span>
                <span className="text-center">Action</span>
              </div>

              {questions.map((q, index) => (
                <CustomQuestionRow
                  key={index}
                  question={q}
                  index={index}
                  userAnswer={customAnswers[index]}
                  setUserAnswer={(val) =>
                    setCustomAnswers((prev) =>
                      prev.map((a, i) => (i === index ? val : a))
                    )
                  }
                  hasChecked={customChecked[index]}
                  setHasChecked={(val) =>
                    setCustomChecked((prev) =>
                      prev.map((c, i) => (i === index ? val : c))
                    )
                  }
                />
              ))}
            </div>
          </>
        )}
      </div>

      {!isCustomQuestionOpen && questions.length > 0 && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="min-w-3xl max-w-4xl">
            <QuestionCarousel
              questions={questions}
              onClose={handleDialogClose}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

function CustomQuestionRow({
  question,
  index,
  userAnswer,
  setUserAnswer,
  hasChecked,
  setHasChecked,
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const isCorrect =
    String(userAnswer).trim().toLowerCase() ===
    String(question.correctAnswer).toLowerCase();

  const handleCheckClick = () => {
    if (!hasChecked) {
      setHasChecked(true);
    } else {
      setDialogOpen(true);
    }
  };

  return (
    <>
      <div className="grid grid-cols-[60px_1fr_160px_160px_100px] items-center gap-4 px-4 py-2 border-b last:border-b-0 rounded bg-inherit">
        <span className="text-muted-foreground font-medium">Q.{index + 1}</span>

        <div className="min-w-0">
          <span className="break-words">{question.question}</span>
        </div>

        <div className="relative">
          {question.type === "DIVISIBILITY_CHECK" ? (
            <Select
              value={userAnswer}
              onValueChange={(value) => setUserAnswer(value)}
              disabled={hasChecked}
            >
              <SelectTrigger
                className={cn(
                  "bg-white",
                  hasChecked &&
                    (isCorrect
                      ? "border-green-500 text-green-700 bg-green-50"
                      : "border-red-500 text-red-700 bg-red-50")
                )}
              >
                <SelectValue placeholder="Select an answer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">True</SelectItem>
                <SelectItem value="false">False</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Input
              type="text"
              placeholder="Answer"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className={cn(
                "pr-8 bg-white",
                hasChecked &&
                  (isCorrect
                    ? "border-green-500 text-green-700 bg-green-50"
                    : "border-red-500 text-red-700 bg-red-50")
              )}
              disabled={hasChecked}
            />
          )}
          {hasChecked && isCorrect && (
            <Check className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-green-600 pointer-events-none" />
          )}
          {hasChecked && !isCorrect && (
            <AlertCircle className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-red-600 pointer-events-none" />
          )}
        </div>

        <div
          className={cn(
            "flex items-center h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors md:text-sm",
            "whitespace-nowrap",
            "overflow-x-auto",
            "scrollbar-hide",
            !hasChecked && "text-muted-foreground"
          )}
        >
          {hasChecked ? String(question.correctAnswer) : "—"}
        </div>

        <div className="text-center">
          <Button
            variant={hasChecked ? "secondary" : "default"}
            size="sm"
            onClick={handleCheckClick}
            disabled={userAnswer.trim() === "" && !hasChecked}
          >
            {hasChecked ? "Solution" : "Check"}
          </Button>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="min-w-xl max-w-2xl">
          <DialogHeader>
            <DialogTitle>Solution for Q{index + 1}</DialogTitle>
          </DialogHeader>
          <Card>
            <CardHeader>
              <CardTitle>Visual Explanation</CardTitle>
            </CardHeader>
            <CardContent>
              <QuestionSolution question={question} />
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </>
  );
}
