import VisualAddition from "@/components/ui/custom/Addition";
import { FixedStepSlider } from "@/components/ui/custom/CustomSlider";
import React, { useState } from "react";

function Playground() {
  const [val, setVal] = useState(0);
  return (
    <div>
      <FixedStepSlider onChange={(val) => setVal(val)} value={val} />
    </div>
  );
}

export default Playground;
