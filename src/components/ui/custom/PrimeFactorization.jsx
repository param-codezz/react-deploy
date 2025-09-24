// components/visuals/VisualPrimeFactorization.jsx

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { History, Play } from "lucide-react";
import { getPrimeFactorizationSteps } from "@/utils/primeFactorization";
import { cn } from "@/lib/utils";

const getDelay = (speed) => {
  switch (speed) {
    case "fast":
      return 800;
    case "medium":
      return 1600;
    case "slow":
      return 2500;
    default:
      return 1600;
  }
};

const VisualPrimeFactorization = ({ number, showAnimationControls = true }) => {
  const [animationSteps, setAnimationSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  // NEW: State to control whether to show the final static result or the animation
  const [isShowingStaticResult, setIsShowingStaticResult] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState("medium");
  const [error, setError] = useState("");

  const prepareAnimation = useCallback(() => {
    const { steps, error: newError } = getPrimeFactorizationSteps(
      Number(number)
    );
    setError(newError);
    setAnimationSteps(steps);
    setCurrentStepIndex(0); // Always reset index
    setIsAnimating(false);
    setIsShowingStaticResult(true); // Always default to showing the static result
  }, [number]);

  useEffect(() => {
    prepareAnimation();
  }, [prepareAnimation]);

  useEffect(() => {
    if (isAnimating && currentStepIndex < animationSteps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStepIndex((prevIndex) => prevIndex + 1);
      }, getDelay(animationSpeed));
      return () => clearTimeout(timer);
    } else if (isAnimating) {
      // Animation has finished
      setIsAnimating(false);
    }
  }, [isAnimating, currentStepIndex, animationSteps, animationSpeed]);

  const handlePlayAnimation = () => {
    if (animationSteps.length > 0 && !error) {
      setIsShowingStaticResult(false); // Switch to animation view
      setCurrentStepIndex(0);
      setIsAnimating(true);
    }
  };

  const handleReset = () => {
    setIsShowingStaticResult(true); // Switch back to the static result view
    setIsAnimating(false);
    setCurrentStepIndex(0);
  };

  // Determine which visuals to display based on the mode
  const finalStep =
    animationSteps.length > 0
      ? animationSteps[animationSteps.length - 1]
      : null;
  const currentAnimationStep = animationSteps[currentStepIndex];

  const visualsToShow = isShowingStaticResult
    ? finalStep
    : currentAnimationStep;

  // Fallback for initial render or errors
  const defaultVisuals = {
    rows: [],
    currentNumber: number,
    currentDivisor: null,
    highlight: null,
    stepMessage: "Ready to start.",
    isFinal: false,
    finalFactors: [],
  };

  const currentVisuals = visualsToShow || defaultVisuals;

  return (
    <div className="p-4 max-w-lg mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-xl">
            {number} ના અવિભાજ્ય અવયવો
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : (
            <>
              {/* Division Method Table */}
              <div className="font-mono text-2xl mx-auto w-40">
                <div className="grid grid-cols-2">
                  {/* Completed Rows */}
                  {currentVisuals.rows.map((row, index) => (
                    <React.Fragment key={index}>
                      <div className="p-2 text-center font-bold text-green-600 border-b border-slate-300">
                        {row.divisor}
                      </div>
                      <div className="p-2 text-center border-l border-b border-slate-300">
                        {row.number}
                      </div>
                    </React.Fragment>
                  ))}

                  {/* Current Active Row (only shows during animation) */}
                  {!isShowingStaticResult && (
                    <>
                      <div
                        className={cn(
                          "p-2 text-center font-bold text-green-600",
                          currentVisuals.highlight === "divisor" &&
                            "bg-yellow-200 rounded animate-pulse"
                        )}
                      >
                        {currentVisuals.currentDivisor}
                      </div>
                      <div
                        className={cn(
                          "p-2 text-center border-l border-slate-300",
                          currentVisuals.highlight === "number" &&
                            "bg-yellow-200 rounded animate-pulse"
                        )}
                      >
                        {currentVisuals.currentNumber}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Final Result Display */}
              {currentVisuals.isFinal && (
                <div className="text-center p-2 bg-green-100 text-green-800 rounded-md font-semibold text-lg">
                  {currentVisuals.stepMessage}
                </div>
              )}
            </>
          )}

          {/* Step Message (only shown during animation) */}
          {showAnimationControls &&
            !isShowingStaticResult &&
            !currentVisuals.isFinal && (
              <div className="mt-4 text-sm text-center text-gray-700 h-10">
                {currentVisuals.stepMessage}
              </div>
            )}
        </CardContent>
        {showAnimationControls && !error && (
          <CardFooter className="flex space-x-4 justify-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={handlePlayAnimation} disabled={isAnimating}>
                  <Play />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Play Animation</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  disabled={isAnimating}
                >
                  <History />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reset to Start</TooltipContent>
            </Tooltip>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default VisualPrimeFactorization;
