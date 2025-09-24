import BackButton from "@/components/ui/backButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { TypographyH3 } from "@/components/ui/typography";
import {
  gujaratiWordsToNumber,
  numberToGujaratiWords,
} from "@/utils/numberName";
import React, { useState, useEffect } from "react"; // Added useEffect

function NumberNames() {
  const [mode, setMode] = useState("numToWord");
  const [inputValue, setInputValue] = useState("");
  const [outputValue, setOutputValue] = useState("");
  const [error, setError] = useState("");

  // State for the new hidden input feature
  const [hiddenInputOn, setHiddenInputOn] = useState(false);
  const [hiddenInput, setHiddenInput] = useState("");

  // This effect handles the real-time translation for the hidden input mode
  useEffect(() => {
    // Only run if the hidden input mode is active in the correct tab
    if (hiddenInputOn && mode === "wordToNum") {
      // If the numeric input is empty, clear the textarea
      if (hiddenInput.trim() === "") {
        setInputValue("");
        return;
      }

      const result = numberToGujaratiWords(hiddenInput);

      // Only update the textarea if the conversion is successful
      if (!result.includes("Error") && !result.includes("કૃપા")) {
        setInputValue(result);
        setError(""); // Clear any previous errors
      } else {
        // If the number is invalid (e.g., too long), show an error
        setInputValue("");
        setError("Invalid number for hidden input.");
      }
    }
  }, [hiddenInput, hiddenInputOn, mode]);

  const handleConvert = () => {
    setOutputValue("");
    setError("");

    if (mode === "numToWord") {
      const result = numberToGujaratiWords(inputValue);
      if (result.includes("Error") || result.includes("કૃપા")) {
        setError(result);
      } else {
        setOutputValue(result);
      }
    } else {
      // mode === 'wordToNum'
      // This logic now works for both manual and hidden-input-generated text
      const result = gujaratiWordsToNumber(inputValue);
      if (typeof result === "string") {
        setError(result);
      } else {
        setOutputValue(String(result));
      }
    }
  };

  // Resets state when switching tabs
  const handleModeChange = (newMode) => {
    setMode(newMode);
    setInputValue("");
    setOutputValue("");
    setError("");
    setHiddenInputOn(false); // Also turn off hidden mode
    setHiddenInput("");
  };

  // Resets state when toggling the hidden input switch
  const handleHiddenInputToggle = (checked) => {
    setHiddenInputOn(checked);
    setInputValue("");
    setOutputValue("");
    setHiddenInput("");
    setError("");
  };

  return (
    <div>
      <BackButton />
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <TypographyH3>સંખ્યા અને શબ્દો</TypographyH3>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs
            value={mode}
            onValueChange={handleModeChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="numToWord">સંખ્યા થી શબ્દો</TabsTrigger>
              <TabsTrigger value="wordToNum">શબ્દો થી સંખ્યા</TabsTrigger>
            </TabsList>

            <TabsContent value="numToWord" className="mt-4">
              <div className="space-y-2">
                <Label htmlFor="number-input">
                  સંખ્યા (Enter a number up to 9 digits)
                </Label>
                <Input
                  id="number-input"
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="દા.ત. 12345"
                />
              </div>
            </TabsContent>

            <TabsContent value="wordToNum" className="mt-4">
              {/* --- NEW HIDDEN INPUT FEATURE UI --- */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Switch
                    id="hidden-input-switch"
                    checked={hiddenInputOn}
                    onCheckedChange={handleHiddenInputToggle}
                  />
                  <Label htmlFor="hidden-input-switch">Practice Mode</Label>
                </div>

                {hiddenInputOn && (
                  <div className="space-y-2">
                    <Label htmlFor="hidden-number-input">સંખ્યા</Label>
                    <Input
                      id="hidden-number-input"
                      type="password"
                      value={hiddenInput}
                      onChange={(event) => setHiddenInput(event.target.value)}
                      placeholder="e.g., 456"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="words-input">શબ્દો</Label>
                  <Textarea
                    id="words-input"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="દા.ત. એક સો ને એક"
                    rows={3}
                    readOnly={hiddenInputOn} // Make textarea read-only in hidden mode
                  />
                </div>
              </div>
              {/* --- END OF FEATURE --- */}
            </TabsContent>
          </Tabs>

          <Button
            onClick={handleConvert}
            className="w-full sm:w-auto"
            disabled={!inputValue.trim()}
          >
            Convert
          </Button>

          <Separator />

          {(outputValue || error) && (
            <div className="space-y-2">
              <Label>Result</Label>
              {error ? (
                <div className="p-4 border border-destructive/50 bg-destructive/10 text-destructive rounded-md">
                  {error}
                </div>
              ) : (
                <div className="p-4 border bg-accent text-accent-foreground rounded-md text-lg font-semibold">
                  {outputValue}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default NumberNames;
