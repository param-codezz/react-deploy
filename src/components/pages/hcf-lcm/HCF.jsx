// components/pages/HcfEuclideanMethod.jsx

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
import { ArrowRight, CircleX, Lightbulb } from "lucide-react";
import React, { useState } from "react";

function HcfEuclideanMethod() {
  const [input, setInput] = useState({
    num1: "",
    num2: "",
  });
  const [result, setResult] = useState({
    visible: false,
    steps: [],
    hcf: 0,
  });

  const calculateHcfSteps = (a, b) => {
    let num1 = Math.abs(Math.max(a, b));
    let num2 = Math.abs(Math.min(a, b));
    const steps = [];

    while (num2 !== 0) {
      const quotient = Math.floor(num1 / num2);
      const remainder = num1 % num2;

      steps.push({
        dividend: num1,
        divisor: num2,
        quotient: quotient,
        remainder: remainder,
      });

      num1 = num2;
      num2 = remainder;
    }

    // The HCF is the last non-zero divisor
    const hcf = num1;
    return { steps, hcf };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const num1 = Number(input.num1);
    const num2 = Number(input.num2);

    if (!num1 || !num2 || num1 <= 0 || num2 <= 0) {
      alert("Please enter two positive whole numbers.");
      return;
    }

    const { steps, hcf } = calculateHcfSteps(num1, num2);

    setResult({
      visible: true,
      steps,
      hcf,
    });
  };

  return (
    <div className="space-y-4">
      <BackButton />
      <div className="max-w-3xl mb-20 space-y-4 mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>HCF by Long Division Method</CardTitle>
            <CardDescription>
              Find the Highest Common Factor (HCF) of two numbers using the
              Euclidean Algorithm, which shows each division step.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="flex flex-col sm:flex-row gap-4">
              <Input
                type="number"
                name="num1"
                placeholder="First number"
                value={input.num1}
                onChange={(e) => setInput({ ...input, num1: e.target.value })}
                required
              />
              <Input
                type="number"
                name="num2"
                placeholder="Second number"
                value={input.num2}
                onChange={(e) => setInput({ ...input, num2: e.target.value })}
                required
              />
              <Button type="submit" className="w-full sm:w-auto">
                Calculate HCF <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </form>
        </Card>

        {result.visible && (
          <Card className="relative p-4">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => setResult((prev) => ({ ...prev, visible: false }))}
            >
              <CircleX className="size-6 text-muted-foreground" />
            </Button>

            <CardHeader>
              <CardTitle>Step-by-Step Calculation</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {result.steps.map((step, index) => (
                <div
                  key={index}
                  className="font-mono p-3 rounded-lg bg-muted/50 border"
                >
                  <p className="text-sm text-muted-foreground">
                    Step {index + 1}:
                  </p>
                  <p>
                    Divide {step.dividend} by {step.divisor}:
                  </p>
                  <p className="pl-4">
                    {step.dividend} = {step.divisor} × {step.quotient} +{" "}
                    <span className="font-bold text-blue-600">
                      {step.remainder}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    The new divisor is the old remainder ({step.remainder}).
                  </p>
                </div>
              ))}
              <Alert>
                <Lightbulb className="h-4 w-4" />
                <AlertTitle>Result</AlertTitle>
                <AlertDescription>
                  The last non-zero remainder is{" "}
                  <span className="font-bold">
                    {result.steps[result.steps.length - 2]?.remainder ||
                      result.steps[0].divisor}
                  </span>
                  . Therefore, the HCF is determined.
                </AlertDescription>
              </Alert>
            </CardContent>

            <CardFooter>
              <div className="text-2xl font-bold">
                HCF = <Badge className="text-3xl px-4 py-1">{result.hcf}</Badge>
              </div>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}

export default HcfEuclideanMethod;
