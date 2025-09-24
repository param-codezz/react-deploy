import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Bot, FunctionSquare } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import VisualPrimeFactorization from "@/components/ui/custom/PrimeFactorization";
import BackButton from "@/components/ui/backButton";

const digitOptions = [
  { value: "2", label: "2 digit (e.g., 90)" },
  { value: "3", label: "3 digit (e.g., 360)" },
  { value: "4", label: "4 digit (e.g., 1234)" },
  { value: "5", label: "5 digit (e.g., 54321)" },
];

function generateNumber(digits) {
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function PrimeFactorizationTab() {
  // The number to be factorized
  const [number, setNumber] = useState("");

  // Selected digits count string for auto-generation ("2", "3", ...)
  const [selectedDigits, setSelectedDigits] = useState(null);

  // State to control the visualization dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [info, setInfo] = useState({ number: "" });

  // Generate a number based on selected digit count
  const onSelectDigits = (digitsStr) => {
    const digits = Number.parseInt(digitsStr);
    setSelectedDigits(digitsStr);
    setNumber(generateNumber(digits).toString());
  };

  // Factorize button handler
  const onFactorize = () => {
    // Only proceed if a valid number is present
    const numValue = Number(number);
    if (number && !isNaN(numValue) && numValue > 1) {
      setInfo({ number: number });
    } else {
      alert("Please enter an integer greater than 1.");
    }
  };

  // Clear button handler
  const onClear = () => {
    setNumber("");
    setSelectedDigits(null);
    setIsDialogOpen(false);
  };

  return (
    <div className="max-w-3xl mx-auto mb-10 space-y-4">
      <BackButton />
      <Card className="">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-card-foreground">
            અવિભાજ્ય અવયવો પાડો (Prime Factorization)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Input field */}
          <div className="flex gap-3 flex-wrap">
            <Input
              type="number"
              value={number}
              placeholder="સંખ્યા (Enter a number)"
              onChange={(e) => setNumber(e.target.value)}
            />
            <Button onClick={onFactorize} disabled={!number.trim()}>
              Factorize <FunctionSquare className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="secondary" onClick={onClear}>
              Clear
            </Button>
          </div>
          <Separator />
          {/* Digit count dropdown for auto-generation */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="w-full">
                Auto Generate{" "}
                {selectedDigits ? `- ${selectedDigits} digit` : ""}{" "}
                <Bot className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[220px]">
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
          {/* Display generated number */}
          <div className="flex gap-2 flex-wrap pb-2 min-h-[42px]">
            {number && (
              <Badge variant="secondary" className="text-lg p-2">
                Number: {number}
              </Badge>
            )}
          </div>

          {info.number && (
            <VisualPrimeFactorization
              showAnimationControls={false}
              number={info.number}
            />
          )}

          {/* Visual factorization dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Visual Prime Factorization</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center space-y-4">
                <VisualPrimeFactorization
                  showAnimationControls
                  number={info.number}
                />
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
