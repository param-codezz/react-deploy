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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TypographyH3, TypographyLarge } from "@/components/ui/typography";
import checkDivisibility from "@/utils/divisibility";
import { clsx } from "clsx";
import { Check, ChevronLeft, CircleX, Frown, Smile } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function DivisibilityCheck() {
  const [divisibilityData, setDivisibilityData] = useState({
    number: "",
    key: 2,
  });

  const [infoData, setInfoData] = useState({
    visible: false,
    isDivisible: false,
    number: "",
    key: "",
    message: "",
  });

  const handleSubmit = () => {
    const { number, key } = divisibilityData;
    const data = checkDivisibility(number, key);
    setInfoData({ ...data, visible: true, number, key });
  };

  return (
    <div className="space-y-4">
      <BackButton />
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <TypographyH3>
            વિભાજ્યતાની ચાવી ચકાસો (Divisibility Check)
          </TypographyH3>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              type="number"
              placeholder="Enter number"
              onChange={(e) =>
                setDivisibilityData({
                  ...divisibilityData,
                  number: e.target.value,
                })
              }
            />
            <Select
              defaultValue={divisibilityData.key}
              onValueChange={(value) =>
                setDivisibilityData({
                  ...divisibilityData,
                  key: value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 10 }).map((_, i) => (
                  <SelectItem value={i + 2} key={i + 2}>
                    {i + 2} ની વિભાજ્યતાની ચાવી
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleSubmit}
              disabled={!String(divisibilityData.number).trim()}
            >
              <Check /> Check
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card
        className={clsx(
          "max-w-3xl mx-auto",
          !infoData.visible && "hidden",
          infoData.isDivisible
            ? "bg-green-900 text-green-50"
            : "bg-red-900 text-red-50"
        )}
      >
        <CardContent className="flex justify-between items-center">
          <div className="flex gap-3 items-center">
            <div>
              {infoData.isDivisible ? (
                <Smile className="size-12" />
              ) : (
                <Frown className="size-12" />
              )}
            </div>
            <div className="space-y-1.5">
              <TypographyLarge>
                {`${infoData.number} એ ${infoData.key} વડે વિભાજ્ય ${
                  infoData.isDivisible ? "છે" : "નથી"
                }.`}
              </TypographyLarge>
              <span>{infoData.message}</span>
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
    </div>
  );
}

export default DivisibilityCheck;
