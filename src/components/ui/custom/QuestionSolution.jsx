import React from "react";
import VisualAddition from "@/components/ui/custom/Addition";
import VisualSubtraction from "@/components/ui/custom/Subtraction";
import VisualMultiplication from "@/components/ui/custom/Multiplication";
import VisualDivision from "@/components/ui/custom/Division";
import VisualPrimeFactorization from "./PrimeFactorization";

export default function QuestionSolution({ question }) {
  if (!question || !question.questionRaw) return <p>No solution available.</p>;

  const raw = question.questionRaw;
  console.log(question);

  switch (question.type) {
    case "ADDITION":
      return (
        <VisualAddition
          num1={raw.a}
          num2={raw.b}
          num3={raw.c}
          showAnimationControls
        />
      );
    case "SUBTRACTION":
      return (
        <VisualSubtraction num1={raw.a} num2={raw.b} showAnimationControls />
      );
    case "MULTIPLICATION":
      return (
        <VisualMultiplication num1={raw.a} num2={raw.b} showAnimationControls />
      );
    case "DIVISION":
      return (
        <VisualDivision
          dividend={raw.a}
          divisor={raw.b}
          showAnimationControls
        />
      );

    case "PRIME_FACTORIZATION":
      console.log(raw);
      return (
        <VisualPrimeFactorization number={raw.number} showAnimationControls />
      );
    default:
      return <p>Solution not available.</p>;
  }
}
