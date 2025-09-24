import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import VisualDivision from "@/components/ui/custom/Division"; // Assuming this is the path to your VisualDivision component
import { Input } from "@/components/ui/input";
import { Bot, Divide } from "lucide-react"; // X icon is usually handled by Dialog component itself
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

const digitOptions = [
  { value: "1", label: "1 digit (Divisor)" }, // Divisor can be 1 digit
  { value: "2", label: "2 digit (Divisor)" },
  { value: "3", label: "3 digit (Divisor)" },
  { value: "4", label: "4 digit (Divisor)" },
  { value: "5", label: "5 digit (Divisor)" }, // Max 7 for divisor, 10 for dividend in VisualDivision
];

function generateNumber(digits) {
  if (digits <= 0) digits = 1; // Ensure at least 1 digit
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function DivisionTab() {
  // Selected digits count string for auto-generation ("1", "2", ...)
  const [selectedDigits, setSelectedDigits] = useState(null);

  // Numbers stored: dividend and divisor
  const [nums, setNums] = useState({ dividend: "", divisor: "" });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [info, setInfo] = useState({ dividend: "", divisor: "" });

  // Generate numbers on digit selection
  const onSelectDigits = (digitsStr) => {
    const digitsForDivisor = Number.parseInt(digitsStr);
    setSelectedDigits(digitsStr);

    let divisorNum = generateNumber(digitsForDivisor);

    // Determine digits for dividend to make it generally larger
    let digitsForDividend = digitsForDivisor;
    if (digitsForDivisor <= 2 && Math.random() < 0.8) {
      // For 1-2 digit divisors, 80% chance dividend has more digits
      digitsForDividend = Math.min(
        digitsForDivisor + Math.floor(Math.random() * 2) + 1,
        7
      ); // Add 1 or 2, cap at 7 for auto-gen
    } else if (digitsForDivisor <= 4 && Math.random() < 0.6) {
      // For 3-4 digit divisors, 60% chance
      digitsForDividend = Math.min(digitsForDivisor + 1, 7); // Add 1, cap at 7
    } else {
      // For 5 digit divisors
      digitsForDividend = Math.min(digitsForDivisor, 7); // Keep same or cap at 7
    }
    // Ensure dividend an divisor digits are within reasonable auto-gen limits
    digitsForDividend = Math.min(digitsForDividend, 7); // Max 7 for auto-gen dividend

    let dividendNum = generateNumber(digitsForDividend);

    // Ensure dividend >= divisor and dividend is not excessively large
    if (dividendNum < divisorNum) {
      // If dividend is smaller, make it a multiple of divisor + remainder
      dividendNum =
        divisorNum * (Math.floor(Math.random() * 9) + 1) +
        Math.floor(Math.random() * divisorNum);
    }

    // Cap auto-generated dividend length to prevent issues with very large numbers if logic above produces them
    const MAX_AUTOGEN_DIVIDEND_DIGITS = 7; // VisualDivision handles up to 10, but keep auto-gen tighter
    if (String(dividendNum).length > MAX_AUTOGEN_DIVIDEND_DIGITS) {
      dividendNum = parseInt(
        String(dividendNum).substring(0, MAX_AUTOGEN_DIVIDEND_DIGITS)
      );
      // If truncation made dividend smaller than divisor, set dividend = divisor
      if (dividendNum < divisorNum) {
        dividendNum = divisorNum;
      }
    }
    // Final check for divisor being 0, should not happen with generateNumber(>=1)
    if (divisorNum === 0) divisorNum = 1;

    setNums({
      dividend: dividendNum.toString(),
      divisor: divisorNum.toString(),
    });
  };

  // Calculate button handler
  const onCalculate = () => {
    if (nums.dividend && nums.divisor) {
      // Basic validation before opening dialog
      const dividendVal = Number(nums.dividend);
      const divisorVal = Number(nums.divisor);

      if (isNaN(dividendVal) || isNaN(divisorVal)) {
        alert("Please enter valid numbers for dividend and divisor.");
        return;
      }
      if (divisorVal === 0) {
        alert("Divisor cannot be zero.");
        return;
      }
      if (dividendVal < 0 || divisorVal < 0) {
        alert("Dividend and divisor must be non-negative.");
        return;
      }

      setInfo({
        dividend: nums.dividend,
        divisor: nums.divisor,
      });
      setIsDialogOpen(true);
    } else {
      alert("Please enter both dividend and divisor.");
    }
  };

  // Clear button handler
  const onClear = () => {
    setNums({ dividend: "", divisor: "" });
    setSelectedDigits(null);
    setIsDialogOpen(false);
    setInfo({ dividend: "", divisor: "" });
  };

  return (
    <Card className="h-full bg-card border border-border shadow-xl rounded-3xl flex flex-col overflow-hidden">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-card-foreground">
          ભાગાકાર (Division)
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-y-auto space-y-4 pt-3">
        {/* Input fields */}
        <div className="flex items-center gap-3">
          <Input
            type="number"
            value={nums.dividend}
            placeholder="સંખ્યા (Enter Number)"
            onChange={(e) =>
              setNums((prev) => ({ ...prev, dividend: e.target.value }))
            }
            min="0"
          />
          <div className="flex justify-center">
            <Divide />
          </div>
          <Input
            type="number"
            value={nums.divisor}
            placeholder="સંખ્યા (Enter Number)"
            onChange={(e) =>
              setNums((prev) => ({ ...prev, divisor: e.target.value }))
            }
            min="0" // Divisor can't be 0 in practice, handled by onCalculate
          />
        </div>
        <div className="flex gap-3 flex-wrap">
          <Button onClick={onCalculate}>Calculate</Button>
          <Button variant="secondary" onClick={onClear}>
            Clear
          </Button>
        </div>

        <Separator />

        {/* Digit count dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-full">
              Auto Generate Numbers
              {selectedDigits
                ? ` (Divisor: ${selectedDigits} digit${
                    selectedDigits === "1" ? "" : "s"
                  })`
                : ""}{" "}
              <Bot className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-[250px]">
            <DropdownMenuLabel>Divisor's Digits Count</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {digitOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => onSelectDigits(option.value)}
                className="cursor-pointer"
              >
                {option.label}
                {selectedDigits === option.value && (
                  <span className="ml-auto">✓</span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Display generated numbers as outline buttons, pointer-events none */}
        {(nums.dividend || nums.divisor) && (
          <div className="flex gap-2 flex-wrap pb-2 items-center">
            <span className="text-sm text-muted-foreground">Generated:</span>
            {nums.dividend && (
              <Button variant="outline" className="pointer-events-none">
                Dividend: {nums.dividend}
              </Button>
            )}
            {nums.divisor && (
              <Button variant="outline" className="pointer-events-none">
                Divisor: {nums.divisor}
              </Button>
            )}
          </div>
        )}

        {/* Visual division dialog */}
        <Dialog
          className="max-w-fit"
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        >
          <DialogContent>
            {" "}
            {/* Increased max-width for division layout */}
            <DialogHeader>
              <DialogTitle>Visual Division</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center space-y-4">
              {isDialogOpen && ( // Conditionally render to re-trigger memoization in VisualDivision if needed
                <VisualDivision
                  showAnimationControls
                  dividend={info.dividend}
                  divisor={info.divisor}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
