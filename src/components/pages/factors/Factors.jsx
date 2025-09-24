import BackButton from "@/components/ui/backButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
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
  TypographySmall,
} from "@/components/ui/typography";
import { generateFactors } from "@/utils/factors";
import { ArrowRight, CircleX } from "lucide-react";
import React, { useState } from "react";

function Factors() {
  const [input, setInput] = useState("");
  const [info, setInfo] = useState({
    visible: false,
    data: [],
    number: 0,
  });

  const handleSubmit = () => {
    if (input <= 0) {
      alert("Enter a natural number");
      setInput("");
      return;
    }
    const factors = generateFactors(Number(input));
    setInfo({
      visible: true,
      data: factors,
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
            <TypographyH3>અવયવો શોધો (Generate Factors)</TypographyH3>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                type="number"
                placeholder="Enter a number"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <Button onClick={handleSubmit} disabled={!String(input).trim()}>
                Generate <ArrowRight />
              </Button>
            </div>
          </CardContent>
          {info.visible && (
            <CardFooter className="flex gap-2">
              <TypographySmall>
                અવયવો ની સંખ્યા (Number of factors):
              </TypographySmall>
              <Badge>{info.data.length}</Badge>
            </CardFooter>
          )}
        </Card>
        {info.visible && (
          <div className="outline rounded-xl px-4 py-4">
            <div className="flex justify-between mb-3">
              <div>
                <TypographyH3>{info.number} ના અવયવો</TypographyH3>
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
      </div>
    </div>
  );
}

export default Factors;
