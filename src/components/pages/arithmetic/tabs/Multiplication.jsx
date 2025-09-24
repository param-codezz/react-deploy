import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import VisualMultiplication from "@/components/ui/custom/Multiplication"; // Ensure this path is correct
import { Input } from "@/components/ui/input";
import { Bot, X as MultiplyIcon } from "lucide-react"; // Renamed X to MultiplyIcon for clarity
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
  { value: "1", label: "1 digit" }, // Added for smaller multiplications
  { value: "2", label: "2 digit" },
  { value: "3", label: "3 digit" },
  // For multiplication, larger digits can lead to very wide displays.
  // Consider limiting these if display becomes an issue.
  // { value: "4", label: "4 digit" },
  // { value: "5", label: "5 digit" },
];

function generateNumber(digits) {
  if (digits <= 0) return 0;
  const min = digits === 1 ? 0 : Math.pow(10, digits - 1); // Allow single digit numbers to be 0-9
  const max = Math.pow(10, digits) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function MultiplicationTab() {
  const [selectedDigits, setSelectedDigits] = useState(null);
  const [nums, setNums] = useState({ num1: "", num2: "" });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [info, setInfo] = useState({});

  const onSelectDigits = (digitsStr) => {
    const digits = Number.parseInt(digitsStr);
    if (isNaN(digits) || digits <= 0) return;

    setSelectedDigits(digitsStr);
    let n1 = generateNumber(digits);
    let n2 = generateNumber(digits);

    // For multiplication, order doesn't strictly matter for the result,
    // but visually some prefer larger number on top.
    // The VisualMultiplication component handles them as num1 (top) and num2 (bottom).
    // No specific order enforcement needed here for correctness.
    setNums({
      num1: n1.toString(),
      num2: n2.toString(),
    });
  };

  const onCalculate = () => {
    if (nums.num1 && nums.num2) {
      const n1Val = parseFloat(nums.num1);
      const n2Val = parseFloat(nums.num2);

      if (isNaN(n1Val) || isNaN(n2Val)) {
        alert("Please enter valid numbers.");
        return;
      }
      if (n1Val < 0 || n2Val < 0) {
        alert("Please enter non-negative numbers for multiplication.");
        return;
      }

      // The VisualMultiplication component has its own internal checks for number size.
      setInfo({
        num1: nums.num1,
        num2: nums.num2,
      });
      setIsDialogOpen(true);
    } else {
      alert("Please enter both numbers.");
    }
  };

  const onClear = (closeDialog = true) => {
    setNums({ num1: "", num2: "" });
    setSelectedDigits(null);
    if (closeDialog) {
      setIsDialogOpen(false);
    }
  };

  return (
    <Card className="h-full bg-card border border-border shadow-xl rounded-3xl flex flex-col overflow-hidden">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-card-foreground flex items-center">
          ગુણાકાર (Multiplication)
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-y-auto space-y-6 flex-grow flex flex-col pt-6">
        <div className="space-y-3">
          <Input
            type="number"
            value={nums.num1}
            placeholder="સંખ્યા (Enter Number)"
            onChange={(e) =>
              setNums((prev) => ({ ...prev, num1: e.target.value }))
            }
            aria-label="Number 1"
            min="0" // HTML5 validation for non-negative
          />
          <Input
            type="number"
            value={nums.num2}
            placeholder="સંખ્યા (Enter Number)"
            onChange={(e) =>
              setNums((prev) => ({ ...prev, num2: e.target.value }))
            }
            aria-label="Number 2"
            min="0" // HTML5 validation for non-negative
          />
        </div>
        <div className="flex gap-3 flex-wrap mt-3">
          <Button onClick={onCalculate} className="flex-grow sm:flex-grow-0">
            Multiply
          </Button>
          <Button
            variant="secondary"
            onClick={() => onClear()}
            className="flex-grow sm:flex-grow-0"
          >
            Clear All
          </Button>
        </div>

        <Separator className="my-4" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-full">
              Auto Generate Numbers
              {selectedDigits ? ` - ${selectedDigits} digit` : ""}
              <Bot className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-[200px]">
            <DropdownMenuLabel>Select digits count</DropdownMenuLabel>
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

        {(nums.num1 || nums.num2) && (
          <div className="mt-2">
            <p className="text-sm text-muted-foreground mb-1">
              Current Numbers:
            </p>
            <div className="flex gap-2 flex-wrap pb-2">
              {nums.num1 && (
                <Button variant="outline" className="pointer-events-none">
                  {nums.num1}
                </Button>
              )}
              {nums.num2 && (
                <Button variant="outline" className="pointer-events-none">
                  {nums.num2}
                </Button>
              )}
            </div>
          </div>
        )}

        <div className="mt-auto">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            {/* Adjusted DialogContent size for potentially wider multiplication display */}
            <DialogContent className="max-w-md sm:max-w-lg md:max-w-xl lg:max-w-3xl xl:max-w-4xl">
              <DialogHeader>
                <DialogTitle>Visual Multiplication</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center space-y-4 py-4">
                <VisualMultiplication
                  showAnimationControls
                  num1={info.num1 || ""}
                  num2={info.num2 || ""}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
