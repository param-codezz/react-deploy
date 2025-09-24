// import { useState, useEffect, useCallback, useMemo } from "react";
// import { Button } from "@/components/ui/button";
// import { History, Play, ArrowDown, ArrowRight } from "lucide-react";
// import { Card, CardContent, CardFooter } from "@/components/ui/card";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipTrigger,
//   TooltipProvider,
// } from "@/components/ui/tooltip";

// const getDelay = (speed) => {
//   switch (speed) {
//     case "fast":
//       return 750;
//     case "medium":
//       return 1500;
//     case "slow":
//       return 2500;
//     default:
//       return 1500;
//   }
// };

// const padArrayWithChar = (arr, length, char = " ", leading = true) => {
//   const newArr = [...arr];
//   while (newArr.length < length) {
//     if (leading) newArr.unshift(char);
//     else newArr.push(char);
//   }
//   return newArr;
// };

// const prepareStepsAndErrorForDivision = (dividendProp, divisorProp) => {
//   const dendStrRaw = String(dividendProp).trim();
//   const sorStrRaw = String(divisorProp).trim();

//   const emptyArrFn = (len) => Array(len).fill(" ");

//   const initialStepVisualsFn = (dendLen, sorLen, quoLen, message = "") => ({
//     dividendOriginalPadded: padArrayWithChar(
//       dendStrRaw.split(""),
//       dendLen,
//       " ",
//       false
//     ),
//     divisorPadded: padArrayWithChar(sorStrRaw.split(""), sorLen, " ", false),
//     quotientPadded: emptyArrFn(quoLen),
//     workingDividendState: dendStrRaw
//       .split("")
//       .map((char) => ({ char, state: "normal" })),
//     calculationLines: [],
//     finalRemainderValue: null,
//     highlightQuotientIndex: -1,
//     activeWorkingDividendIndex: -1,
//     currentSegmentText: [],
//     currentProductText: [],
//     currentRemainderText: [],
//     stepMessage: message,
//     showBringDownArrow: false,
//     showMultiplyArrow: false,
//     showSubtractArrow: false,
//   });

//   if (
//     !dendStrRaw ||
//     isNaN(Number(dendStrRaw)) ||
//     !sorStrRaw ||
//     isNaN(Number(sorStrRaw)) ||
//     Number(dendStrRaw) < 0 ||
//     Number(sorStrRaw) < 0
//   ) {
//     return {
//       steps: [],
//       error:
//         "Dividend and Divisor must be valid, non-empty, non-negative numbers.",
//     };
//   }

//   // Normalize inputs like "07" to "7" for calculation, but keep original for display if needed
//   const dendNum = Number(dendStrRaw);
//   const sorNum = Number(sorStrRaw);
//   const dendArr = String(dendNum).split(""); // Use normalized dividend for calculation array
//   const dendDisplayArr = dendStrRaw.split(""); // Original for display state

//   if (sorNum === 0) {
//     return { steps: [], error: "Divisor cannot be zero." };
//   }

//   // Use original lengths for display limits, but normalized for quotient estimation.
//   if (dendStrRaw.length > 10 || sorStrRaw.length > 7) {
//     return {
//       steps: [],
//       error:
//         "Numbers too large. Max Dividend: 10 digits, Max Divisor: 7 digits.",
//     };
//   }

//   const dendLen = dendArr.length; // Length of normalized dividend
//   const estimatedQuotientLen =
//     dendNum >= sorNum ? String(Math.floor(dendNum / sorNum)).length : 1;

//   const steps = [];
//   const currentWorkingDividendState = dendDisplayArr.map((char) => ({
//     // Use original display array
//     char,
//     state: "normal",
//   }));

//   steps.push({
//     ...initialStepVisualsFn(
//       dendDisplayArr.length, // Use original display length
//       sorStrRaw.length,
//       estimatedQuotientLen,
//       "Numbers ready. Click Play to start the division process."
//     ),
//     dividendOriginalPadded: padArrayWithChar(
//       dendDisplayArr,
//       dendDisplayArr.length,
//       " "
//     ),
//     divisorPadded: padArrayWithChar(sorStrRaw.split(""), sorStrRaw.length, " "),
//     workingDividendState: [...currentWorkingDividendState],
//   });

//   if (dendNum < sorNum) {
//     steps.push({
//       ...initialStepVisualsFn(
//         dendDisplayArr.length,
//         sorStrRaw.length,
//         1,
//         `Dividend ${dendNum} < Divisor ${sorNum}. Quotient is 0, Remainder is ${dendNum}.`
//       ),
//       dividendOriginalPadded: padArrayWithChar(
//         dendDisplayArr,
//         dendDisplayArr.length,
//         " "
//       ),
//       divisorPadded: padArrayWithChar(
//         sorStrRaw.split(""),
//         sorStrRaw.length,
//         " "
//       ),
//       quotientPadded: padArrayWithChar(["0"], estimatedQuotientLen),
//       workingDividendState: dendDisplayArr.map((char) => ({
//         char,
//         state: "used",
//       })),
//       finalRemainderValue: String(dendNum),
//       stepMessage: `Division complete: ${dendNum} ÷ ${sorNum} = 0 remainder ${dendNum}`,
//     });
//     return { steps, error: "" };
//   }

//   const currentQuotientDigits = [];
//   let tempSegmentStr = "";
//   let dividendPointer = 0; // Pointer for normalized dendArr
//   const calculationLinesStore = [];
//   let lastLineOffset = 0;

//   while (dividendPointer < dendLen || tempSegmentStr !== "") {
//     if (tempSegmentStr === "" && dividendPointer === dendLen) break;

//     let newDigitsBroughtDownThisSegment = 0; // Tracks BD for the current segment calculation
//     let pushedIntermediateZeroAndContinued = false;

//     // Segment building loop (modified)
//     while (true) {
//       // Condition to break: segment is large enough, or no more digits to bring.
//       if (tempSegmentStr !== "" && Number(tempSegmentStr) >= sorNum) {
//         break;
//       }
//       if (dividendPointer >= dendLen) {
//         break;
//       }

//       const digitToBringDown = dendArr[dividendPointer];

//       // Handle tempSegmentStr being "0" from a remainder of 0
//       if (tempSegmentStr === "0" && Number(tempSegmentStr) === 0) {
//         tempSegmentStr = digitToBringDown;
//       } else {
//         tempSegmentStr += digitToBringDown;
//       }

//       newDigitsBroughtDownThisSegment++;
//       currentWorkingDividendState[dividendPointer].state = "active"; // Update display state

//       steps.push({
//         ...(steps.length > 0
//           ? steps[steps.length - 1]
//           : initialStepVisualsFn(
//               dendDisplayArr.length,
//               sorStrRaw.length,
//               estimatedQuotientLen
//             )),
//         workingDividendState: JSON.parse(
//           JSON.stringify(currentWorkingDividendState)
//         ),
//         activeWorkingDividendIndex: dividendPointer,
//         currentSegmentText: tempSegmentStr.split(""),
//         stepMessage: `Bring down ${digitToBringDown}. Current working number: ${tempSegmentStr}`,
//         showBringDownArrow: true,
//         showMultiplyArrow: false, // Reset other arrows
//         showSubtractArrow: false,
//         quotientPadded: padArrayWithChar(
//           [...currentQuotientDigits],
//           estimatedQuotientLen
//         ), // Keep quotient updated
//         highlightQuotientIndex: currentQuotientDigits.length - 1,
//       });

//       currentWorkingDividendState[dividendPointer].state = "used";
//       dividendPointer++;

//       if (Number(tempSegmentStr) < sorNum) {
//         // Still too small. Check for intermediate '0'.
//         // This applies if we already have quotient digits (not a leading zero of "0.xxx")
//         if (currentQuotientDigits.length > 0) {
//           currentQuotientDigits.push("0");
//           steps.push({
//             ...steps[steps.length - 1],
//             quotientPadded: padArrayWithChar(
//               [...currentQuotientDigits],
//               estimatedQuotientLen
//             ),
//             highlightQuotientIndex: currentQuotientDigits.length - 1,
//             stepMessage: `${tempSegmentStr} < ${sorNum}, so quotient digit is 0.`,
//             showBringDownArrow: false, // Arrow action led to this '0'
//           });
//           if (tempSegmentStr === "0" && Number(tempSegmentStr) === 0) {
//             tempSegmentStr = ""; // Remainder 0, reset for next actual digit
//           }
//           pushedIntermediateZeroAndContinued = true;
//           break;
//         }
//         // If cQD.length is 0, continue inner loop to build the first segment
//         // e.g., for 123/50, "1" -> "12" -> "123"
//       } else {
//         // Number(tempSegmentStr) >= sorNum
//         break;
//       }
//     } // End of segment-building while loop

//     if (pushedIntermediateZeroAndContinued) {
//       continue; // Continue main while loop for next quotient digit position
//     }

//     // If, after segment building, tempSegmentStr is empty and pointer is at end (e.g. after exact division)
//     if (tempSegmentStr === "" && dividendPointer === dendLen) break;

//     // Original logic for handling segment too small (after segment building attempts)
//     if (Number(tempSegmentStr) < sorNum) {
//       // This implies dividendPointer === dendLen (no more digits)
//       // or cQD.length === 0 (initial segment like 12/345 is smaller)
//       if (dividendPointer === dendLen && tempSegmentStr !== "") {
//         // Fix for 1794/49 bug: This is the final remainder.
//         break;
//       }

//       // This part handles cases like 100/20 -> segment "1", then "10". 10<20. Quotient "0" for this.
//       // Or 21/70 -> initial segment "21" < 70. Quotient "0".
//       if (
//         newDigitsBroughtDownThisSegment > 0 ||
//         currentQuotientDigits.length > 0 ||
//         tempSegmentStr !== ""
//       ) {
//         // Push '0' if segment has content or more digits available, unless it's leading to overall Q=0,R=X handled initially.
//         // The `dendNum < sorNum` check handles the Q=0 overall. So if here, means we are forming a quotient.
//         // A '0' is needed if we formed a segment (newDigitsBroughtDownThisSegment > 0, or tempSegmentStr was non-empty from remainder)
//         // and it's still smaller than divisor, AND we are not at the "final remainder" break above.
//         if (tempSegmentStr !== "" || dividendPointer < dendLen) {
//           // Avoid if tempS="" and dP at end (R=0 done)
//           currentQuotientDigits.push("0");
//           steps.push({
//             ...steps[steps.length - 1],
//             quotientPadded: padArrayWithChar(
//               [...currentQuotientDigits],
//               estimatedQuotientLen
//             ),
//             highlightQuotientIndex: currentQuotientDigits.length - 1,
//             stepMessage: `${
//               tempSegmentStr || 0
//             } < ${sorNum}, so quotient digit is 0.`,
//             currentSegmentText: tempSegmentStr.split(""), // Show current small segment
//             showBringDownArrow: false,
//           });
//         }
//       }

//       if (dividendPointer === dendLen) {
//         // End of dividend
//         if (tempSegmentStr === "") tempSegmentStr = "0"; // If remainder became empty, formalize as "0"
//         break;
//       }
//       if (tempSegmentStr === "0" && Number(tempSegmentStr) === 0)
//         tempSegmentStr = ""; // Reset for next main loop iteration
//       continue;
//     }

//     // Segment is ready for division (Number(tempSegmentStr) >= sorNum)
//     const segmentValue = Number(tempSegmentStr);
//     const quotientDigit = Math.floor(segmentValue / sorNum);
//     currentQuotientDigits.push(String(quotientDigit));

//     const currentSegmentLine = {
//       text: tempSegmentStr.split(""),
//       offset: dividendPointer - tempSegmentStr.length, // dividendPointer is now past the segment
//       type: "segment",
//     };

//     if (
//       calculationLinesStore.length === 0 ||
//       calculationLinesStore[calculationLinesStore.length - 1].type ===
//         "subtraction_bar"
//     ) {
//       calculationLinesStore.push(currentSegmentLine);
//       lastLineOffset = currentSegmentLine.offset;
//     } else {
//       // Replace the last "segment" (which was a remainder) with this new brought-down segment
//       calculationLinesStore[calculationLinesStore.length - 1] =
//         currentSegmentLine;
//       lastLineOffset = currentSegmentLine.offset;
//     }

//     steps.push({
//       ...steps[steps.length - 1],
//       calculationLines: JSON.parse(JSON.stringify(calculationLinesStore)),
//       quotientPadded: padArrayWithChar(
//         [...currentQuotientDigits],
//         estimatedQuotientLen
//       ),
//       highlightQuotientIndex: currentQuotientDigits.length - 1,
//       stepMessage: `${tempSegmentStr} ÷ ${sorNum} = ${quotientDigit}`,
//       currentSegmentText: [], // Cleared as it's now part of calculationLines
//       showBringDownArrow: false,
//       showMultiplyArrow: true,
//     });

//     const productValue = quotientDigit * sorNum;
//     const productStr = String(productValue);
//     calculationLinesStore.push({
//       text: productStr.split(""),
//       offset: lastLineOffset + tempSegmentStr.length - productStr.length,
//       type: "product",
//     });

//     steps.push({
//       ...steps[steps.length - 1],
//       calculationLines: JSON.parse(JSON.stringify(calculationLinesStore)),
//       currentProductText: productStr.split(""),
//       stepMessage: `${quotientDigit} × ${sorNum} = ${productValue}`,
//       showMultiplyArrow: false,
//       showSubtractArrow: true,
//     });

//     const remainderValue = segmentValue - productValue;
//     const remainderStr = String(remainderValue);

//     calculationLinesStore.push({
//       text: [], // Placeholder for the bar itself
//       offset: lastLineOffset, // Align with segment start
//       type: "subtraction_bar",
//       length: tempSegmentStr.length, // Bar length matches segment
//     });

//     const remainderLine = {
//       text: remainderStr.split(""),
//       offset: lastLineOffset + tempSegmentStr.length - remainderStr.length, // Align end of remainder
//       type: "segment", // Treat remainder as a new segment for display
//     };
//     calculationLinesStore.push(remainderLine);
//     lastLineOffset = remainderLine.offset; // Update for next potential segment

//     steps.push({
//       ...steps[steps.length - 1],
//       calculationLines: JSON.parse(JSON.stringify(calculationLinesStore)),
//       currentProductText: [],
//       currentRemainderText: remainderStr.split(""),
//       stepMessage: `${tempSegmentStr} - ${productValue} = ${remainderValue}`,
//       showSubtractArrow: false,
//     });

//     tempSegmentStr = remainderValue === 0 ? "" : remainderStr;

//     if (dividendPointer === dendLen && tempSegmentStr === "") {
//       // Exact division, all digits used
//       break;
//     }
//   } // End of main while loop

//   const finalQuotientStr =
//     currentQuotientDigits.join("") || (dendNum < sorNum ? "0" : "0"); // if cQD is empty, means Q=0
//   const finalRemainderStr = tempSegmentStr === "" ? "0" : tempSegmentStr;

//   // Ensure last calculation lines reflect final state if remainder was processed as a segment
//   const finalStepVisuals =
//     steps.length > 0
//       ? { ...steps[steps.length - 1] }
//       : initialStepVisualsFn(
//           dendDisplayArr.length,
//           sorStrRaw.length,
//           estimatedQuotientLen
//         );

//   steps.push({
//     ...finalStepVisuals,
//     currentRemainderText: [], // Clear if it was just displayed
//     quotientPadded: padArrayWithChar(
//       finalQuotientStr.split(""),
//       estimatedQuotientLen
//     ),
//     workingDividendState: dendDisplayArr.map((char) => ({
//       char,
//       state: "used",
//     })),
//     finalRemainderValue: finalRemainderStr,
//     calculationLines: JSON.parse(JSON.stringify(calculationLinesStore)), // Ensure lines are up-to-date
//     stepMessage: `Division complete! Quotient: ${finalQuotientStr}, Remainder: ${finalRemainderStr}`,
//     showBringDownArrow: false,
//     showMultiplyArrow: false,
//     showSubtractArrow: false,
//     activeWorkingDividendIndex: -1, // No active index at the end
//     highlightQuotientIndex: -1, // No highlighted quotient digit at the end
//   });

//   return { steps, error: "" };
// };

// const VisualDivision = ({
//   dividend: dividendProp = "",
//   divisor: divisorProp = "",
//   showAnimationControls = false,
// }) => {
//   const { steps: animationSteps, error: calculationError } = useMemo(() => {
//     const d1 = String(dividendProp).trim();
//     const d2 = String(divisorProp).trim();
//     if (!d1 && !d2 && dividendProp === "" && divisorProp === "") {
//       return { steps: [], error: "" };
//     }
//     return prepareStepsAndErrorForDivision(d1, d2);
//   }, [dividendProp, divisorProp]);

//   const [currentStepIndex, setCurrentStepIndex] = useState(-1);
//   const [isAnimating, setIsAnimating] = useState(false);
//   const [animationSpeed, setAnimationSpeed] = useState("medium");

//   useEffect(() => {
//     setIsAnimating(false);
//     if (animationSteps.length > 0 && !calculationError) {
//       setCurrentStepIndex(animationSteps.length - 1);
//     } else {
//       setCurrentStepIndex(-1);
//     }
//   }, [animationSteps, calculationError]);

//   useEffect(() => {
//     if (isAnimating && currentStepIndex < animationSteps.length - 1) {
//       const timer = setTimeout(
//         () => setCurrentStepIndex((prev) => prev + 1),
//         getDelay(animationSpeed)
//       );
//       return () => clearTimeout(timer);
//     } else if (isAnimating && currentStepIndex === animationSteps.length - 1) {
//       setIsAnimating(false);
//     }
//   }, [isAnimating, currentStepIndex, animationSteps, animationSpeed]);

//   const handlePlayAnimation = () => {
//     if (animationSteps.length > 0 && !calculationError) {
//       setCurrentStepIndex(0);
//       setIsAnimating(true);
//     }
//   };

//   const handleReset = useCallback(() => {
//     setIsAnimating(false);
//     if (animationSteps.length > 0 && !calculationError) {
//       setCurrentStepIndex(animationSteps.length - 1);
//     } else {
//       setCurrentStepIndex(-1);
//     }
//   }, [animationSteps, calculationError]);

//   const getPlaceholderVisuals = useCallback(
//     (message) => {
//       const dendStr = String(dividendProp).trim();
//       const sorStr = String(divisorProp).trim();
//       const dendLen = Math.max(dendStr.length, 1);
//       const sorLen = Math.max(sorStr.length, 1);
//       const quoLen = dendLen;
//       const emptyArrFn = (l) => Array(l).fill(" ");

//       return {
//         dividendOriginalPadded: padArrayWithChar(
//           dendStr.split(""),
//           dendLen,
//           " ",
//           false
//         ),
//         divisorPadded: padArrayWithChar(sorStr.split(""), sorLen, " ", false),
//         quotientPadded: emptyArrFn(quoLen),
//         workingDividendState: dendStr
//           .split("")
//           .map((char) => ({ char, state: "normal" })),
//         calculationLines: [],
//         finalRemainderValue: null,
//         highlightQuotientIndex: -1,
//         activeWorkingDividendIndex: -1,
//         currentSegmentText: [],
//         currentProductText: [],
//         currentRemainderText: [],
//         stepMessage: message,
//         showBringDownArrow: false,
//         showMultiplyArrow: false,
//         showSubtractArrow: false,
//       };
//     },
//     [dividendProp, divisorProp]
//   );

//   let currentVisuals;
//   if (calculationError) {
//     currentVisuals = getPlaceholderVisuals(calculationError);
//   } else if (
//     animationSteps.length > 0 &&
//     currentStepIndex >= 0 &&
//     currentStepIndex < animationSteps.length
//   ) {
//     currentVisuals = animationSteps[currentStepIndex];
//   } else if (
//     animationSteps.length > 0 &&
//     currentStepIndex === -1 &&
//     !calculationError
//   ) {
//     currentVisuals = animationSteps[animationSteps.length - 1];
//   } else {
//     currentVisuals = getPlaceholderVisuals(
//       String(dividendProp).trim() === "" && String(divisorProp).trim() === ""
//         ? "Enter dividend and divisor to visualize division."
//         : "Preparing visualization..."
//     );
//   }

//   if (
//     !currentVisuals ||
//     typeof currentVisuals.dividendOriginalPadded === "undefined"
//   ) {
//     currentVisuals = getPlaceholderVisuals(
//       calculationError || "Initializing display..."
//     );
//   }

//   const digitCellWidth = "w-6 md:w-8";
//   const estimatedMaxLineWidth = Math.max(
//     currentVisuals.dividendOriginalPadded.length,
//     currentVisuals.divisorPadded.length +
//       currentVisuals.quotientPadded.length +
//       3
//   );

//   return (
//     <TooltipProvider>
//       <div className="p-4 md:p-6 text-lg md:text-xl lg:text-2xl max-w-5xl mx-auto">
//         {calculationError && (
//           <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
//             <p className="text-red-600 text-sm md:text-base text-center font-medium">
//               {calculationError}
//             </p>
//           </div>
//         )}

//         <Card className="shadow-lg border-2">
//           <CardContent className="pt-6 md:pt-8 w-full flex gap-4 overflow-x-auto">
//             <div className="flex whitespace-nowrap min-w-max mx-auto relative">
//               {/* Calculate consistent positioning */}
//               <div>
//                 {(() => {
//                   const divisorWidth = currentVisuals.divisorPadded.length;
//                   const dividendWidth =
//                     currentVisuals.dividendOriginalPadded.length;
//                   const quotientWidth = currentVisuals.quotientPadded.length;
//                   const cellWidth = 32; // 8 * 4 (w-8 = 2rem = 32px)

//                   return (
//                     <>
//                       {/* Arrow indicators */}
//                       {currentVisuals.showBringDownArrow && (
//                         <div
//                           className="absolute -top-6 flex items-center justify-center animate-bounce z-10"
//                           style={{
//                             left: `${
//                               (divisorWidth + 1) * cellWidth +
//                               currentVisuals.activeWorkingDividendIndex *
//                                 cellWidth
//                             }px`,
//                             width: `${cellWidth}px`,
//                           }}
//                         >
//                           <div className="flex flex-col items-center">
//                             <ArrowDown className="h-4 w-4 text-green-600" />
//                             <span className="text-xs text-green-600 whitespace-nowrap">
//                               Bring down
//                             </span>
//                           </div>
//                         </div>
//                       )}

//                       {currentVisuals.showMultiplyArrow && (
//                         <div className="absolute top-20 -left-16 flex items-center animate-pulse z-10">
//                           <div className="flex items-center bg-purple-100 px-2 py-1 rounded">
//                             <ArrowRight className="h-4 w-4 text-purple-600" />
//                             <span className="text-xs text-purple-600 ml-1">
//                               Multiply
//                             </span>
//                           </div>
//                         </div>
//                       )}

//                       {currentVisuals.showSubtractArrow && (
//                         <div className="absolute top-32 -left-16 flex items-center animate-pulse z-10">
//                           <div className="flex items-center bg-orange-100 px-2 py-1 rounded">
//                             <ArrowDown className="h-4 w-4 text-orange-600" />
//                             <span className="text-xs text-orange-600 ml-1">
//                               Subtract
//                             </span>
//                           </div>
//                         </div>
//                       )}

//                       {/* Main division layout */}
//                       <div
//                         className="grid"
//                         style={{
//                           gridTemplateColumns: `repeat(${
//                             divisorWidth + 1 + dividendWidth
//                           }, 1fr)`,
//                           gap: "0",
//                         }}
//                       >
//                         {/* Top row - Quotient area */}
//                         <div className="col-span-full flex items-end ml-12 pb-2">
//                           {/* Spacer for divisor */}
//                           <div
//                             style={{
//                               width: `${(divisorWidth + 1) * cellWidth}px`,
//                             }}
//                           ></div>
//                           {/* Quotient digits aligned over dividend */}
//                           <div className="flex">
//                             {currentVisuals.quotientPadded.map((digit, k) => (
//                               <div
//                                 key={`quotient-${k}`}
//                                 className={`w-8 h-8 flex items-center justify-center transition-all duration-300 ${
//                                   k === currentVisuals.highlightQuotientIndex
//                                     ? "bg-yellow-200 text-blue-700 font-bold rounded-md shadow-md transform scale-110"
//                                     : "text-blue-600 font-semibold"
//                                 }`}
//                               >
//                                 {digit}
//                               </div>
//                             ))}
//                           </div>
//                         </div>

//                         {/* Middle row - Divisor | Dividend with border */}
//                         <div className="col-span-full flex h-12 items-center  border-gray-800">
//                           {/* Divisor */}
//                           <div className="flex">
//                             {currentVisuals.divisorPadded.map((digit, k) => (
//                               <div
//                                 key={`divisor-${k}`}
//                                 className="w-8 h-8 flex items-center justify-center text-red-600 font-bold"
//                               >
//                                 {digit}
//                               </div>
//                             ))}
//                           </div>

//                           {/* Dividend */}
//                           <div className="flex border-t-4 border-l-4 border-neutral-800 p-2">
//                             {currentVisuals.workingDividendState.map(
//                               (item, k) => (
//                                 <div
//                                   key={`dividend-${k}`}
//                                   className={`w-8 h-8 flex items-center justify-center transition-all duration-500 ${
//                                     item.state === "active"
//                                       ? "bg-green-200 rounded-md shadow-md transform scale-110"
//                                       : item.state === "used"
//                                       ? "text-gray-400"
//                                       : "text-black font-bold"
//                                   } ${
//                                     k ===
//                                     currentVisuals.activeWorkingDividendIndex
//                                       ? "animate-pulse font-bold bg-green-300"
//                                       : ""
//                                   }`}
//                                 >
//                                   {item.char}
//                                 </div>
//                               )
//                             )}
//                           </div>
//                         </div>

//                         {/* Calculation Lines Area */}
//                         <div className="col-span-full mt-2">
//                           {currentVisuals.calculationLines.map(
//                             (line, lineIdx) => (
//                               <div
//                                 key={`calc-line-${lineIdx}`}
//                                 className="flex h-10 items-center transition-all duration-300"
//                                 style={{
//                                   marginLeft: `${
//                                     (divisorWidth + line.offset - 0.5) *
//                                     cellWidth
//                                   }px`,
//                                 }}
//                               >
//                                 {line.type === "product" ? (
//                                   <div className="w-8 h-8 flex items-center justify-center text-gray-600 font-bold">
//                                     -
//                                   </div>
//                                 ) : (
//                                   <div className="w-8 h-8 flex items-center justify-center text-gray-600 font-bold"></div>
//                                 )}

//                                 {line.type !== "subtraction_bar" ? (
//                                   <div className="flex">
//                                     {line.text.map((digit, k) => (
//                                       <div
//                                         key={`calc-digit-${lineIdx}-${k}`}
//                                         className={`w-8 h-8 flex items-center justify-center transition-all duration-300 ${
//                                           line.type === "segment" &&
//                                           currentVisuals.currentSegmentText.join(
//                                             ""
//                                           ) === line.text.join("")
//                                             ? "text-green-600 font-bold bg-green-100 rounded"
//                                             : line.type === "product" &&
//                                               currentVisuals.currentProductText.join(
//                                                 ""
//                                               ) === line.text.join("")
//                                             ? "text-purple-600 font-bold bg-purple-100 rounded"
//                                             : line.type === "segment" &&
//                                               currentVisuals.currentRemainderText.join(
//                                                 ""
//                                               ) === line.text.join("") &&
//                                               currentVisuals.currentProductText
//                                                 .length === 0
//                                             ? "text-orange-600 font-bold bg-orange-100 rounded"
//                                             : "text-gray-700 font-semibold"
//                                         }`}
//                                       >
//                                         {digit}
//                                       </div>
//                                     ))}
//                                   </div>
//                                 ) : (
//                                   <hr
//                                     className="border-t-2 border-gray-800 mt-2"
//                                     style={{
//                                       width: `${line.length * cellWidth + 5}px`,
//                                     }}
//                                   />
//                                 )}
//                               </div>
//                             )
//                           )}
//                         </div>
//                       </div>
//                     </>
//                   );
//                 })()}
//               </div>
//             </div>

//             {/* Step Message */}
//             {showAnimationControls && (
//               <div className="mt-6 p-4 bg-gray-50 rounded-lg border max-w-xs h-fit">
//                 <div className="text-sm md:text-base text-gray-700 text-center min-h-[2rem] flex items-center justify-center">
//                   {currentVisuals.stepMessage}
//                 </div>
//               </div>
//             )}
//           </CardContent>

//           {showAnimationControls && (
//             <CardFooter className="flex space-x-3 md:space-x-4 justify-center pb-4 md:pb-6 pt-2 md:pt-4">
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <Button
//                     size="sm"
//                     onClick={handlePlayAnimation}
//                     disabled={
//                       isAnimating ||
//                       !!calculationError ||
//                       !animationSteps ||
//                       animationSteps.length <= 1
//                     }
//                     aria-label="Play Animation"
//                   >
//                     <Play />
//                     Play
//                   </Button>
//                 </TooltipTrigger>
//                 <TooltipContent>Play step-by-step animation</TooltipContent>
//               </Tooltip>

//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <Button
//                     size="sm"
//                     onClick={handleReset}
//                     variant="outline"
//                     disabled={
//                       isAnimating &&
//                       currentStepIndex > 0 &&
//                       currentStepIndex < animationSteps.length - 1
//                     }
//                     aria-label="Reset Animation"
//                   >
//                     <History />
//                     Reset
//                   </Button>
//                 </TooltipTrigger>
//                 <TooltipContent>Show final result</TooltipContent>
//               </Tooltip>
//             </CardFooter>
//           )}
//         </Card>
//       </div>
//     </TooltipProvider>
//   );
// };

// export default VisualDivision;

"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { History, Play, ArrowDown, ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

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

// Helper to build the quotient display cells array
const buildQuotientDisplayCells = (
  digits, // array of quotient digit characters, e.g., ['3', '6']
  positions, // array of dividend indices for each digit, e.g., [2, 3]
  highlightedDividendIndex, // dividend index whose quotient digit should be highlighted, e.g., 3
  dividendDisplayLength // total length of the dividend display area
) => {
  const cells = Array(dividendDisplayLength)
    .fill(null)
    .map(() => ({ char: " ", state: "normal" })); // Initialize with empty, normal state cells

  digits.forEach((digit, i) => {
    const pos = positions[i];
    if (pos >= 0 && pos < dividendDisplayLength) {
      cells[pos] = {
        char: digit,
        state: pos === highlightedDividendIndex ? "highlighted" : "normal",
      };
    }
  });
  return cells;
};

const prepareStepsAndErrorForDivision = (dividendProp, divisorProp) => {
  const dendStrRaw = String(dividendProp).trim();
  const sorStrRaw = String(divisorProp).trim();

  const dendDisplayArr = dendStrRaw.split("");
  const dendDisplayLen = dendDisplayArr.length;

  const initialStepVisualsFn = (
    currentDendDisplayLen,
    sorLen,
    message = ""
  ) => ({
    dividendOriginalPadded: padArrayWithChar(
      dendDisplayArr, // Use display array for initial padding reference
      currentDendDisplayLen,
      " ",
      false
    ),
    divisorPadded: padArrayWithChar(sorStrRaw.split(""), sorLen, " ", false),
    quotientDisplayCells: Array(currentDendDisplayLen)
      .fill(null)
      .map(() => ({ char: " ", state: "normal" })),
    workingDividendState: dendDisplayArr.map((char) => ({
      char,
      state: "normal",
    })),
    calculationLines: [],
    finalRemainderValue: null,
    activeWorkingDividendIndex: -1,
    currentSegmentText: [],
    currentProductText: [],
    currentRemainderText: [],
    stepMessage: message,
    showBringDownArrow: false,
    showMultiplyArrow: false,
    showSubtractArrow: false,
    highlightQuotientAtDividendIndex: -1,
  });

  if (
    !dendStrRaw ||
    isNaN(Number(dendStrRaw)) ||
    !sorStrRaw ||
    isNaN(Number(sorStrRaw)) ||
    Number(dendStrRaw) < 0 ||
    Number(sorStrRaw) < 0
  ) {
    return {
      steps: [],
      error:
        "Dividend and Divisor must be valid, non-empty, non-negative numbers.",
    };
  }

  const dendNum = Number(dendStrRaw);
  const sorNum = Number(sorStrRaw);
  // Normalized dividend for calculation logic (removes leading zeros like "007" -> "7")
  const dendArr = String(dendNum).split("");

  if (sorNum === 0) {
    return { steps: [], error: "Divisor cannot be zero." };
  }

  if (dendStrRaw.length > 10 || sorStrRaw.length > 7) {
    return {
      steps: [],
      error:
        "Numbers too large. Max Dividend: 10 digits, Max Divisor: 7 digits.",
    };
  }

  const dendCalcLen = dendArr.length;
  // displayBias is the count of leading zeros in the raw dividend string
  const displayBias = dendStrRaw.length - dendArr.length;

  const steps = [];
  const currentWorkingDividendState = dendDisplayArr.map((char) => ({
    char,
    state: "normal",
  }));

  steps.push({
    ...initialStepVisualsFn(
      dendDisplayLen,
      sorStrRaw.length,
      "Numbers ready. Click Play to start the division process."
    ),
  });

  if (dendNum < sorNum) {
    const posForZeroQuotient = Math.max(0, dendDisplayLen - 1);
    const qCells = buildQuotientDisplayCells(
      ["0"], // Quotient is "0"
      [posForZeroQuotient], // Position for this "0"
      posForZeroQuotient, // Highlight this "0"
      dendDisplayLen
    );

    steps.push({
      ...initialStepVisualsFn(
        dendDisplayLen,
        sorStrRaw.length,
        `Dividend ${dendNum} < Divisor ${sorNum}. Quotient is 0, Remainder is ${dendNum}.`
      ),
      quotientDisplayCells: qCells,
      workingDividendState: dendDisplayArr.map((char) => ({
        char,
        state: "used",
      })),
      finalRemainderValue: String(dendNum),
      stepMessage: `Division complete: ${dendNum} ÷ ${sorNum} = 0 remainder ${dendNum}`,
      highlightQuotientAtDividendIndex: posForZeroQuotient,
    });
    return { steps, error: "" };
  }

  const currentQuotientDigits = [];
  const quotientDigitDividendPositions = [];
  let tempSegmentStr = "";
  let dividendPointer = 0;
  const calculationLinesStore = [];
  let lastLineOffset = 0;
  let highlightQAtDivIdx = -1;

  while (dividendPointer < dendCalcLen || tempSegmentStr !== "") {
    if (tempSegmentStr === "" && dividendPointer === dendCalcLen) break;

    let pushedIntermediateZeroAndContinued = false;
    highlightQAtDivIdx = -1;

    while (true) {
      if (tempSegmentStr !== "" && Number(tempSegmentStr) >= sorNum) break;
      if (dividendPointer >= dendCalcLen) break;

      const digitToBringDown = dendArr[dividendPointer];
      const displayPointerForBD = displayBias + dividendPointer;

      if (tempSegmentStr === "0" && Number(tempSegmentStr) === 0) {
        tempSegmentStr = digitToBringDown;
      } else {
        tempSegmentStr += digitToBringDown;
      }
      currentWorkingDividendState[displayPointerForBD].state = "active";

      steps.push({
        ...(steps.length > 0
          ? steps[steps.length - 1]
          : initialStepVisualsFn(dendDisplayLen, sorStrRaw.length)),
        workingDividendState: JSON.parse(
          JSON.stringify(currentWorkingDividendState)
        ),
        activeWorkingDividendIndex: displayPointerForBD,
        currentSegmentText: tempSegmentStr.split(""),
        stepMessage: `Bring down ${digitToBringDown}. Current working number: ${tempSegmentStr}`,
        showBringDownArrow: true,
        showMultiplyArrow: false,
        showSubtractArrow: false,
        quotientDisplayCells: buildQuotientDisplayCells(
          currentQuotientDigits,
          quotientDigitDividendPositions,
          -1,
          dendDisplayLen
        ),
        highlightQuotientAtDividendIndex: -1,
      });
      currentWorkingDividendState[displayPointerForBD].state = "used";
      dividendPointer++;

      if (Number(tempSegmentStr) < sorNum) {
        if (currentQuotientDigits.length > 0) {
          if (dividendPointer === dendCalcLen && Number(tempSegmentStr) > 0) {
            break;
          }

          currentQuotientDigits.push("0");
          highlightQAtDivIdx = displayBias + dividendPointer - 1;
          quotientDigitDividendPositions.push(highlightQAtDivIdx);

          steps.push({
            ...steps[steps.length - 1],
            quotientDisplayCells: buildQuotientDisplayCells(
              currentQuotientDigits,
              quotientDigitDividendPositions,
              highlightQAtDivIdx,
              dendDisplayLen
            ),
            highlightQuotientAtDividendIndex: highlightQAtDivIdx,
            stepMessage: `${tempSegmentStr} < ${sorNum}, so quotient digit is 0.`,
            showBringDownArrow: false,
          });
          if (tempSegmentStr === "0" && Number(tempSegmentStr) === 0)
            tempSegmentStr = "";
          pushedIntermediateZeroAndContinued = true;
          break;
        }
      } else {
        break;
      }
    }

    if (pushedIntermediateZeroAndContinued) continue;
    if (tempSegmentStr === "" && dividendPointer === dendCalcLen) break;

    if (Number(tempSegmentStr) < sorNum) {
      if (dividendPointer === dendCalcLen && tempSegmentStr !== "") break;
      if (dividendPointer === dendCalcLen) {
        if (tempSegmentStr === "") tempSegmentStr = "0";
        break;
      }
      if (tempSegmentStr === "0" && Number(tempSegmentStr) === 0)
        tempSegmentStr = "";
      continue;
    }

    const segmentValue = Number(tempSegmentStr);
    const quotientDigit = Math.floor(segmentValue / sorNum);
    currentQuotientDigits.push(String(quotientDigit));
    highlightQAtDivIdx = displayBias + dividendPointer - 1;
    quotientDigitDividendPositions.push(highlightQAtDivIdx);

    const currentSegmentLineOffset =
      displayBias + (dividendPointer - tempSegmentStr.length);
    const currentSegmentLine = {
      text: tempSegmentStr.split(""),
      offset: currentSegmentLineOffset, // This is the dividend-relative index for the start of the segment's text
      type: "segment",
    };

    if (
      calculationLinesStore.length === 0 ||
      calculationLinesStore[calculationLinesStore.length - 1].type ===
        "subtraction_bar"
    ) {
      calculationLinesStore.push(currentSegmentLine);
    } else {
      calculationLinesStore[calculationLinesStore.length - 1] =
        currentSegmentLine;
    }
    lastLineOffset = currentSegmentLineOffset;

    steps.push({
      ...steps[steps.length - 1],
      calculationLines: JSON.parse(JSON.stringify(calculationLinesStore)),
      quotientDisplayCells: buildQuotientDisplayCells(
        currentQuotientDigits,
        quotientDigitDividendPositions,
        highlightQAtDivIdx,
        dendDisplayLen
      ),
      highlightQuotientAtDividendIndex: highlightQAtDivIdx,
      stepMessage: `${tempSegmentStr} ÷ ${sorNum} = ${quotientDigit}`,
      currentSegmentText: [],
      showBringDownArrow: false,
      showMultiplyArrow: true,
    });

    const productValue = quotientDigit * sorNum;
    const productStr = String(productValue);
    calculationLinesStore.push({
      text: productStr.split(""),
      offset: lastLineOffset + tempSegmentStr.length - productStr.length, // Dividend-relative index for start of product text
      type: "product",
    });

    steps.push({
      ...steps[steps.length - 1],
      calculationLines: JSON.parse(JSON.stringify(calculationLinesStore)),
      quotientDisplayCells: buildQuotientDisplayCells(
        currentQuotientDigits,
        quotientDigitDividendPositions,
        highlightQAtDivIdx,
        dendDisplayLen
      ),
      highlightQuotientAtDividendIndex: highlightQAtDivIdx,
      currentProductText: productStr.split(""),
      stepMessage: `${quotientDigit} × ${sorNum} = ${productValue}`,
      showMultiplyArrow: false,
      showSubtractArrow: true,
    });

    const remainderValue = segmentValue - productValue;
    const remainderStr = String(remainderValue);
    calculationLinesStore.push({
      text: [],
      offset: lastLineOffset, // Bar starts at same offset as segment above it
      type: "subtraction_bar",
      length: tempSegmentStr.length,
    });
    const remainderLine = {
      text: remainderStr.split(""),
      offset: lastLineOffset + tempSegmentStr.length - remainderStr.length, // Dividend-relative index for start of remainder text
      type: "segment",
    };
    calculationLinesStore.push(remainderLine);
    lastLineOffset = remainderLine.offset;

    steps.push({
      ...steps[steps.length - 1],
      calculationLines: JSON.parse(JSON.stringify(calculationLinesStore)),
      quotientDisplayCells: buildQuotientDisplayCells(
        currentQuotientDigits,
        quotientDigitDividendPositions,
        highlightQAtDivIdx,
        dendDisplayLen
      ),
      highlightQuotientAtDividendIndex: highlightQAtDivIdx,
      currentProductText: [],
      currentRemainderText: remainderStr.split(""),
      stepMessage: `${tempSegmentStr} - ${productValue} = ${remainderValue}`,
      showSubtractArrow: false,
    });
    tempSegmentStr = remainderValue === 0 ? "" : remainderStr;
    if (dividendPointer === dendCalcLen && tempSegmentStr === "") break;
  }

  let finalQuotientValueStr;
  let finalQuotientDigitsArray;
  if (currentQuotientDigits.length > 0) {
    finalQuotientValueStr = String(Number(currentQuotientDigits.join("")));
    finalQuotientDigitsArray = finalQuotientValueStr.split("");
  } else {
    finalQuotientValueStr = "0";
    finalQuotientDigitsArray = ["0"];
  }

  let finalQuotientPositions = [...quotientDigitDividendPositions];
  if (
    currentQuotientDigits.length === 0 &&
    finalQuotientDigitsArray.length === 1 &&
    finalQuotientDigitsArray[0] === "0"
  ) {
    finalQuotientPositions = [Math.max(0, dendDisplayLen - 1)];
  } else if (finalQuotientDigitsArray.length < finalQuotientPositions.length) {
    finalQuotientPositions = finalQuotientPositions.slice(
      finalQuotientPositions.length - finalQuotientDigitsArray.length
    );
  }

  const finalRemainderStr = tempSegmentStr === "" ? "0" : tempSegmentStr;
  const finalStepBase =
    steps.length > 0
      ? { ...steps[steps.length - 1] }
      : initialStepVisualsFn(dendDisplayLen, sorStrRaw.length);

  steps.push({
    ...finalStepBase,
    quotientDisplayCells: buildQuotientDisplayCells(
      finalQuotientDigitsArray,
      finalQuotientPositions,
      -1,
      dendDisplayLen
    ),
    highlightQuotientAtDividendIndex: -1,
    workingDividendState: dendDisplayArr.map((char) => ({
      char,
      state: "used",
    })),
    finalRemainderValue: finalRemainderStr,
    calculationLines: JSON.parse(JSON.stringify(calculationLinesStore)),
    stepMessage: `Division complete! ભાગફળ: ${finalQuotientValueStr}, શેષ: ${finalRemainderStr}`,
    currentSegmentText: [],
    currentProductText: [],
    currentRemainderText: [],
    showBringDownArrow: false,
    showMultiplyArrow: false,
    showSubtractArrow: false,
    activeWorkingDividendIndex: -1,
  });

  return { steps, error: "" };
};

const VisualDivision = ({
  dividend: dividendProp = "",
  divisor: divisorProp = "",
  showAnimationControls = false,
}) => {
  const { steps: animationSteps, error: calculationError } = useMemo(() => {
    const d1 = String(dividendProp).trim();
    const d2 = String(divisorProp).trim();
    if (!d1 && !d2 && dividendProp === "" && divisorProp === "") {
      return { steps: [], error: "" };
    }
    return prepareStepsAndErrorForDivision(d1, d2);
  }, [dividendProp, divisorProp]);

  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState("medium");

  useEffect(() => {
    setIsAnimating(false);
    if (animationSteps.length > 0 && !calculationError) {
      setCurrentStepIndex(animationSteps.length - 1);
    } else {
      setCurrentStepIndex(-1);
    }
  }, [animationSteps, calculationError]);

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
      const dendStr = String(dividendProp).trim();
      const sorStr = String(divisorProp).trim();
      const dendDisplayLen = Math.max(dendStr.length, 1);
      const sorLen = Math.max(sorStr.length, 1);

      return {
        dividendOriginalPadded: padArrayWithChar(
          dendStr.split(""),
          dendDisplayLen,
          " ",
          false
        ),
        divisorPadded: padArrayWithChar(sorStr.split(""), sorLen, " ", false),
        quotientDisplayCells: Array(dendDisplayLen)
          .fill(null)
          .map(() => ({ char: " ", state: "normal" })),
        workingDividendState: dendStr
          .split("")
          .map((char) => ({ char, state: "normal" })),
        calculationLines: [],
        finalRemainderValue: null,
        activeWorkingDividendIndex: -1,
        currentSegmentText: [],
        currentProductText: [],
        currentRemainderText: [],
        stepMessage: message,
        showBringDownArrow: false,
        showMultiplyArrow: false,
        showSubtractArrow: false,
        highlightQuotientAtDividendIndex: -1,
      };
    },
    [dividendProp, divisorProp]
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
    currentVisuals = getPlaceholderVisuals(
      String(dividendProp).trim() === "" && String(divisorProp).trim() === ""
        ? "Enter dividend and divisor to visualize division."
        : "Preparing visualization..."
    );
  }

  if (
    !currentVisuals ||
    typeof currentVisuals.dividendOriginalPadded === "undefined"
  ) {
    currentVisuals = getPlaceholderVisuals(
      calculationError || "Initializing display..."
    );
  }

  return (
    <TooltipProvider>
      <div className="p-4 md:p-6 text-lg md:text-xl lg:text-2xl max-w-5xl mx-auto">
        {calculationError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-red-600 text-sm md:text-base text-center font-medium">
              {calculationError}
            </p>
          </div>
        )}

        <Card className="shadow-lg border-2">
          <CardContent className="pt-6 md:pt-8 w-full flex flex-col md:flex-row gap-4 overflow-x-auto">
            <div className="flex whitespace-nowrap min-w-max mx-auto relative">
              <div>
                {(() => {
                  const divisorPaddedLength =
                    currentVisuals.divisorPadded.length;
                  const dividendDisplayLength =
                    currentVisuals.quotientDisplayCells.length;
                  const cellWidthPx = 28; // As per user's last provided code for w-8 styling

                  return (
                    <>
                      {currentVisuals.showBringDownArrow &&
                        currentVisuals.activeWorkingDividendIndex !== -1 && (
                          <div
                            className="absolute -top-6 flex items-center justify-center animate-bounce z-10"
                            style={{
                              left: `${
                                (divisorPaddedLength + 1) * cellWidthPx + // +1 for separator
                                currentVisuals.activeWorkingDividendIndex *
                                  cellWidthPx
                              }px`,
                              width: `${cellWidthPx}px`,
                            }}
                          >
                            <div className="flex flex-col items-center">
                              <ArrowDown className="h-4 w-4 text-green-600" />
                              <span className="text-xs text-green-600 whitespace-nowrap">
                                Bring down
                              </span>
                            </div>
                          </div>
                        )}
                      {currentVisuals.showMultiplyArrow && (
                        <div className="absolute top-20 -left-2 flex items-center animate-pulse z-10">
                          <div className="flex items-center bg-purple-100 px-2 py-1 rounded">
                            <ArrowRight className="h-4 w-4 text-purple-600" />
                            <span className="text-xs text-purple-600 ml-1">
                              Multiply
                            </span>
                          </div>
                        </div>
                      )}
                      {currentVisuals.showSubtractArrow && (
                        <div className="absolute top-32 -left-2 flex items-center animate-pulse z-10">
                          <div className="flex items-center bg-orange-100 px-2 py-1 rounded">
                            <ArrowDown className="h-4 w-4 text-orange-600" />
                            <span className="text-xs text-orange-600 ml-1">
                              Subtract
                            </span>
                          </div>
                        </div>
                      )}
                      <div
                        className="grid"
                        style={{
                          gridTemplateColumns: `repeat(${
                            divisorPaddedLength + 1 + dividendDisplayLength
                          }, minmax(0, 1fr))`,
                          gap: "0",
                        }}
                      >
                        <div className="col-span-full flex items-end pb-2">
                          <div
                            style={{
                              width: `${
                                (divisorPaddedLength + 1) * cellWidthPx
                              }px`, // Divisor + Separator width
                            }}
                          ></div>
                          <div className="flex">
                            {currentVisuals.quotientDisplayCells.map(
                              (cell, k_dividend_idx) => (
                                <div
                                  key={`quotient-cell-${k_dividend_idx}`}
                                  className={`w-8 h-8 flex items-center justify-center transition-all duration-300 ${
                                    cell.state === "highlighted"
                                      ? "bg-yellow-200 text-blue-700 font-bold rounded-md shadow-md transform scale-110"
                                      : "text-blue-600 font-semibold"
                                  }`}
                                >
                                  {cell.char}
                                </div>
                              )
                            )}
                          </div>
                        </div>
                        <div className="col-span-full flex h-12 items-center border-gray-800">
                          <div className="flex">
                            {currentVisuals.divisorPadded.map((digit, k) => (
                              <div
                                key={`divisor-${k}`}
                                className="w-8 h-8 flex items-center justify-center text-red-600 font-bold"
                              >
                                {digit}
                              </div>
                            ))}
                          </div>
                          <div className="flex border-t-4 border-l-4 border-neutral-800 p-2">
                            {currentVisuals.workingDividendState.map(
                              (item, k) => (
                                <div
                                  key={`dividend-${k}`}
                                  className={`w-8 h-8 flex items-center justify-center transition-all duration-500 ${
                                    item.state === "active"
                                      ? "bg-green-200 rounded-md shadow-md transform scale-110"
                                      : item.state === "used"
                                      ? "text-gray-400"
                                      : "text-black font-bold"
                                  } ${
                                    k ===
                                    currentVisuals.activeWorkingDividendIndex
                                      ? "animate-pulse font-bold bg-green-300"
                                      : ""
                                  }`}
                                >
                                  {item.char}
                                </div>
                              )
                            )}
                          </div>
                        </div>
                        <div className="col-span-full mt-2">
                          {currentVisuals.calculationLines.map(
                            (line, lineIdx) => (
                              <div
                                key={`calc-line-${lineIdx}`}
                                className="flex h-10 items-center transition-all duration-300"
                                style={{
                                  marginLeft: `${
                                    (divisorPaddedLength + line.offset) *
                                    cellWidthPx
                                  }px`,
                                }}
                              >
                                <div className="w-8 h-8 flex items-center justify-center text-gray-600 font-bold">
                                  {line.type === "product" ? " - " : " "}
                                </div>
                                {line.type !== "subtraction_bar" ? (
                                  <div className="flex">
                                    {line.text.map((digit, k) => (
                                      <div
                                        key={`calc-digit-${lineIdx}-${k}`}
                                        className={`w-8 h-8 flex items-center justify-center transition-all duration-300 ${
                                          line.type === "segment" &&
                                          currentVisuals.currentSegmentText.join(
                                            ""
                                          ) === line.text.join("")
                                            ? "text-green-600 font-bold bg-green-100 rounded"
                                            : line.type === "product" &&
                                              currentVisuals.currentProductText.join(
                                                ""
                                              ) === line.text.join("")
                                            ? "text-purple-600 font-bold bg-purple-100 rounded"
                                            : line.type === "segment" &&
                                              currentVisuals.currentRemainderText.join(
                                                ""
                                              ) === line.text.join("") &&
                                              currentVisuals.currentProductText
                                                .length === 0
                                            ? "text-orange-600 font-bold bg-orange-100 rounded"
                                            : "text-gray-700 font-semibold"
                                        }`}
                                      >
                                        {digit}
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <hr
                                    className="border-t-2 border-gray-800"
                                    style={{
                                      width: `${
                                        (line.length + 1) * cellWidthPx
                                      }px`,
                                    }}
                                  />
                                )}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {showAnimationControls && (
              <div className="mt-6 md:mt-0 md:ml-4 p-4 bg-gray-50 rounded-lg border md:max-w-xs w-full md:w-auto h-fit self-center md:self-start">
                <div className="text-sm md:text-base text-gray-700 text-center min-h-[3em] flex items-center justify-center">
                  {currentVisuals.stepMessage}
                </div>
              </div>
            )}
          </CardContent>

          {showAnimationControls && (
            <CardFooter className="flex space-x-3 md:space-x-4 justify-center pb-4 md:pb-6 pt-2 md:pt-4">
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
                    <Play className="mr-1 h-4 w-4" /> Play
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Play step-by-step animation</TooltipContent>
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
                    <History className="mr-1 h-4 w-4" /> Reset
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Show final result</TooltipContent>
              </Tooltip>
            </CardFooter>
          )}
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default VisualDivision;
