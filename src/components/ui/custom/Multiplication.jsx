import React, { useState, useEffect, useCallback, useMemo } from "react";
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

const padArrayWithChar = (arr, length, char = " ", leading = true) => {
  const newArr = [...arr];
  while (newArr.length < length) {
    if (leading) newArr.unshift(char);
    else newArr.push(char);
  }
  return newArr;
};

// This function is now defined outside or can be a static method if preferred
// It no longer uses `setError` from component state directly.
const prepareStepsAndErrorForMultiplication = (num1Prop, num2Prop) => {
  const n1Str = String(num1Prop).trim();
  const n2Str = String(num2Prop).trim();

  const emptyArrFn = (len) => Array(len).fill(" ");
  const emptyStepVisualsFn = (len, message = "") => ({
    multiplicandDisplay: emptyArrFn(len),
    multiplierDisplay: emptyArrFn(len),
    ppCarriesDisplay: emptyArrFn(len),
    stackedPPCarries: null,
    partialProductDisplays: [],
    sumCarriesDisplay: emptyArrFn(len),
    finalResultDisplay: emptyArrFn(len),
    highlightMultiplicandDigit: -1,
    highlightMultiplierDigit: -1,
    highlightPPCarry: -1,
    highlightCurrentPPResultDigitCol: -1,
    activePPIndex: -1,
    highlightSumColumn: -1,
    highlightSumCarry: -1,
    highlightFinalResultDigit: -1,
    stepMessage: message,
  });

  if (
    !n1Str ||
    isNaN(Number(n1Str)) ||
    !n2Str ||
    isNaN(Number(n2Str)) ||
    Number(n1Str) < 0 ||
    Number(n2Str) < 0
  ) {
    return {
      steps: [],
      error: "Both numbers must be valid, non-empty, non-negative numbers.",
    };
  }
  if (
    n1Str.length > 7 ||
    n2Str.length > 7 ||
    n1Str.length + n2Str.length > 10
  ) {
    return {
      steps: [],
      error: "Numbers are too large. Max 7 digits each, product max 10 digits.",
    };
  }

  const n1Arr = n1Str.split("").map(Number);
  const n2Arr = n2Str.split("").map(Number);
  const len1 = n1Arr.length;
  const len2 = n2Arr.length;
  const finalDisplayLength = Math.max(len1 + len2, len1, len2, 1);

  let steps = [];
  let accumulatedPartialProductDisplays = [];
  let allPPCarriesHistory = [];

  const initialMultiplicand = padArrayWithChar(
    n1Str.split(""),
    finalDisplayLength,
    " "
  );
  const initialMultiplier = padArrayWithChar(
    n2Str.split(""),
    finalDisplayLength,
    " "
  );

  steps.push({
    ...emptyStepVisualsFn(finalDisplayLength, "Numbers ready. Click Play."),
    multiplicandDisplay: [...initialMultiplicand],
    multiplierDisplay: [...initialMultiplier],
  });

  let currentPPCarriesForAnimation = emptyArrFn(finalDisplayLength);

  for (let j = 0; j < len2; j++) {
    const multiplierDigitValue = n2Arr[j];
    const multiplierDigitDisplayIndex = finalDisplayLength - len2 + j;
    let carriesGeneratedForThisPP = emptyArrFn(finalDisplayLength);
    currentPPCarriesForAnimation = emptyArrFn(finalDisplayLength);
    let currentPPCarryValue = 0;
    let currentPPResultDigits = emptyArrFn(finalDisplayLength);
    let tempAccumulatedPPsForStep = [
      ...accumulatedPartialProductDisplays,
      currentPPResultDigits,
    ];
    const numTrailingZeros = len2 - 1 - j;

    steps.push({
      ...steps[steps.length - 1],
      multiplicandDisplay: [...initialMultiplicand],
      multiplierDisplay: [...initialMultiplier],
      ppCarriesDisplay: [...emptyArrFn(finalDisplayLength)],
      partialProductDisplays: tempAccumulatedPPsForStep,
      activePPIndex: accumulatedPartialProductDisplays.length,
      highlightMultiplierDigit: multiplierDigitDisplayIndex,
      stepMessage: `Multiplying by ${multiplierDigitValue} (from left, position ${
        j + 1
      }). ${
        j > 0
          ? "Carries from previous partial product calculation cleared for current view."
          : ""
      }`,
    });

    for (let k = 0; k < len1; k++) {
      const multiplicandDigitValue = n1Arr[len1 - 1 - k];
      const multiplicandOriginalDisplayIndex = finalDisplayLength - 1 - k;
      const product =
        multiplicandDigitValue * multiplierDigitValue + currentPPCarryValue;
      const resultDigit = product % 10;
      const prevPPCarryValueForMsg = currentPPCarryValue;
      currentPPCarryValue = Math.floor(product / 10);
      const carryDisplayCol = multiplicandOriginalDisplayIndex - 1;

      if (currentPPCarryValue > 0 && carryDisplayCol >= 0 && k < len1 - 1) {
        currentPPCarriesForAnimation[carryDisplayCol] =
          currentPPCarryValue.toString();
        carriesGeneratedForThisPP[carryDisplayCol] =
          currentPPCarryValue.toString();
      } else if (
        carryDisplayCol >= 0 &&
        currentPPCarriesForAnimation[carryDisplayCol] !== " " &&
        currentPPCarryValue === 0
      ) {
        currentPPCarriesForAnimation[carryDisplayCol] = " ";
      }
      const resultDigitColForPP = finalDisplayLength - 1 - numTrailingZeros - k;
      if (resultDigitColForPP >= 0)
        currentPPResultDigits[resultDigitColForPP] = resultDigit.toString();

      steps.push({
        ...emptyStepVisualsFn(finalDisplayLength),
        multiplicandDisplay: [...initialMultiplicand],
        multiplierDisplay: [...initialMultiplier],
        ppCarriesDisplay: [...currentPPCarriesForAnimation],
        partialProductDisplays: [...tempAccumulatedPPsForStep],
        highlightMultiplicandDigit: multiplicandOriginalDisplayIndex,
        highlightMultiplierDigit: multiplierDigitDisplayIndex,
        highlightPPCarry:
          currentPPCarryValue > 0 && carryDisplayCol >= 0 && k < len1 - 1
            ? carryDisplayCol
            : -1,
        highlightCurrentPPResultDigitCol: resultDigitColForPP,
        activePPIndex: accumulatedPartialProductDisplays.length,
        stepMessage: `${multiplierDigitValue} × ${multiplicandDigitValue} + (carry ${prevPPCarryValueForMsg}) = ${product}. Write ${resultDigit}, new carry ${currentPPCarryValue}.`,
      });
    }

    if (currentPPCarryValue > 0) {
      const resultDigitColForFinalCarry =
        finalDisplayLength - 1 - numTrailingZeros - len1;
      if (resultDigitColForFinalCarry >= 0) {
        let valToPlace = currentPPCarryValue.toString();
        for (let cIdx = 0; cIdx < valToPlace.length; cIdx++) {
          if (
            resultDigitColForFinalCarry - (valToPlace.length - 1 - cIdx) >=
            0
          ) {
            currentPPResultDigits[
              resultDigitColForFinalCarry - (valToPlace.length - 1 - cIdx)
            ] = valToPlace[cIdx];
          }
        }
      }
      currentPPCarriesForAnimation = emptyArrFn(finalDisplayLength);
      const finalCarryAlignColForPPCarryRow =
        finalDisplayLength - 1 - (len1 - 1) - 1;
      steps.push({
        ...steps[steps.length - 1],
        ppCarriesDisplay: [...currentPPCarriesForAnimation],
        highlightCurrentPPResultDigitCol:
          resultDigitColForFinalCarry >= 0 ? resultDigitColForFinalCarry : -1,
        highlightPPCarry: -1,
        stepMessage: `Remaining carry ${currentPPCarryValue} becomes part of the partial product.`,
      });
    }

    for (let zIdx = 0; zIdx < numTrailingZeros; zIdx++) {
      const zeroCol = finalDisplayLength - 1 - zIdx;
      if (currentPPResultDigits[zeroCol] === " ") {
        currentPPResultDigits[zeroCol] = "0";
      }
    }
    steps.push({
      ...steps[steps.length - 1],
      stepMessage: `Partial product: ${currentPPResultDigits.join("").trim()}.`,
    });
    accumulatedPartialProductDisplays.push([...currentPPResultDigits]);
    allPPCarriesHistory.push([...carriesGeneratedForThisPP]);
  }

  let finalSumDigitsForDisplay = emptyArrFn(finalDisplayLength);
  let currentSumCarriesForAnimationStep = emptyArrFn(finalDisplayLength);
  let accumulatedSumCarriesForFinalView = emptyArrFn(finalDisplayLength);

  if (accumulatedPartialProductDisplays.length > 0) {
    if (accumulatedPartialProductDisplays.length === 1) {
      finalSumDigitsForDisplay = [...accumulatedPartialProductDisplays[0]];
    } else {
      steps.push({
        ...steps[steps.length - 1],
        ppCarriesDisplay: [...emptyArrFn(finalDisplayLength)],
        sumCarriesDisplay: [...emptyArrFn(finalDisplayLength)],
        partialProductDisplays: [...accumulatedPartialProductDisplays],
        highlightMultiplierDigit: -1,
        activePPIndex: -1,
        stepMessage: `Adding partial products.`,
      });
      let currentSumCarryValue = 0;
      for (let col = 0; col < finalDisplayLength; col++) {
        const displayCol = finalDisplayLength - 1 - col;
        let columnSum = currentSumCarryValue;
        accumulatedPartialProductDisplays.forEach((ppDigits) => {
          columnSum += parseInt(
            ppDigits[displayCol] === " " ? "0" : ppDigits[displayCol]
          );
        });
        const resultDigit = columnSum % 10;
        currentSumCarryValue = Math.floor(columnSum / 10);
        finalSumDigitsForDisplay[displayCol] = resultDigit.toString();
        currentSumCarriesForAnimationStep = emptyArrFn(finalDisplayLength);
        const sumCarryDisplayCol = displayCol - 1;
        if (
          currentSumCarryValue > 0 &&
          sumCarryDisplayCol >= 0 &&
          col < finalDisplayLength - 1
        ) {
          currentSumCarriesForAnimationStep[sumCarryDisplayCol] =
            currentSumCarryValue.toString();
          accumulatedSumCarriesForFinalView[sumCarryDisplayCol] =
            currentSumCarryValue.toString();
        } else if (
          sumCarryDisplayCol >= 0 &&
          accumulatedSumCarriesForFinalView[sumCarryDisplayCol] !== " " &&
          currentSumCarryValue === 0
        ) {
          accumulatedSumCarriesForFinalView[sumCarryDisplayCol] = " ";
        }
        steps.push({
          ...emptyStepVisualsFn(finalDisplayLength),
          multiplicandDisplay: [...initialMultiplicand],
          multiplierDisplay: [...initialMultiplier],
          ppCarriesDisplay: [...emptyArrFn(finalDisplayLength)],
          sumCarriesDisplay: [...currentSumCarriesForAnimationStep],
          partialProductDisplays: [...accumulatedPartialProductDisplays],
          finalResultDisplay: [...finalSumDigitsForDisplay],
          highlightSumColumn: displayCol,
          highlightSumCarry:
            currentSumCarryValue > 0 &&
            sumCarryDisplayCol >= 0 &&
            col < finalDisplayLength - 1
              ? sumCarryDisplayCol
              : -1,
          highlightFinalResultDigit: displayCol,
          stepMessage: `Summing column ${
            col + 1
          }: total ${columnSum}. Write ${resultDigit}, carry ${currentSumCarryValue}.`,
        });
      }
      if (currentSumCarryValue > 0) {
        let valToPlace = currentSumCarryValue.toString();
        let tempFinalSum = [...finalSumDigitsForDisplay];
        let currentFinalResultStr =
          valToPlace + tempFinalSum.join("").trimStart();
        finalSumDigitsForDisplay = padArrayWithChar(
          currentFinalResultStr.split(""),
          finalDisplayLength,
          " "
        );
        currentSumCarriesForAnimationStep = emptyArrFn(finalDisplayLength);
        steps.push({
          ...steps[steps.length - 1],
          sumCarriesDisplay: [...currentSumCarriesForAnimationStep],
          finalResultDisplay: [...finalSumDigitsForDisplay],
          stepMessage: `Remaining sum carry ${currentSumCarryValue} becomes part of the final result.`,
        });
      }
    }
  } else if (Number(n1Str) === 0 || Number(n2Str) === 0) {
    finalSumDigitsForDisplay = padArrayWithChar(["0"], finalDisplayLength, " ");
  }
  const finalResultString = String(Number(n1Str) * Number(n2Str));
  const finalResultPaddedForSafety = padArrayWithChar(
    finalResultString.split(""),
    finalDisplayLength,
    " "
  );
  finalSumDigitsForDisplay = [...finalResultPaddedForSafety];

  let finalStepPPCarriesForAnimation = emptyArrFn(finalDisplayLength);
  if (allPPCarriesHistory.length === 1) {
    finalStepPPCarriesForAnimation = [...allPPCarriesHistory[0]];
  }
  steps.push({
    multiplicandDisplay: [...initialMultiplicand],
    multiplierDisplay: [...initialMultiplier],
    ppCarriesDisplay: [...finalStepPPCarriesForAnimation],
    stackedPPCarries: [...allPPCarriesHistory].reverse(),
    partialProductDisplays: [...accumulatedPartialProductDisplays],
    sumCarriesDisplay: [...accumulatedSumCarriesForFinalView],
    finalResultDisplay: [...finalSumDigitsForDisplay],
    highlightMultiplicandDigit: -1,
    highlightMultiplierDigit: -1,
    highlightPPCarry: -1,
    highlightCurrentPPResultDigitCol: -1,
    activePPIndex: -1,
    highlightSumColumn: -1,
    highlightSumCarry: -1,
    highlightFinalResultDigit: -1,
    stepMessage: `Final Result: ${finalResultString}. Click Play to see steps or Reset.`,
  });
  return { steps: steps, error: "" };
};

const VisualMultiplication = ({
  num1: num1Prop = "",
  num2: num2Prop = "",
  showAnimationControls = false,
}) => {
  const { steps: animationSteps, error: calculationError } = useMemo(() => {
    const n1 = String(num1Prop).trim();
    const n2 = String(num2Prop).trim();
    // Avoid running for initially empty props if you want to show a generic placeholder first
    if (!n1 && !n2 && num1Prop === "" && num2Prop === "") {
      return { steps: [], error: "" };
    }
    return prepareStepsAndErrorForMultiplication(n1, n2);
  }, [num1Prop, num2Prop]);

  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState("medium");

  // Effect to set initial state or react to new steps/error
  useEffect(() => {
    setIsAnimating(false);
    if (animationSteps.length > 0 && !calculationError) {
      setCurrentStepIndex(animationSteps.length - 1);
    } else {
      setCurrentStepIndex(-1);
    }
  }, [animationSteps, calculationError]);

  // Effect for animation timer
  useEffect(() => {
    if (isAnimating && currentStepIndex < animationSteps.length - 1) {
      const timer = setTimeout(
        () => setCurrentStepIndex((prev) => prev + 1),
        getDelay(animationSpeed)
      );
      return () => clearTimeout(timer);
    } else if (isAnimating && currentStepIndex === animationSteps.length - 1) {
      setIsAnimating(false);
    }
  }, [isAnimating, currentStepIndex, animationSteps, animationSpeed]);

  const handlePlayAnimation = () => {
    if (animationSteps.length > 0 && !calculationError) {
      setCurrentStepIndex(0);
      setIsAnimating(true);
    }
  };

  const handleReset = useCallback(() => {
    setIsAnimating(false);
    if (animationSteps.length > 0 && !calculationError) {
      setCurrentStepIndex(animationSteps.length - 1);
    } else {
      setCurrentStepIndex(-1);
    }
  }, [animationSteps, calculationError]);

  const getPlaceholderVisuals = useCallback(
    (message) => {
      const n1s = String(num1Prop).trim();
      const n2s = String(num2Prop).trim();
      // Use the emptyStepVisuals function defined outside or within prepareSteps if preferred
      // For simplicity, re-defining a minimal version or ensure emptyStepVisuals is accessible
      const len = Math.max(
        (n1s.length || 0) + (n2s.length || 0),
        n1s.length,
        n2s.length,
        1
      );
      const emptyArrFn = (l) => Array(l).fill(" ");
      return {
        multiplicandDisplay: emptyArrFn(len),
        multiplierDisplay: emptyArrFn(len),
        ppCarriesDisplay: emptyArrFn(len),
        stackedPPCarries: null,
        partialProductDisplays: [],
        sumCarriesDisplay: emptyArrFn(len),
        finalResultDisplay: emptyArrFn(len),
        highlightMultiplicandDigit: -1,
        highlightMultiplierDigit: -1,
        highlightPPCarry: -1,
        highlightCurrentPPResultDigitCol: -1,
        activePPIndex: -1,
        highlightSumColumn: -1,
        highlightSumCarry: -1,
        highlightFinalResultDigit: -1,
        stepMessage: message,
      };
    },
    [num1Prop, num2Prop]
  );

  let currentVisuals;
  if (calculationError) {
    currentVisuals = getPlaceholderVisuals(calculationError);
  } else if (
    animationSteps.length > 0 &&
    currentStepIndex >= 0 &&
    currentStepIndex < animationSteps.length
  ) {
    currentVisuals = animationSteps[currentStepIndex];
  } else if (
    animationSteps.length > 0 &&
    currentStepIndex === -1 &&
    !calculationError
  ) {
    currentVisuals = animationSteps[animationSteps.length - 1];
  } else {
    // Handles case where props are empty and useMemo returned empty steps/error
    currentVisuals = getPlaceholderVisuals(
      num1Prop.trim() === "" && num2Prop.trim() === ""
        ? "Enter numbers to visualize multiplication."
        : "Preparing visualization..."
    );
  }

  if (
    !currentVisuals ||
    typeof currentVisuals.multiplicandDisplay === "undefined"
  ) {
    const tempLen = Math.max(
      (String(num1Prop).length || 0) + (String(num2Prop).length || 0),
      1
    );
    const emptyArrFnOuter = (l) => Array(l).fill(" ");
    currentVisuals = {
      // Reconstruct using a simple version of emptyStepVisuals
      multiplicandDisplay: emptyArrFnOuter(tempLen),
      multiplierDisplay: emptyArrFnOuter(tempLen),
      ppCarriesDisplay: emptyArrFnOuter(tempLen),
      stackedPPCarries: null,
      partialProductDisplays: [],
      sumCarriesDisplay: emptyArrFnOuter(tempLen),
      finalResultDisplay: emptyArrFnOuter(tempLen),
      highlightMultiplicandDigit: -1,
      highlightMultiplierDigit: -1,
      highlightPPCarry: -1,
      highlightCurrentPPResultDigitCol: -1,
      activePPIndex: -1,
      highlightSumColumn: -1,
      highlightSumCarry: -1,
      highlightFinalResultDigit: -1,
      stepMessage: calculationError || "Initializing display...",
    };
  }

  const finalDisplayLengthForRender = currentVisuals.multiplicandDisplay.length;
  const isFinalStepDisplayed =
    !calculationError &&
    animationSteps.length > 0 &&
    currentVisuals === animationSteps[animationSteps.length - 1];

  const digitCellWidth =
    finalDisplayLengthForRender > 8
      ? "w-4 text-sm"
      : "w-5 text-base md:text-lg";
  const hrWidthBase =
    finalDisplayLengthForRender > 8
      ? finalDisplayLengthForRender * 1
      : finalDisplayLengthForRender * 1.25;
  const plusSignPresent = currentVisuals.partialProductDisplays.length > 1;
  const hrWidthValue =
    finalDisplayLengthForRender * (finalDisplayLengthForRender > 8 ? 1 : 1.25);
  const hrWidth = `${hrWidthValue}rem`;

  const getStackedPPCarryColor = (rowIndex, totalRows) => {
    if (totalRows === 1) return "text-orange-500";
    if (rowIndex === totalRows - 1) return "text-green-500";
    return "text-orange-500";
  };

  return (
    <div
      className={`p-2 md:p-4 ${
        finalDisplayLengthForRender > 8
          ? "text-sm"
          : "text-lg md:text-xl lg:text-2xl"
      } max-w-3xl mx-auto`}
    >
      {calculationError && (
        <p className="text-red-500 text-xs md:text-sm text-center mb-2 md:mb-4">
          {calculationError}
        </p>
      )}
      <Card className="items-center gap-2 flex flex-col justify-between">
        <CardContent className="pt-4 md:pt-6 w-full overflow-x-auto">
          <div className="text-right space-y-1 whitespace-nowrap min-w-max">
            {/* --- STACKED PP CARRIES (Final View Only) --- */}
            {isFinalStepDisplayed &&
              currentVisuals.stackedPPCarries &&
              currentVisuals.stackedPPCarries.length > 0 &&
              currentVisuals.stackedPPCarries.map((carryRow, rowIndex) => (
                <div
                  key={`stacked-ppcarry-row-${rowIndex}`}
                  className={`flex justify-end h-6 md:h-7 items-center ${getStackedPPCarryColor(
                    rowIndex,
                    currentVisuals.stackedPPCarries.length
                  )} ${
                    finalDisplayLengthForRender > 8
                      ? "text-xs"
                      : "text-sm md:text-base"
                  }`}
                >
                  {plusSignPresent && (
                    <span className={`${digitCellWidth} text-center`}></span>
                  )}
                  {carryRow.map((val, k) => (
                    <span
                      key={`s-ppc-${rowIndex}-${k}`}
                      className={`${digitCellWidth} text-center ${
                        val.trim() && "border border-neutral-500"
                      } rounded-full`}
                    >
                      {val}
                    </span>
                  ))}
                </div>
              ))}
            {/* --- ANIMATED PP CARRIES (Not shown if final view with stacked carries is active) --- */}
            {!(
              isFinalStepDisplayed &&
              currentVisuals.stackedPPCarries &&
              currentVisuals.stackedPPCarries.length > 0
            ) && (
              <div
                className={`flex justify-end h-6 md:h-7 items-center text-orange-500 ${
                  finalDisplayLengthForRender > 8
                    ? "text-xs"
                    : "text-sm md:text-base"
                }`}
              >
                {plusSignPresent && (
                  <span className={`${digitCellWidth} text-center`}></span>
                )}
                {currentVisuals.ppCarriesDisplay.map((val, k) => (
                  <span
                    key={`ppcarry-${k}`}
                    className={`${digitCellWidth} text-center ${
                      k === currentVisuals.highlightPPCarry
                        ? "font-bold animate-pulse text-orange-700"
                        : ""
                    }`}
                  >
                    {val}
                  </span>
                ))}
              </div>
            )}

            {/* Multiplicand Row - BLUE */}
            <div className="flex justify-end h-6 md:h-7 items-center text-sky-600">
              {plusSignPresent && (
                <span className={`${digitCellWidth} text-center`}></span>
              )}
              {currentVisuals.multiplicandDisplay.map((digit, k) => (
                <span
                  key={`n1-${k}`}
                  className={`${digitCellWidth} text-center ${
                    k === currentVisuals.highlightMultiplicandDigit
                      ? "bg-yellow-200 rounded"
                      : ""
                  }`}
                >
                  {digit}
                </span>
              ))}
            </div>

            {/* Multiplier Row with 'x' - BLUE */}
            <div className="flex justify-end items-center h-6 md:h-7 text-sky-600">
              {plusSignPresent && (
                <span className={`${digitCellWidth} text-center`}></span>
              )}
              <span className={`${digitCellWidth} text-center text-gray-500`}>
                ×
              </span>
              {currentVisuals.multiplierDisplay.slice(1).map((digit, k) => (
                <span
                  key={`n2-${k}`}
                  className={`${digitCellWidth} text-center ${
                    finalDisplayLengthForRender -
                      currentVisuals.multiplierDisplay.slice(1).length +
                      k ===
                    currentVisuals.highlightMultiplierDigit
                      ? "bg-yellow-200 rounded"
                      : ""
                  }`}
                >
                  {digit}
                </span>
              ))}
            </div>

            {/* Line 1 (Under Multiplier) */}
            <div className="flex justify-end">
              {plusSignPresent && (
                <span className={`${digitCellWidth} text-center`}></span>
              )}
              <hr
                className="border-t-2 border-black"
                style={{ width: hrWidth }}
              />
            </div>

            {/* --- SUMMATION CARRIES (Positioned above Partial Products) --- */}
            {plusSignPresent &&
              (isAnimating || isFinalStepDisplayed) &&
              currentVisuals.sumCarriesDisplay.some((c) => c !== " ") && (
                <div
                  className={`flex justify-end h-6 md:h-7 items-center text-purple-500 underline underline-offset-2 ${
                    finalDisplayLengthForRender > 8
                      ? "text-xs"
                      : "text-sm md:text-base"
                  }`}
                >
                  {plusSignPresent && (
                    <span className={`${digitCellWidth} text-center`}></span>
                  )}
                  {currentVisuals.sumCarriesDisplay.map((val, k) => (
                    <span
                      key={`sumcarry-top-${k}`}
                      className={`${digitCellWidth} text-center ${
                        k === currentVisuals.highlightSumCarry && isAnimating
                          ? "font-bold animate-pulse text-purple-700"
                          : ""
                      }`}
                    >
                      {val}
                    </span>
                  ))}
                </div>
              )}

            {/* Partial Products Rows - BLUE */}
            {currentVisuals.partialProductDisplays.map((ppDigits, ppIdx) => (
              <div
                key={`pp-${ppIdx}`}
                className="flex justify-end h-6 md:h-7 items-center text-sky-600"
              >
                {plusSignPresent &&
                  ppIdx ===
                    currentVisuals.partialProductDisplays.length - 1 && (
                    <span
                      className={`${digitCellWidth} text-center text-gray-500`}
                    >
                      +
                    </span>
                  )}
                {plusSignPresent &&
                  ppIdx !==
                    currentVisuals.partialProductDisplays.length - 1 && (
                    <span className={`${digitCellWidth} text-center`}></span>
                  )}
                {ppDigits.map((digit, k) => (
                  <span
                    key={`pp-${ppIdx}-${k}`}
                    className={`${digitCellWidth} text-center ${
                      ppIdx === currentVisuals.activePPIndex &&
                      k === currentVisuals.highlightCurrentPPResultDigitCol
                        ? "text-blue-700 font-bold animate-pulse"
                        : ""
                    } ${
                      currentVisuals.highlightSumColumn === k && plusSignPresent
                        ? "bg-yellow-100"
                        : ""
                    }`}
                  >
                    {digit}
                  </span>
                ))}
              </div>
            ))}

            {/* Line 2 (Under Partial Products, before Final Result - only if PPs exist) */}
            {currentVisuals.partialProductDisplays.length > 0 && (
              <div className="flex justify-end">
                {plusSignPresent && (
                  <span className={`${digitCellWidth} text-center`}></span>
                )}
                <hr
                  className="border-t-2 border-black"
                  style={{ width: hrWidth }}
                />
              </div>
            )}

            {/* Final Result Row - AMBER/STRONG ORANGE */}
            {(currentVisuals.partialProductDisplays.length > 0 ||
              Number(num1Prop) === 0 ||
              Number(num2Prop) === 0) && (
              <div className="flex justify-end h-6 md:h-7 items-center text-amber-600">
                {plusSignPresent && (
                  <span className={`${digitCellWidth} text-center`}></span>
                )}
                {currentVisuals.finalResultDisplay.map((digit, k) => (
                  <span
                    key={`res-${k}`}
                    className={`${digitCellWidth} text-center ${
                      k === currentVisuals.highlightFinalResultDigit
                        ? "text-yellow-700 font-bold animate-pulse"
                        : ""
                    } ${
                      isFinalStepDisplayed && digit.trim() !== ""
                        ? "text-amber-700 font-bold"
                        : ""
                    }`}
                  >
                    {digit}
                  </span>
                ))}
              </div>
            )}
          </div>
          {showAnimationControls && (
            <div className="mt-2 md:mt-4 text-xs md:text-sm text-gray-700 h-10 md:h-12 text-center overflow-y-auto px-1">
              {currentVisuals.stepMessage}
            </div>
          )}
        </CardContent>
        {showAnimationControls && (
          <CardFooter className="flex space-x-2 md:space-x-4 justify-center pb-2 md:pb-4 pt-1 md:pt-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  onClick={handlePlayAnimation}
                  disabled={
                    isAnimating ||
                    !!calculationError ||
                    !animationSteps ||
                    animationSteps.length <= 1
                  }
                  aria-label="Play Animation"
                >
                  <Play className="h-4 w-4 md:h-5 md:w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Play Animation</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  onClick={handleReset}
                  variant="outline"
                  disabled={
                    isAnimating &&
                    currentStepIndex > 0 &&
                    currentStepIndex < animationSteps.length - 1
                  }
                  aria-label="Reset Animation"
                >
                  <History className="h-4 w-4 md:h-5 md:w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Show Final Result</TooltipContent>
            </Tooltip>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default VisualMultiplication;
