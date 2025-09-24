// components/pages/HcfLcmCalculators.jsx

import BackButton from "@/components/ui/backButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getPrimeFactorization } from "@/utils/primeFactorization";
import { ArrowRight, CircleX, Lightbulb } from "lucide-react";
import React, { useState } from "react";

// --- Component 1: LCM by Division Method (Unchanged) ---
function LcmByDivisionMethod() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState({
    visible: false,
    steps: [],
    initialNumbers: [],
    lcm: 1,
    hcf: 1,
  });

  const calculateSteps = (numbers) => {
    let currentNumbers = [...numbers];
    const steps = [];
    let divisor = 2;
    while (!currentNumbers.every((n) => n === 1)) {
      if (currentNumbers.some((n) => n % divisor === 0)) {
        const isCommonDivisor = currentNumbers.every(
          (n) => n % divisor === 0 || n === 1
        );
        const nextNumbers = currentNumbers.map((n) =>
          n % divisor === 0 ? n / divisor : n
        );
        steps.push({ divisor, numbers: nextNumbers, isCommonDivisor });
        currentNumbers = nextNumbers;
      } else {
        divisor = divisor === 2 ? 3 : divisor + 2;
      }
      if (divisor > 100000) {
        break;
      }
    }
    return steps;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const numbers = input
      .split(/[, ]+/)
      .map((s) => Number(s.trim()))
      .filter((n) => !isNaN(n) && n > 0);
    if (numbers.length < 2) {
      alert("Please enter at least two positive numbers.");
      return;
    }
    const steps = calculateSteps(numbers);
    const lcm = steps.reduce((acc, step) => acc * step.divisor, 1);
    const hcf = steps
      .filter((step) => step.isCommonDivisor)
      .reduce((acc, step) => acc * step.divisor, 1);
    setResult({ visible: true, steps, initialNumbers: numbers, lcm, hcf });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>LCM by Division Method</CardTitle>
        <CardDescription>
          Enter numbers separated by commas or spaces (e.g., 24, 15, 30).
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="flex gap-4">
            <Input
              type="text"
              placeholder="e.g., 8, 12, 16"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              required
            />
            <Button type="submit">
              Calculate LCM <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </form>
      {result.visible && (
        <div className="p-4 pt-0">
          <Card className="relative p-4 bg-muted/30">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => setResult((prev) => ({ ...prev, visible: false }))}
            >
              <CircleX className="size-6 text-muted-foreground" />
            </Button>
            <CardHeader>
              <CardTitle>Division Method Table</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center overflow-x-auto">
              <div className="flex font-mono text-lg sm:text-xl">
                <div className="pr-4 flex flex-col items-end space-y-2 flex-shrink-0">
                  <div className="h-8">&nbsp;</div>
                  {result.steps.map((step, i) => (
                    <div
                      key={i}
                      className={`h-8 flex items-center font-bold ${
                        step.isCommonDivisor
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step.divisor}
                    </div>
                  ))}
                </div>
                <div className="border-l-2 border-primary pl-4">
                  <div className="flex flex-col space-y-2">
                    <div className="h-8 flex items-center font-bold whitespace-nowrap">
                      {result.initialNumbers.join(", ")}
                    </div>
                    {result.steps.map((step, i) => (
                      <div
                        key={i}
                        className="h-8 flex items-center border-t border-primary whitespace-nowrap"
                      >
                        {step.numbers.join(", ")}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start space-y-4">
              <Alert className="text-left">
                <Lightbulb className="h-4 w-4" />
                <AlertTitle>How to Read the Table</AlertTitle>
                <AlertDescription>
                  The HCF is the product of common divisors (in{" "}
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    blue
                  </span>
                  ). The LCM is the product of{" "}
                  <span className="font-semibold">all</span> divisors.
                </AlertDescription>
              </Alert>
              <div>
                <h3 className="font-semibold">LCM (Least Common Multiple)</h3>
                <p className="font-mono mt-1 break-all">
                  LCM = {result.steps.map((s) => s.divisor).join(" × ")} ={" "}
                  <Badge className="text-lg">
                    {result.lcm.toLocaleString()}
                  </Badge>
                </p>
              </div>
            </CardFooter>
          </Card>
        </div>
      )}
    </Card>
  );
}

// --- Component 2: HCF by Prime Factorization (NEW VISUAL STYLE) ---

// A small helper component to render the highlighted factor list
const FactorDisplay = ({ factors, commonFactors }) => {
  let commonFactorsCopy = [...commonFactors];
  return (
    <div className="flex flex-wrap items-center gap-x-2 font-mono text-lg">
      {factors.map((factor, index) => {
        const isCommon = commonFactorsCopy.includes(factor);
        if (isCommon) {
          // Remove the used common factor to handle duplicates correctly
          commonFactorsCopy.splice(commonFactorsCopy.indexOf(factor), 1);
        }
        return (
          <React.Fragment key={index}>
            <span
              className={`p-1 rounded-md ${
                isCommon ? "bg-pink-200 dark:bg-pink-800 font-bold" : ""
              }`}
            >
              {factor}
            </span>
            {index < factors.length - 1 && (
              <span className="text-muted-foreground">×</span>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

function HcfByPrimeFactorization() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState({
    visible: false,
    factorizations: [],
    commonFactors: [],
    finalHcf: 1,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const numbers = input
      .split(/[, ]+/)
      .map((s) => Number(s.trim()))
      .filter((n) => !isNaN(n) && n > 1);
    if (numbers.length < 2) {
      alert("Please enter at least two positive numbers greater than 1.");
      return;
    }

    // 1. Generate factorization data for each number
    const factorizations = numbers.map((num) => {
      const factors = getPrimeFactorization(num);
      let currentNum = num;
      const steps = factors.map((factor) => {
        const nextNum = currentNum / factor;
        const step = { divisor: factor, number: currentNum };
        currentNum = nextNum;
        return step;
      });
      steps.push({ divisor: null, number: 1 }); // Add final '1'
      return { number: num, factors, steps };
    });

    // 2. Find common factors
    let common = [...factorizations[0].factors];
    for (let i = 1; i < factorizations.length; i++) {
      const nextFactors = [...factorizations[i].factors];
      common = common.filter((factor) => {
        const index = nextFactors.indexOf(factor);
        if (index > -1) {
          nextFactors.splice(index, 1); // Remove factor to handle duplicates
          return true;
        }
        return false;
      });
    }

    const finalHcf = common.reduce((acc, val) => acc * val, 1);
    setResult({
      visible: true,
      factorizations,
      commonFactors: common,
      finalHcf,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>HCF by Prime Factorization</CardTitle>
        <CardDescription>
          Find the HCF by visually comparing the prime factors of each number.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="flex gap-4">
            <Input
              type="text"
              placeholder="e.g., 24, 36"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              required
            />
            <Button type="submit">
              Calculate HCF <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </form>
      {result.visible && (
        <div className="p-4 pt-0">
          <Card className="relative p-4 bg-muted/30">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => setResult((prev) => ({ ...prev, visible: false }))}
            >
              <CircleX className="size-6 text-muted-foreground" />
            </Button>

            {/* Step 1: Individual Division Ladders */}
            <CardHeader>
              <CardTitle>Step 1: Find Prime Factors</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap justify-center gap-8">
              {result.factorizations.map(({ number, steps }) => (
                <div key={number} className="flex font-mono text-lg sm:text-xl">
                  <div className="pr-4 flex flex-col items-end space-y-2">
                    {steps.map((s, i) => (
                      <div
                        key={i}
                        className="h-8 flex items-center font-bold text-green-600 dark:text-green-400"
                      >
                        {s.divisor}
                      </div>
                    ))}
                  </div>
                  <div className="border-l-2 border-primary pl-4">
                    <div className="flex flex-col space-y-2">
                      {steps.map((s, i) => (
                        <div
                          key={i}
                          className="h-8 flex items-center border-t border-primary"
                        >
                          {s.number}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>

            {/* Step 2: Compare Factors and Find HCF */}
            <CardHeader>
              <CardTitle>Step 2: Compare and Find HCF</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="p-4 rounded-lg bg-background border space-y-4">
                {result.factorizations.map(({ number, factors }) => (
                  <div key={number} className="flex items-center gap-4">
                    <Badge className="w-32 justify-center py-1 text-base">
                      Factors of {number}
                    </Badge>
                    <FactorDisplay
                      factors={factors}
                      commonFactors={result.commonFactors}
                    />
                  </div>
                ))}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col items-center space-y-2">
              <h3 className="font-semibold text-lg">
                HCF is the product of common factors:
              </h3>
              <p className="font-mono text-xl p-2 rounded-md bg-green-100 dark:bg-green-900">
                {result.commonFactors.join(" × ") || "1"} ={" "}
                <span className="font-bold text-2xl">{result.finalHcf}</span>
              </p>
            </CardFooter>
          </Card>
        </div>
      )}
    </Card>
  );
}

// --- Main Parent Component (Unchanged) ---
function HcfLcm() {
  return (
    <div className="space-y-4">
      <BackButton />
      <div className="max-w-3xl mb-20 space-y-4 mx-auto">
        <Tabs defaultValue="lcm" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="lcm">LCM by Division Method</TabsTrigger>
            <TabsTrigger value="hcf">HCF by Prime Factors</TabsTrigger>
          </TabsList>
          <TabsContent value="lcm">
            <LcmByDivisionMethod />
          </TabsContent>
          <TabsContent value="hcf">
            <HcfByPrimeFactorization />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default HcfLcm;
