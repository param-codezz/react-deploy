import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import VisualAddition from "@/components/ui/custom/Addition";
import { Input } from "@/components/ui/input";
import { Bot, X } from "lucide-react";
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
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function AdditionTab() {
  // How many numbers to generate: 2 or 3
  const [numCount, setNumCount] = useState(3);

  // Selected digits count string ("2", "3", ...)
  const [selectedDigits, setSelectedDigits] = useState(null);

  // Numbers stored dynamically based on count
  const [nums, setNums] = useState({ num1: "", num2: "", num3: "" });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [info, setInfo] = useState({});

  // Generate numbers on digit selection
  const onSelectDigits = (digitsStr) => {
    const digits = Number.parseInt(digitsStr);
    setSelectedDigits(digitsStr);

    // Generate numCount numbers
    const newNums = {};
    for (let i = 1; i <= numCount; i++) {
      newNums[`num${i}`] = generateNumber(digits).toString();
    }
    // Reset numbers beyond count
    if (numCount < 3) {
      newNums["num3"] = "";
    }
    setNums(newNums);
  };

  // Calculate button handler
  const onCalculate = () => {
    // Only proceed if at least two numbers are present
    if (nums.num1 && nums.num2) {
      setInfo({
        num1: nums.num1,
        num2: nums.num2,
        num3: numCount === 3 ? nums.num3 : "",
      });
      setIsDialogOpen(true);
    }
  };

  // Clear button handler
  const onClear = () => {
    setNums({ num1: "", num2: "", num3: "" });
    setSelectedDigits(null);
    setIsDialogOpen(false);
  };

  return (
    <Card className="h-full bg-card border border-border shadow-xl rounded-3xl flex flex-col overflow-hidden">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-card-foreground">
          સરવાળો (Addition)
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-y-auto space-y-4">
        {/* Number count selector */}
        <div className="flex gap-2 mb-2">
          <Button
            variant={numCount === 2 ? "default" : "outline"}
            onClick={() => setNumCount(2)}
          >
            2 Numbers
          </Button>
          <Button
            variant={numCount === 3 ? "default" : "outline"}
            onClick={() => setNumCount(3)}
          >
            3 Numbers
          </Button>
        </div>

        {/* Input fields */}
        <div className="flex gap-3 flex-wrap">
          <Input
            type="number"
            value={nums.num1}
            placeholder="સંખ્યા (Enter a number)"
            onChange={(e) =>
              setNums((prev) => ({ ...prev, num1: e.target.value }))
            }
          />
          <Input
            type="number"
            value={nums.num2}
            placeholder="સંખ્યા (Enter a number)"
            onChange={(e) =>
              setNums((prev) => ({ ...prev, num2: e.target.value }))
            }
          />
          {numCount === 3 && (
            <Input
              type="number"
              value={nums.num3}
              placeholder="સંખ્યા (Enter a number)"
              onChange={(e) =>
                setNums((prev) => ({ ...prev, num3: e.target.value }))
              }
            />
          )}
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
              Auto Generate {selectedDigits ? `- ${selectedDigits} digit` : ""}{" "}
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

        {/* Display generated numbers as outline buttons, pointer-events none */}
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
          {numCount === 3 && nums.num3 && (
            <Button variant="outline" className="pointer-events-none">
              {nums.num3}
            </Button>
          )}
        </div>

        {/* Visual addition dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Visual Addition</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center space-y-4">
              <VisualAddition
                showAnimationControls
                num1={info.num1}
                num2={info.num2}
                num3={info.num3 ?? ""}
              />
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
