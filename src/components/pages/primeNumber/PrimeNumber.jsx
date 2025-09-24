import BackButton from "@/components/ui/backButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TypographyH3, TypographyLarge } from "@/components/ui/typography";
import { checkPrimeNumber, generatePrimeNumbers } from "@/utils/primeNumber";
import clsx from "clsx";
import { ArrowRight, Check, CircleX, Frown, Smile } from "lucide-react";
import React, { useState, useMemo } from "react";

function CheckPrimeNumber() {
  const [infoData, setInfoData] = useState({
    number: 0,
    visible: false,
    isPrime: false,
  });

  const [input, setInput] = useState("");

  const handlePrimeNumberSubmit = () => {
    const isPrime = checkPrimeNumber(input);
    setInfoData({ number: input, visible: true, isPrime });
    setInput("");
  };

  return (
    <>
      <Card>
        <CardHeader>
          <TypographyH3>
            વિભાજ્ય કે અવિભાજ્ય સંખ્યા ચકાસો (Check Prime/Composite Number)
          </TypographyH3>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Input
            type="number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter number"
          />
          <Button
            onClick={handlePrimeNumberSubmit}
            disabled={!String(input).trim()}
          >
            <Check /> Check
          </Button>
        </CardContent>
      </Card>
      <Card
        className={clsx(
          "max-w-3xl mx-auto",
          !infoData.visible && "hidden",
          infoData.isPrime
            ? "bg-green-900 text-green-50"
            : "bg-red-900 text-red-50"
        )}
      >
        <CardContent className="flex justify-between items-center">
          <div className="flex gap-3 items-center">
            <div>
              {infoData.isPrime ? (
                <Smile className="size-12" />
              ) : (
                <Frown className="size-12" />
              )}
            </div>
            <div className="space-y-1.5">
              <TypographyLarge>{`${infoData.number} ${
                infoData.isPrime ? "અવિભાજ્ય" : "વિભાજ્ય"
              } છે.`}</TypographyLarge>
            </div>
          </div>
          <Tooltip>
            <TooltipTrigger>
              <CircleX
                onClick={() =>
                  setInfoData((prev) => ({ ...prev, visible: false }))
                }
                className="size-8 p-1 hover:bg-background/10 rounded-full"
              />
            </TooltipTrigger>
            <TooltipContent sideOffset={3}>Close</TooltipContent>
          </Tooltip>
        </CardContent>
      </Card>
    </>
  );
}

function GeneratePrimeNumbers() {
  const [numberType, setNumberType] = useState("Prime");

  const [input, setInput] = useState({
    from: "",
    to: "",
  });

  const [info, setInfo] = useState({
    visible: false,
    data: [],
    from: 0,
    to: 0,
  });

  const from = parseInt(input.from, 10);
  const to = parseInt(input.to, 10);

  const primes = useMemo(() => {
    if (
      isNaN(from) ||
      isNaN(to) ||
      from < 1 ||
      to < 1 ||
      to < from ||
      to > 100000
    ) {
      return [];
    }
    if (numberType === "Prime") {
      return generatePrimeNumbers(from, to);
    }
    if (numberType === "Composite") {
      const primes = generatePrimeNumbers(from, to);
      const compositeNums = Array.from(
        { length: to - Math.max(2, from) + 1 },
        (_, i) => i + Math.max(2, from)
      ).filter((num) => !primes.includes(num));
      return compositeNums;
    }
  }, [to]);

  const handlePrimeNumberRangeSubmit = () => {
    if (to > 100000) {
      alert("Please enter a number less than or equal to 100,000");
      return;
    }

    if (from < 1 || to < 1) {
      alert("Please enter positive numbers only");
      return;
    }

    if (isNaN(from) || isNaN(to) || to < from) {
      alert("Enter a valid numeric range");
      setInput({ from: "", to: "" });
      return;
    }

    setInfo({
      visible: true,
      data: primes,
      from,
      to,
      type: numberType,
    });
    setInput({
      from: "",
      to: "",
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <TypographyH3>
            <div className="flex gap-1.5">
              <Select
                value={numberType}
                onValueChange={(val) => setNumberType(val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select number type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Prime">
                    <TypographyH3>અવિભાજ્ય</TypographyH3>
                  </SelectItem>
                  <SelectItem value="Composite">
                    <TypographyH3>વિભાજ્ય</TypographyH3>
                  </SelectItem>
                </SelectContent>
              </Select>
              સંખ્યા મેળવો
            </div>
          </TypographyH3>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <div className="flex gap-4">
              <Input
                type="number"
                placeholder="From"
                value={input.from}
                onChange={(e) =>
                  setInput((prev) => ({ ...prev, from: e.target.value }))
                }
              />
              <Input
                type="number"
                placeholder="To"
                value={input.to}
                onChange={(e) =>
                  setInput((prev) => ({ ...prev, to: e.target.value }))
                }
              />
            </div>
            <Button
              onClick={handlePrimeNumberRangeSubmit}
              disabled={!String(input.from).trim() || !String(input.to).trim()}
            >
              Generate <ArrowRight />
            </Button>
          </div>
        </CardContent>
      </Card>
      {info.visible && (
        <div className="outline rounded-xl px-4 py-4">
          <div className="flex justify-between mb-3">
            <div>
              <TypographyH3>
                {info.type === "Composite" ? "વિભાજ્ય" : "અવિભાજ્ય"} સંખ્યા{" "}
                {info.from} થી {info.to}
              </TypographyH3>
            </div>
            <Tooltip>
              <TooltipTrigger>
                <CircleX
                  onClick={() =>
                    setInfo((prev) => ({ ...prev, visible: false }))
                  }
                  className="size-8 p-1 hover:bg-primary/10 rounded-full"
                />
              </TooltipTrigger>
              <TooltipContent sideOffset={3}>Close</TooltipContent>
            </Tooltip>
          </div>
          <div className="grid grid-cols-3 lg:grid-cols-12 gap-4">
            {info.data.map((prime) => (
              <Card key={prime}>
                <CardHeader className="px-0 w-full text-center">
                  <TypographyLarge>{prime}</TypographyLarge>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function PrimeNumber() {
  return (
    <>
      <BackButton />
      <div className="max-w-3xl mb-20 space-y-3 mx-auto">
        <CheckPrimeNumber />
        <Separator />
        <GeneratePrimeNumbers />
      </div>
    </>
  );
}

export default PrimeNumber;
