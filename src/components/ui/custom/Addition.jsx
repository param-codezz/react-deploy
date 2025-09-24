import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { History, Play } from "lucide-react";
import { Card, CardContent, CardFooter } from "../card";
import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip";

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

const VisualAddition = ({
  num1: num1Prop = "",
  num2: num2Prop = "",
  num3: num3Prop = "",
  showAnimationControls = false,
}) => {
  const [animationSteps, setAnimationSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1); 
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState("medium");
  const [error, setError] = useState("");

  const prepareAnimationStepsInternal = useCallback(() => {
    const n1Str = String(num1Prop).trim();
    const n2Str = String(num2Prop).trim();
    const n3Str = String(num3Prop).trim(); 

    if (!n1Str || isNaN(Number(n1Str)) || !n2Str || isNaN(Number(n2Str))) {
      setError("Number 1 and Number 2 must be valid, non-empty numbers.");
      return [];
    }

    const useNum3 = n3Str !== "" && !isNaN(Number(n3Str));

    if (useNum3 && isNaN(Number(n3Str))) {
      setError("Number 3, if provided, must be a valid number.");
      return [];
    }
    setError("");

    const logicalMaxLength = Math.max(
      n1Str.length,
      n2Str.length,
      useNum3 ? n3Str.length : 0
    );
    const finalDisplayLength = logicalMaxLength + 1;

    const op1_padded_zeros = n1Str.padStart(logicalMaxLength, "0");
    const op2_padded_zeros = n2Str.padStart(logicalMaxLength, "0");
    const op3_padded_zeros = useNum3
      ? n3Str.padStart(logicalMaxLength, "0")
      : "".padStart(logicalMaxLength, " ");

    let steps = [];
    let carry = 0;
    let currentResultArray = Array(finalDisplayLength).fill(" ");
    let currentCarriesArray = Array(finalDisplayLength).fill(" ");

    steps.push({
      num1Display: padArrayWithChar(
        op1_padded_zeros.split(""),
        finalDisplayLength
      ),
      num2Display: padArrayWithChar(
        op2_padded_zeros.split(""),
        finalDisplayLength
      ),
      num3Display: padArrayWithChar(
        op3_padded_zeros.split(""),
        finalDisplayLength
      ),
      carriesDisplay: padArrayWithChar([], finalDisplayLength),
      resultDisplay: padArrayWithChar([], finalDisplayLength),
      highlightColumnIndex: -1,
      highlightCarryIndex: -1,
      highlightResultIndex: -1,
      isNum3ActiveInStep: useNum3,
      stepMessage: "Numbers ready for addition.",
    });

    for (let i = 0; i < logicalMaxLength; i++) {
      const logicalCol = logicalMaxLength - 1 - i;
      const displayCol = finalDisplayLength - 1 - i;

      const digit1 = parseInt(op1_padded_zeros[logicalCol] || "0");
      const digit2 = parseInt(op2_padded_zeros[logicalCol] || "0");
      const digit3 = useNum3
        ? parseInt(op3_padded_zeros[logicalCol] || "0")
        : 0;

      const sum = digit1 + digit2 + digit3 + carry;
      const currentDigitSum = sum % 10;
      const newCarry = Math.floor(sum / 10);

      let sumDesc = `${digit1} + ${digit2}`;
      if (useNum3) sumDesc += ` + ${digit3}`;
      if (carry > 0) sumDesc += ` + ${carry} (carry)`;
      sumDesc += ` = ${sum}`;

      const carryUsedInSumIndex =
        carry > 0 && displayCol > 0 ? displayCol - 1 : -1;

      steps.push({
        num1Display: padArrayWithChar(
          op1_padded_zeros.split(""),
          finalDisplayLength
        ),
        num2Display: padArrayWithChar(
          op2_padded_zeros.split(""),
          finalDisplayLength
        ),
        num3Display: padArrayWithChar(
          op3_padded_zeros.split(""),
          finalDisplayLength
        ),
        carriesDisplay: padArrayWithChar(
          [...currentCarriesArray],
          finalDisplayLength
        ),
        resultDisplay: padArrayWithChar(
          [...currentResultArray],
          finalDisplayLength
        ),
        highlightColumnIndex: displayCol,
        highlightCarryIndex: carryUsedInSumIndex,
        highlightResultIndex: -1,
        isNum3ActiveInStep: useNum3,
        stepMessage: `Column ${i + 1} (from right): ${sumDesc}`,
      });

      currentResultArray[displayCol] = currentDigitSum.toString();
      if (displayCol > 0) {
        currentCarriesArray[displayCol - 1] =
          newCarry > 0 ? newCarry.toString() : " ";
      }
      const placedCarryIndex =
        newCarry > 0 && displayCol > 0 ? displayCol - 1 : -1;

      steps.push({
        num1Display: padArrayWithChar(
          op1_padded_zeros.split(""),
          finalDisplayLength
        ),
        num2Display: padArrayWithChar(
          op2_padded_zeros.split(""),
          finalDisplayLength
        ),
        num3Display: padArrayWithChar(
          op3_padded_zeros.split(""),
          finalDisplayLength
        ),
        carriesDisplay: padArrayWithChar(
          [...currentCarriesArray],
          finalDisplayLength
        ),
        resultDisplay: padArrayWithChar(
          [...currentResultArray],
          finalDisplayLength
        ),
        highlightColumnIndex: -1,
        highlightCarryIndex: placedCarryIndex,
        highlightResultIndex: displayCol,
        isNum3ActiveInStep: useNum3,
        stepMessage: `Result digit: ${currentDigitSum}. ${
          newCarry > 0 ? `Carry ${newCarry} to next column.` : "No carry."
        }`,
      });
      carry = newCarry;
    }

    if (carry > 0) {
      currentResultArray[0] = carry.toString();
    }

    steps.push({
      num1Display: padArrayWithChar(
        op1_padded_zeros.split(""),
        finalDisplayLength
      ),
      num2Display: padArrayWithChar(
        op2_padded_zeros.split(""),
        finalDisplayLength
      ),
      num3Display: padArrayWithChar(
        op3_padded_zeros.split(""),
        finalDisplayLength
      ),
      carriesDisplay: padArrayWithChar(currentCarriesArray, finalDisplayLength),
      resultDisplay: padArrayWithChar(currentResultArray, finalDisplayLength),
      highlightColumnIndex: -1,
      highlightCarryIndex: -1,
      highlightResultIndex: -1,
      isNum3ActiveInStep: useNum3,
      stepMessage: `Final Result: ${currentResultArray.join("").trim() || "0"}`,
    });

    return steps;
  }, [num1Prop, num2Prop, num3Prop]);

  useEffect(() => {
    const steps = prepareAnimationStepsInternal();
    setAnimationSteps(steps);
    setCurrentStepIndex(-1);
    setIsAnimating(false);
  }, [prepareAnimationStepsInternal]);

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
      setIsAnimating(false);
    }
  }, [isAnimating, currentStepIndex, animationSteps, animationSpeed]);

  const handlePlayAnimation = () => {
    if (animationSteps.length > 0 && !error) {
      setCurrentStepIndex(0);
      setIsAnimating(true);
    }
  };

  const handleReset = useCallback(() => {
    setCurrentStepIndex(-1);
    setIsAnimating(false);
  }, []);

  const getPlaceholderVisuals = (message) => {
    const n1 = String(num1Prop).trim();
    const n2 = String(num2Prop).trim();
    const n3 = String(num3Prop).trim();
    const use3 = n3 !== "" && !isNaN(Number(n3));
    const LML = Math.max(n1.length, n2.length, use3 ? n3.length : 0) || 1;
    const FDL = LML + 1;
    return {
      num1Display: padArrayWithChar(n1.split(""), FDL),
      num2Display: padArrayWithChar(n2.split(""), FDL),
      num3Display: padArrayWithChar(use3 ? n3.split("") : [], FDL),
      carriesDisplay: Array(FDL).fill(" "),
      resultDisplay: Array(FDL).fill(" "),
      highlightColumnIndex: -1,
      highlightCarryIndex: -1,
      highlightResultIndex: -1,
      isNum3ActiveInStep: use3,
      stepMessage: message,
    };
  };

  let currentVisuals;
  if (error) {
    currentVisuals = getPlaceholderVisuals(error);
  } else if (animationSteps.length > 0) {
    if (
      currentStepIndex === -1 ||
      (!isAnimating && currentStepIndex === animationSteps.length - 1)
    ) {
      currentVisuals = animationSteps[animationSteps.length - 1];
    } else if (
      isAnimating &&
      currentStepIndex >= 0 &&
      currentStepIndex < animationSteps.length
    ) {
      currentVisuals = animationSteps[currentStepIndex];
    } else {
      currentVisuals = animationSteps[animationSteps.length - 1];
    }
  } else {
    currentVisuals = getPlaceholderVisuals(
      "Ready. Click Play Animation to start."
    );
  }

  const finalDisplayLengthForRender = currentVisuals.num1Display.length;
  const isFinalStepDisplayed =
    !error &&
    animationSteps.length > 0 &&
    currentVisuals === animationSteps[animationSteps.length - 1];

  return (
    <div className="p-4 text-2xl max-w-md mx-auto">
      <div className="mb-6 space-y-4">
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      </div>

      <Card className="items-center gap-2 flex flex-col justify-between">
        <CardContent>
          <div className="text-right space-y-1">
            {/* Carries Row */}
            <div className="flex justify-end text-red-500 h-8 items-center">
              {currentVisuals.isNum3ActiveInStep && (
                <span className="w-6 text-center"></span>
              )}
              <span className="w-6 text-center"></span>
              {currentVisuals.carriesDisplay.map((carryVal, k) => (
                <span
                  key={`carry-${k}`}
                  className={`w-6 text-center ${
                    k === currentVisuals.highlightCarryIndex
                      ? "animate-pulse font-bold text-lg"
                      : ""
                  }`}
                >
                  {carryVal}
                </span>
              ))}
            </div>
            {/* Number 1 Row */}
            <div className="flex justify-end h-8 items-center">
              {currentVisuals.isNum3ActiveInStep && (
                <span className="w-6 text-center"></span>
              )}
              <span className="w-6 text-center"></span>
              {currentVisuals.num1Display.map((digit, k) => (
                <span
                  key={`n1-${k}`}
                  className={`w-6 text-center border border-transparent ${
                    k === currentVisuals.highlightColumnIndex
                      ? "bg-yellow-200 rounded"
                      : ""
                  }`}
                >
                  {digit}
                </span>
              ))}
            </div>
            {/* Number 2 Row with Plus */}
            <div className="flex justify-end items-center h-8">
              {currentVisuals.isNum3ActiveInStep && (
                <span className="w-6 text-center"></span>
              )}
              <span className="w-6 text-center text-gray-500">+</span>
              {currentVisuals.num2Display.map((digit, k) => (
                <span
                  key={`n2-${k}`}
                  className={`w-6 text-center border border-transparent ${
                    k === currentVisuals.highlightColumnIndex
                      ? "bg-yellow-200 rounded"
                      : ""
                  }`}
                >
                  {digit}
                </span>
              ))}
            </div>
            {/* Number 3 Row with Plus (Conditional) */}
            {currentVisuals.isNum3ActiveInStep && (
              <div className="flex justify-end items-center h-8">
                <span className="w-6 text-center text-gray-500">+</span>
                {currentVisuals.num3Display.map((digit, k) => (
                  <span
                    key={`n3-${k}`}
                    className={`w-6 text-center border border-transparent ${
                      k === currentVisuals.highlightColumnIndex
                        ? "bg-yellow-200 rounded"
                        : ""
                    }`}
                  >
                    {digit}
                  </span>
                ))}
              </div>
            )}
            {/* Line */}
            <div className="flex justify-end">
              <hr
                className="border-t-2 border-black ml-auto"
                style={{
                  width: `${
                    (finalDisplayLengthForRender +
                      1 +
                      (currentVisuals.isNum3ActiveInStep ? 1 : 0)) *
                    1.5
                  }rem`,
                }}
              />
            </div>
            {/* Result Row */}
            <div className="flex justify-end h-8 items-center">
              {currentVisuals.isNum3ActiveInStep && (
                <span className="w-6 text-center"></span>
              )}
              <span className="w-6 text-center"></span>
              {currentVisuals.resultDisplay.map((digit, k) => (
                <span
                  key={`res-${k}`}
                  className={`w-6 text-center
                    ${
                      k === currentVisuals.highlightResultIndex
                        ? "text-blue-600 font-bold animate-pulse text-lg"
                        : ""
                    }
                    ${
                      isFinalStepDisplayed && digit !== " "
                        ? "text-green-600 font-bold"
                        : ""
                    } `}
                >
                  {digit}
                </span>
              ))}
            </div>
          </div>
          {showAnimationControls && (
            <div className="mt-4 text-sm text-gray-700 h-10 text-center">
              {currentVisuals.stepMessage}
            </div>
          )}
        </CardContent>
        {showAnimationControls && (
          <CardFooter className="flex space-x-4 justify-center mb-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handlePlayAnimation}
                  disabled={
                    isAnimating ||
                    !!error ||
                    animationSteps.length === 0 ||
                    currentStepIndex === animationSteps.length - 1
                  }
                >
                  <Play />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Play Animation</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  disabled={
                    isAnimating && currentStepIndex < animationSteps.length - 1
                  }
                >
                  <History />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reset</TooltipContent>
            </Tooltip>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default VisualAddition;
