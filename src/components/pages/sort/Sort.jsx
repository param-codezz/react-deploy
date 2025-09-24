import BackButton from "@/components/ui/backButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TypographyH3 } from "@/components/ui/typography";
import { Bot, Plus, X } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

const generateRandomFromPower = (termsLength, power) => {
  if (power < 1) power = 1;
  const min = Math.pow(10, power - 1);
  const max = Math.pow(10, power) - 1;
  return Array.from(
    { length: termsLength },
    () => Math.floor(Math.random() * (max - min + 1)) + min
  );
};

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Sort() {
  const [terms, setTerms] = useState([]);
  const [answerTerms, setAnswerTerms] = useState([]);
  const [digits, setDigits] = useState("4");
  const [isAscending, setIsAscending] = useState(false);
  const [termsLength, setTermsLength] = useState(5);

  const [mode, setMode] = useState("auto");
  const [manualTerms, setManualTerms] = useState([""]);

  const manualInputsContainerRef = useRef(null);

  const handleAutoClick = () => {
    setTerms([]);
    setAnswerTerms([]);
    const length = Number(termsLength);
    if (digits === "mix") {
      const t = Array.from({ length: length }, () => {
        const randomDigitCount = getRandomInt(1, 6);
        return generateRandomFromPower(1, randomDigitCount)[0];
      });
      setTerms(t);
    } else {
      const t = generateRandomFromPower(length, Number(digits));
      setTerms(t);
    }
  };

  const sortTerms = () => {
    const sourceTerms =
      mode === "auto"
        ? terms
        : manualTerms.filter((term) => term.trim() !== "").map(Number);

    const sortedTerms = [...sourceTerms].sort((a, b) => {
      return !isAscending ? a - b : b - a;
    });
    setAnswerTerms(sortedTerms);
  };

  const handleManualTermChange = (index, value) => {
    const newTerms = [...manualTerms];
    newTerms[index] = value;
    setManualTerms(newTerms);
  };

  const addManualField = () => {
    setManualTerms([...manualTerms, ""]);
  };

  const removeManualField = (index) => {
    if (manualTerms.length === 1) {
      setManualTerms([""]);
      return;
    }
    const newTerms = manualTerms.filter((_, i) => i !== index);
    setManualTerms(newTerms);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addManualField();
    }
  };

  useEffect(() => {
    if (mode === "manual" && manualInputsContainerRef.current) {
      const inputs = manualInputsContainerRef.current.querySelectorAll("input");
      if (inputs.length > 0) {
        inputs[inputs.length - 1].focus();
      }
    }
  }, [manualTerms.length, mode]);

  return (
    <div>
      <BackButton />
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <TypographyH3>ક્રમમાં ગોઠવો (Sort Numbers)</TypographyH3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Label>ચડતો ક્રમ</Label>
            <Switch
              className={"data-[state=unchecked]:bg-fuchsia-700"}
              checked={isAscending}
              onCheckedChange={(checked) => setIsAscending(checked)}
            />
            <Label>ઊતરતો ક્રમ</Label>
          </div>
          <Separator />

          <Tabs value={mode} onValueChange={setMode} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="auto">Auto Generate</TabsTrigger>
              <TabsTrigger value="manual">Manual Input</TabsTrigger>
            </TabsList>

            <TabsContent value="auto" className="pt-4">
              <div className="space-y-4">
                <Select onValueChange={setDigits} value={digits}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select digits..." />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 6 }, (_, i) => (
                      <SelectItem key={i + 1} value={String(i + 1)}>
                        {i + 1} અંક
                      </SelectItem>
                    ))}
                    <Separator />
                    <SelectItem value="mix">Mix</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="terms-length-input">
                    કેટલી સંખ્યા (Number of terms)
                  </Label>
                  <Input
                    id="terms-length-input"
                    type="number"
                    value={termsLength}
                    onChange={(e) => setTermsLength(Number(e.target.value))}
                  />
                </div>
                <Button onClick={handleAutoClick} className="w-full sm:w-auto">
                  <Bot className="mr-2 h-4 w-4" /> Auto Generate
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="manual" className="pt-4">
              <div className="space-y-2" ref={manualInputsContainerRef}>
                <Label>સંખ્યા દાખલ કરો (Enter your numbers)</Label>
                <div className="flex flex-wrap gap-2">
                  {manualTerms.map((term, index) => (
                    <div key={index} className="flex items-center">
                      <Input
                        className="max-w-[18ch]"
                        type="number"
                        value={term}
                        onChange={(e) =>
                          handleManualTermChange(index, e.target.value)
                        }
                        onKeyDown={handleKeyDown}
                        placeholder="Enter a number..."
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeManualField(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button variant="secondary" onClick={addManualField}>
                  <Plus />
                  સંખ્યા ઉમેરો
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <Separator />

          {((mode === "auto" && terms.length > 0) ||
            (mode === "manual" && manualTerms.some((t) => t !== ""))) && (
            <div className="space-y-2">
              <Label>દાખલ કરેલા નંબરો (Entered Numbers)</Label>
              <div className="flex flex-wrap gap-2">
                {(mode === "auto"
                  ? terms
                  : manualTerms.filter((t) => t !== "")
                ).map((term, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="pointer-events-none"
                  >
                    {term}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <Separator />

          <Button
            onClick={sortTerms}
            disabled={
              (mode === "auto" && terms.length === 0) ||
              (mode === "manual" && manualTerms.every((t) => t === ""))
            }
          >
            જવાબ (Display answer)
          </Button>

          {answerTerms.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {answerTerms.map((term, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="pointer-events-none"
                >
                  {term}
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Sort;
