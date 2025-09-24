// components/pages/PlaceValue.jsx

import BackButton from "@/components/ui/backButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  TypographyH3,
  TypographyLarge,
  TypographyMuted,
} from "@/components/ui/typography";
import { getPlaceValueData } from "@/utils/placeValue"; // This now returns the updated data structure
import { ArrowRight, CircleX } from "lucide-react";
import React, { useState } from "react";

// This helper function remains IDENTICAL, as it already works with English keys
const getPlaceColorClass = (placeKey) => {
  if (placeKey.includes("Thousand")) {
    return "bg-sky-50 border-sky-200 dark:bg-sky-950 dark:border-sky-800";
  }
  if (placeKey.includes("Lakh")) {
    return "bg-violet-50 border-violet-200 dark:bg-violet-950 dark:border-violet-800";
  }
  if (placeKey.includes("Crore")) {
    return "bg-rose-50 border-rose-200 dark:bg-rose-950 dark:border-rose-800";
  }
  switch (placeKey) {
    case "Hundreds":
      return "bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800";
    case "Tens":
      return "bg-lime-50 border-lime-200 dark:bg-lime-950 dark:border-lime-800";
    case "Ones":
      return "bg-teal-50 border-teal-200 dark:bg-teal-950 dark:border-teal-800";
    default:
      return "bg-card";
  }
};

// This helper function also remains IDENTICAL
const getPlaceTextColorClass = (placeKey) => {
  if (placeKey.includes("Thousand")) return "text-sky-600 dark:text-sky-400";
  if (placeKey.includes("Lakh")) return "text-violet-600 dark:text-violet-400";
  if (placeKey.includes("Crore")) return "text-rose-600 dark:text-rose-400";
  switch (placeKey) {
    case "Hundreds":
      return "text-amber-600 dark:text-amber-400";
    case "Tens":
      return "text-lime-600 dark:text-lime-400";
    case "Ones":
      return "text-teal-600 dark:text-teal-400";
    default:
      return "text-foreground";
  }
};

function PlaceValue() {
  const [input, setInput] = useState("");
  const [info, setInfo] = useState({
    visible: false,
    data: [],
    number: "0",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input || Number(input) < 0) {
      alert("Please enter a non-negative number.");
      setInput("");
      return;
    }

    if (input.length > 9) {
      alert("Enter a smaller value (up to 9 digits).");
      setInput("");
      return;
    }

    const placeValueData = getPlaceValueData(input);
    setInfo({
      visible: true,
      data: placeValueData,
      number: input,
    });
    setInput("");
  };

  return (
    <div className="space-y-4">
      <BackButton />
      <div className="max-w-3xl mb-20 space-y-3 mx-auto">
        <Card className="mx-auto">
          <CardHeader>
            <TypographyH3>સ્થાનકિંમત શોધો (Find Place Value)</TypographyH3>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <div className="flex gap-4">
                <Input
                  type="number"
                  placeholder="સંખ્યા (Enter number)"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <Button type="submit" disabled={!String(input).trim()}>
                  Find <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </form>
          {info.visible && (
            <CardFooter className="flex gap-2">
              <TypographyMuted>Number of digits:</TypographyMuted>
              <Badge>{info.data.length}</Badge>
            </CardFooter>
          )}
        </Card>

        {info.visible && (
          <div className="outline rounded-xl px-4 py-4">
            <div className="flex justify-between items-center mb-3">
              <div className="flex w-full justify-end">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setInfo((prev) => ({ ...prev, visible: false }))
                      }
                    >
                      <CircleX className="size-6 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent sideOffset={3}>Close</TooltipContent>
                </Tooltip>
              </div>
            </div>

            <Card className="my-4 p-4 text-center bg-muted/30">
              <CardHeader>
                <CardTitle className="text-start text-2xl">
                  વિસ્તૃત સ્વરૂપ
                </CardTitle>
              </CardHeader>
              <div className="tracking-wide flex flex-wrap items-center justify-center gap-x-2 overflow-auto  font-semibold text-2xl">
                {Number(info.number).toLocaleString("en-IN")} =
                {info.data
                  .filter((item) => item.digit !== "0")
                  .map((item, index, arr) => (
                    <React.Fragment key={index}>
                      {/* --- CHANGE HERE: Use item.placeKey for color --- */}
                      <span
                        className={`${getPlaceTextColorClass(item.placeKey)}`}
                      >
                        {Number(item.expandedForm).toLocaleString("en-IN")}
                      </span>
                      {index < arr.length - 1 && (
                        <span className="text-muted-foreground mx-1">+</span>
                      )}
                    </React.Fragment>
                  ))}
              </div>
            </Card>

            <div className="mb-5">
              <TypographyH3>
                {Number(info.number).toLocaleString("en-IN")} ની સ્થાનકિંમત
                (Place Value of {Number(info.number).toLocaleString("en-IN")})
              </TypographyH3>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              {info.data.map((item, index) => (
                <Card
                  key={index}
                  // --- CHANGE HERE: Use item.placeKey for color ---
                  className={`w-40 text-center flex flex-col justify-between transition-colors ${getPlaceColorClass(
                    item.placeKey
                  )}`}
                >
                  <CardHeader>
                    <TypographyMuted>Digit</TypographyMuted>
                    {/* --- CHANGE HERE: Use item.placeKey for color --- */}
                    <p
                      className={`text-5xl font-bold tracking-tighter ${getPlaceTextColorClass(
                        item.placeKey
                      )}`}
                    >
                      {item.digit}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <TypographyMuted>Value</TypographyMuted>
                    <TypographyLarge>
                      {Number(item.expandedForm).toLocaleString("en-IN")}
                    </TypographyLarge>
                  </CardContent>
                  <CardFooter className="flex-col w-full pb-3">
                    {/* --- NO CHANGE HERE: Display the Gujarati name --- */}
                    <Badge variant="secondary">{item.place}</Badge>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PlaceValue;
