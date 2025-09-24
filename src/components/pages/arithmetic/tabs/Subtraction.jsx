import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import VisualSubtraction from "@/components/ui/custom/Subtraction"; // Ensure this path is correct
import { Input } from "@/components/ui/input";
import { Bot, Minus } from "lucide-react"; // Bot and Minus icons
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
  { value: "2", label: "2 digit" },
  { value: "3", label: "3 digit" },
  { value: "4", label: "4 digit" },
  { value: "5", label: "5 digit" },
];

function generateNumber(digits) {
  if (digits <= 0) return 0;
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function SubtractionTab() {
  const [selectedDigits, setSelectedDigits] = useState(null);
  const [nums, setNums] = useState({ num1: "", num2: "" }); // Only two numbers needed
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [info, setInfo] = useState({}); // Will hold num1 and num2 for the dialog

  const onSelectDigits = (digitsStr) => {
    const digits = Number.parseInt(digitsStr);
    if (isNaN(digits) || digits <= 0) return;

    setSelectedDigits(digitsStr);
    let n1 = generateNumber(digits);
    let n2 = generateNumber(digits);

    // Ensure num1 >= num2 for standard subtraction visualization
    if (n1 < n2) {
      [n1, n2] = [n2, n1]; // Swap
    }
    setNums({
      num1: n1.toString(),
      num2: n2.toString(),
    });
  };

  const onCalculate = () => {
    if (nums.num1 && nums.num2) {
      const n1 = parseFloat(nums.num1);
      const n2 = parseFloat(nums.num2);

      if (isNaN(n1) || isNaN(n2)) {
        alert("Please enter valid numbers.");
        return;
      }

      if (n1 < n2) {
        alert(
          "For subtraction, Number 1 must be greater than or equal to Number 2."
        );
        return;
      }
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
          બાદબાકી (Subtraction)
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-y-auto space-y-6 flex-grow flex flex-col pt-6">
        {/* Input fields */}
        <div className="space-y-3">
          <Input
            type="number"
            value={nums.num1}
            placeholder="સંખ્યા (Enter Number)"
            onChange={(e) =>
              setNums((prev) => ({ ...prev, num1: e.target.value }))
            }
            aria-label="Number 1"
          />
          <Input
            type="number"
            value={nums.num2}
            placeholder="સંખ્યા (Enter Number)"
            onChange={(e) =>
              setNums((prev) => ({ ...prev, num2: e.target.value }))
            }
            aria-label="Number 2"
          />
        </div>
        <div className="flex gap-3 flex-wrap mt-3">
          <Button onClick={onCalculate} className="flex-grow sm:flex-grow-0">
            Subtract
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

        {/* Digit count dropdown */}
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

        {/* Display generated/entered numbers */}
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
          {" "}
          {/* Pushes dialog to bottom if content is short */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
              {" "}
              {/* Responsive width */}
              <DialogHeader>
                <DialogTitle>Visual Subtraction</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center space-y-4 py-4">
                <VisualSubtraction
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
