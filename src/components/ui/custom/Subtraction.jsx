import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { History, Play } from "lucide-react";
import { Card, CardContent, CardFooter } from "../card"; // Adjust path as needed
import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip"; // Adjust path as needed

const getDelay = (speed) => {
  switch (speed) {
    case "fast":
      return 750;
    case "medium":
      return 1500;
    case "slow":
      return 2500;
    default:
      return 1500;
  }
};

const padArrayWithChar = (arr, length, char = " ") => {
  const newArr = [...arr];
  while (newArr.length < length) {
    newArr.unshift(char);
  }
  return newArr;
};

const VisualSubtraction = ({
  num1: num1Prop = "",
  num2: num2Prop = "",
  showAnimationControls = false,
}) => {
  const [animationSteps, setAnimationSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState("medium");
  const [error, setError] = useState("");

  const prepareAnimationStepsInternal = useCallback(() => {
    // ... (Keep the exact same logic from your previous "bingo cool" version)
    const n1StrRaw = String(num1Prop).trim();
    const n2StrRaw = String(num2Prop).trim();

    if (
      !n1StrRaw ||
      isNaN(Number(n1StrRaw)) ||
      !n2StrRaw ||
      isNaN(Number(n2StrRaw))
    ) {
      setError("Number 1 and Number 2 must be valid, non-empty numbers.");
      // setAnimationSteps([]); // This will be handled by the caller useEffect
      return [];
    }

    const n1 = Number(n1StrRaw);
    const n2 = Number(n2StrRaw);

    if (n1 < n2) {
      setError(
        "Number 1 must be greater than or equal to Number 2 for this visualizer."
      );
      // setAnimationSteps([]); // Handled by caller
      return [];
    }
    setError(""); // Clear error if inputs are valid now

    const num1Str = String(n1);
    const num2Str = String(n2);
    const maxLength = num1Str.length;
    const finalDisplayLength = maxLength;

    const op1_original_padded = padArrayWithChar(
      num1Str.split(""),
      finalDisplayLength,
      " "
    );
    const op2_padded = padArrayWithChar(
      num2Str.padStart(maxLength, "0").split(""),
      finalDisplayLength,
      " "
    );

    let steps = [];
    let currentNum1CalcValues = num1Str
      .split("")
      .map((d) => (d === " " ? 0 : parseInt(d)));
    if (currentNum1CalcValues.length < finalDisplayLength) {
      const paddingNeeded = finalDisplayLength - currentNum1CalcValues.length;
      for (let p = 0; p < paddingNeeded; p++) currentNum1CalcValues.unshift(0);
    }

    let currentResultArray = Array(finalDisplayLength).fill(" ");
    let currentBorrowAnnotations = Array(finalDisplayLength).fill(" ");
    let currentStrikeThroughs = Array(finalDisplayLength).fill(false);

    // Initial Step - will be step 0
    steps.push({
      num1OriginalDisplay: [...op1_original_padded],
      num2Display: [...op2_padded],
      borrowAnnotationsRow: [...currentBorrowAnnotations],
      resultDisplay: [...currentResultArray],
      strikeThroughInNum1Original: [...currentStrikeThroughs],
      highlightColumnIndex: -1,
      highlightBorrowAnnotationIndex: -1,
      highlightResultIndex: -1,
      stepMessage: "Numbers ready for subtraction. Click Play.",
    });

    for (let i = 0; i < maxLength; i++) {
      const logicalCol = finalDisplayLength - 1 - i;

      let digit1ForCalc = currentNum1CalcValues[logicalCol];
      const digit2ForCalc = parseInt(
        op2_padded[logicalCol] === " " ? "0" : op2_padded[logicalCol]
      );

      let stepMessageBase = `Column ${i + 1} (from right): `;

      // Step: Highlight current column
      steps.push({
        num1OriginalDisplay: [...op1_original_padded],
        num2Display: [...op2_padded],
        borrowAnnotationsRow: [...currentBorrowAnnotations],
        resultDisplay: [...currentResultArray],
        strikeThroughInNum1Original: [...currentStrikeThroughs],
        highlightColumnIndex: logicalCol,
        highlightBorrowAnnotationIndex: -1,
        highlightResultIndex: -1,
        stepMessage: `${stepMessageBase}Considering ${
          op1_original_padded[logicalCol]
        } (now ${
          currentBorrowAnnotations[logicalCol] !== " "
            ? currentBorrowAnnotations[logicalCol]
            : op1_original_padded[logicalCol]
        }, effectively ${digit1ForCalc}) and ${op2_padded[logicalCol]}.`,
      });

      let borrowActionMessages = [];
      let tempBorrowAnnotations = [...currentBorrowAnnotations];
      let tempStrikeThroughs = [...currentStrikeThroughs];
      let borrowedInThisIteration = false;

      if (digit1ForCalc < digit2ForCalc) {
        borrowedInThisIteration = true;
        borrowActionMessages.push(
          `${digit1ForCalc} < ${digit2ForCalc}. Need to borrow.`
        );
        let borrowFromCol = logicalCol - 1;

        while (borrowFromCol >= 0) {
          if (currentNum1CalcValues[borrowFromCol] > 0) {
            currentNum1CalcValues[borrowFromCol]--;
            tempBorrowAnnotations[borrowFromCol] =
              currentNum1CalcValues[borrowFromCol].toString();
            tempStrikeThroughs[borrowFromCol] = true;
            borrowActionMessages.push(
              `Borrowed 1 from column ${maxLength - borrowFromCol} (was ${
                op1_original_padded[borrowFromCol]
              }, effectively ${
                currentNum1CalcValues[borrowFromCol] + 1
              }), it becomes ${currentNum1CalcValues[borrowFromCol]}.`
            );

            for (let k = borrowFromCol + 1; k < logicalCol; k++) {
              currentNum1CalcValues[k] = 9;
              tempBorrowAnnotations[k] = "9";
              tempStrikeThroughs[k] = true;
              borrowActionMessages.push(
                `Column ${maxLength - k} (was ${
                  op1_original_padded[k]
                }) becomes 9.`
              );
            }
            digit1ForCalc += 10;
            tempBorrowAnnotations[logicalCol] = digit1ForCalc.toString();
            tempStrikeThroughs[logicalCol] = true;
            borrowActionMessages.push(
              `Current column ${i + 1} (was ${
                op1_original_padded[logicalCol]
              }) becomes ${digit1ForCalc}.`
            );

            steps.push({
              num1OriginalDisplay: [...op1_original_padded],
              num2Display: [...op2_padded],
              borrowAnnotationsRow: [...tempBorrowAnnotations],
              resultDisplay: [...currentResultArray],
              strikeThroughInNum1Original: [...tempStrikeThroughs],
              highlightColumnIndex: logicalCol,
              highlightBorrowAnnotationIndex: logicalCol,
              highlightResultIndex: -1,
              stepMessage: `${stepMessageBase}${borrowActionMessages.join(
                " "
              )}`,
            });
            break;
          }
          borrowFromCol--;
        }
        currentBorrowAnnotations = [...tempBorrowAnnotations];
        currentStrikeThroughs = [...tempStrikeThroughs];
      }

      const diff = digit1ForCalc - digit2ForCalc;
      currentResultArray[logicalCol] = String(diff);

      steps.push({
        num1OriginalDisplay: [...op1_original_padded],
        num2Display: [...op2_padded],
        borrowAnnotationsRow: [...currentBorrowAnnotations],
        resultDisplay: [...currentResultArray],
        strikeThroughInNum1Original: [...currentStrikeThroughs],
        highlightColumnIndex: -1,
        highlightBorrowAnnotationIndex: borrowedInThisIteration
          ? logicalCol
          : -1,
        highlightResultIndex: logicalCol,
        stepMessage: `${stepMessageBase}${
          borrowActionMessages.length > 0
            ? borrowActionMessages.join(" ") + " "
            : ""
        }So, ${digit1ForCalc} - ${digit2ForCalc} = ${diff}. Result digit: ${diff}.`,
      });
    }

    let finalResultStr = currentResultArray.join("").trim();
    if (finalResultStr.length > 1 && finalResultStr.startsWith("0")) {
      finalResultStr = finalResultStr.replace(/^0+/, "");
    }
    if (finalResultStr === "") finalResultStr = "0";

    // This becomes the last step, which will be shown by default
    steps.push({
      num1OriginalDisplay: [...op1_original_padded],
      num2Display: [...op2_padded],
      borrowAnnotationsRow: [...currentBorrowAnnotations],
      resultDisplay: padArrayWithChar(
        finalResultStr.split(""),
        finalDisplayLength,
        " "
      ),
      strikeThroughInNum1Original: [...currentStrikeThroughs],
      highlightColumnIndex: -1,
      highlightBorrowAnnotationIndex: -1,
      highlightResultIndex: -1,
      stepMessage: `Final Result: ${
        finalResultStr || "0"
      }. Click Play to see steps or Reset.`,
    });
    return steps;
  }, [num1Prop, num2Prop]);

  useEffect(() => {
    const steps = prepareAnimationStepsInternal();
    setAnimationSteps(steps);
    setIsAnimating(false); // Stop any ongoing animation

    // If error was set by prepareAnimationStepsInternal, `error` state will update.
    // The `error` variable here might be from the previous render cycle.
    // We rely on the `error` state being accurate for the `if` condition.
    // Let's use a local `hasError` based on the new setError calls.
    let hasError = false;
    const n1StrRaw = String(num1Prop).trim();
    const n2StrRaw = String(num2Prop).trim();
    if (
      !n1StrRaw ||
      isNaN(Number(n1StrRaw)) ||
      !n2StrRaw ||
      isNaN(Number(n2StrRaw))
    ) {
      hasError = true;
    } else if (Number(n1StrRaw) < Number(n2StrRaw)) {
      hasError = true;
    }

    if (steps.length > 0 && !hasError) {
      setCurrentStepIndex(steps.length - 1); // Show final step by default
    } else {
      setCurrentStepIndex(-1); // No steps or error, currentVisuals will use placeholder/error
    }
  }, [prepareAnimationStepsInternal, num1Prop, num2Prop]); // num1Prop, num2Prop ensure re-check of hasError

  useEffect(() => {
    if (isAnimating && currentStepIndex < animationSteps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStepIndex((prevIndex) => prevIndex + 1);
      }, getDelay(animationSpeed));
      return () => clearTimeout(timer);
    } else if (
      isAnimating &&
      currentStepIndex === animationSteps.length - 1 &&
      animationSteps.length > 0
    ) {
      setIsAnimating(false); // Animation finished
    }
  }, [isAnimating, currentStepIndex, animationSteps, animationSpeed]);

  const handlePlayAnimation = () => {
    if (animationSteps.length > 0 && !error) {
      setCurrentStepIndex(0); // Start animation from the beginning
      setIsAnimating(true);
    }
  };

  const handleReset = useCallback(() => {
    setIsAnimating(false);
    if (animationSteps.length > 0 && !error) {
      setCurrentStepIndex(animationSteps.length - 1); // Reset to show final step
    } else {
      setCurrentStepIndex(-1);
    }
  }, [animationSteps, error]);

  const getPlaceholderVisuals = useCallback(
    (message) => {
      // ... (Keep the exact same logic)
      const n1s = String(num1Prop).trim();
      const n2s = String(num2Prop).trim();
      const len = Math.max(n1s.length, n2s.length, 1);
      return {
        num1OriginalDisplay: padArrayWithChar(n1s.split(""), len, " "),
        num2Display: padArrayWithChar(n2s.split(""), len, " "),
        borrowAnnotationsRow: Array(len).fill(" "),
        resultDisplay: Array(len).fill(" "),
        strikeThroughInNum1Original: Array(len).fill(false),
        highlightColumnIndex: -1,
        highlightBorrowAnnotationIndex: -1,
        highlightResultIndex: -1,
        stepMessage: message,
      };
    },
    [num1Prop, num2Prop]
  );

  let currentVisuals;
  if (error) {
    currentVisuals = getPlaceholderVisuals(error);
  } else if (animationSteps.length > 0) {
    if (currentStepIndex >= 0 && currentStepIndex < animationSteps.length) {
      currentVisuals = animationSteps[currentStepIndex];
    } else if (currentStepIndex === -1 && animationSteps.length > 0) {
      // This handles the case where steps are ready but index is -1 (e.g., before first default set)
      // Should default to final step if no error
      currentVisuals = animationSteps[animationSteps.length - 1];
    } else {
      // Fallback, should ideally show last step if steps exist
      currentVisuals =
        animationSteps.length > 0
          ? animationSteps[animationSteps.length - 1]
          : getPlaceholderVisuals("Loading or error...");
    }
  } else {
    currentVisuals = getPlaceholderVisuals(
      "Enter numbers to visualize subtraction."
    );
  }

  if (
    !currentVisuals ||
    typeof currentVisuals.num1OriginalDisplay === "undefined"
  ) {
    currentVisuals = getPlaceholderVisuals(error || "Initializing display...");
  }

  const finalDisplayLengthForRender = currentVisuals.num1OriginalDisplay.length;
  // isFinalStepDisplayed is true if the visuals being shown are indeed the last calculated step's visuals
  // and we are not in an active animation state leading up to it.
  const isFinalStepDisplayed =
    !error &&
    animationSteps.length > 0 &&
    currentVisuals === animationSteps[animationSteps.length - 1];
  // Removed animation check, green result should show if it's the last step data

  return (
    <div className="p-4 text-2xl max-w-md mx-auto">
      {error && (
        <p className="text-red-500 text-sm text-center mb-4">{error}</p>
      )}
      <Card className="items-center gap-2 flex flex-col justify-between">
        <CardContent className="pt-6 w-full">
          {/* ... (Keep the exact same JSX structure for display rows from your "bingo cool" version) ... */}
          <div className="text-right space-y-1">
            {/* Borrow Annotations Row (NEW) */}
            <div className="flex justify-end h-8 items-center text-blue-600">
              {" "}
              {/* Style as needed */}
              <span className="w-6 text-center"></span>{" "}
              {/* Spacer for operator */}
              {currentVisuals.borrowAnnotationsRow.map((val, k) => (
                <span
                  key={`borrow-${k}`}
                  className={`w-6 text-center flex items-center justify-center
                    ${
                      k === currentVisuals.highlightBorrowAnnotationIndex
                        ? "font-bold animate-pulse"
                        : ""
                    }
                    ${val.length > 1 ? "text-xl" : "text-2xl"}
                  `}
                >
                  {val}
                </span>
              ))}
            </div>

            {/* Number 1 Row (Original Digits, possibly struck) */}
            <div className="flex justify-end h-8 items-center">
              <span className="w-6 text-center"></span> {/* Spacer */}
              {currentVisuals.num1OriginalDisplay.map((digit, k) => (
                <span
                  key={`n1-orig-${k}`}
                  className={`w-6 text-center border border-transparent rounded
                    ${
                      k === currentVisuals.highlightColumnIndex
                        ? "bg-yellow-200"
                        : ""
                    }
                    ${
                      currentVisuals.strikeThroughInNum1Original[k]
                        ? "line-through text-gray-400"
                        : ""
                    }
                  `}
                >
                  {digit}
                </span>
              ))}
            </div>

            {/* Number 2 Row with Minus */}
            <div className="flex justify-end items-center h-8">
              <span className="w-6 text-center text-gray-500">-</span>
              {currentVisuals.num2Display.map((digit, k) => (
                <span
                  key={`n2-${k}`}
                  className={`w-6 text-center border border-transparent rounded
                    ${
                      k === currentVisuals.highlightColumnIndex
                        ? "bg-yellow-200"
                        : ""
                    }
                  `}
                >
                  {digit}
                </span>
              ))}
            </div>

            {/* Line */}
            <div className="flex justify-end">
              <hr
                className="border-t-2 border-black"
                style={{
                  width: `${(finalDisplayLengthForRender + 1) * 1.5}rem`,
                }}
              />
            </div>

            {/* Result Row */}
            <div className="flex justify-end h-8 items-center">
              <span className="w-6 text-center"></span> {/* Spacer */}
              {currentVisuals.resultDisplay.map((digit, k) => (
                <span
                  key={`res-${k}`}
                  className={`w-6 text-center
                    ${
                      k === currentVisuals.highlightResultIndex
                        ? "text-purple-600 font-bold animate-pulse"
                        : ""
                    }
                    ${
                      isFinalStepDisplayed && digit.trim() !== ""
                        ? "text-green-600 font-bold"
                        : ""
                    }
                  `}
                >
                  {digit}
                </span>
              ))}
            </div>
          </div>
          {showAnimationControls && (
            <div className="mt-4 text-sm text-gray-700 h-12 text-center overflow-y-auto">
              {currentVisuals.stepMessage}
            </div>
          )}
        </CardContent>
        {showAnimationControls && (
          <CardFooter className="flex space-x-4 justify-center pb-4 pt-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handlePlayAnimation}
                  disabled={
                    isAnimating ||
                    !!error ||
                    !animationSteps ||
                    animationSteps.length <= 1 // Disable if only one step (the final result already shown) or no steps
                  }
                  aria-label="Play Animation"
                >
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
                  disabled={
                    isAnimating &&
                    currentStepIndex > 0 &&
                    currentStepIndex < animationSteps.length - 1
                  }
                  aria-label="Reset Animation"
                >
                  <History />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Show Final Result</TooltipContent>{" "}
              {/* MODIFIED TOOLTIP */}
            </Tooltip>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default VisualSubtraction;
