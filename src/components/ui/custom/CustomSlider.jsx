import * as React from "react";
import { Slider } from "@/components/ui/slider";

const allowedValues = [10, 20, 30, 40, 50];

export function FixedStepSlider({ value, onChange }) {
  const index = allowedValues.indexOf(value);

  const handleChange = (val) => {
    const nearestIndex = Math.round(val[0]);
    const clampedIndex = Math.max(
      0,
      Math.min(nearestIndex, allowedValues.length - 1)
    );
    onChange(allowedValues[clampedIndex]);
  };

  return (
    <div className="flex flex-col gap-2 w-full max-w-md">
      <Slider
        value={[index]}
        min={0}
        max={allowedValues.length - 1}
        step={1}
        onValueChange={handleChange}
      />
      <div className="text-sm text-muted-foreground">Selected: {value}</div>
    </div>
  );
}
