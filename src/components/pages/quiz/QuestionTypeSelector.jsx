import React, { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const defaultTypes = [
  // ... your defaultTypes array remains unchanged
  { type: "ADDITION", name: "સરવાળો (Addition)", rounds: 0, enabled: false },
  {
    type: "SUBTRACTION",
    name: "બાદબાકી (Subtraction)",
    rounds: 0,
    enabled: false,
  },
  {
    type: "MULTIPLICATION",
    name: "ગુણાકાર (Multiplication)",
    rounds: 0,
    enabled: false,
  },
  { type: "DIVISION", name: "ભાગાકાર (Division)", rounds: 0, enabled: false },
  {
    type: "PRIME_CHECK",
    name: "અવિભાજ્ય સંખ્યા ચકાસો (Prime Number check)",
    rounds: 0,
    enabled: false,
  },
  {
    type: "DIVISIBILITY_CHECK",
    name: "વિભાજયતા ચકાસો (Divisibility)",
    rounds: 0,
    enabled: false,
  },
  {
    type: "SORT_NUMBERS",
    name: "ચડતા/ઉતરતા ક્રમમાં ગોઠવો (Sort Numbers)",
    rounds: 0,
    enabled: false,
  },
  {
    type: "NUMBER_TO_WORDS",
    name: "સંખ્યાને શબ્દમાં લખો (Number to Words)",
    rounds: 0,
    enabled: false,
  },
  {
    type: "WORDS_TO_NUMBER",
    name: "શબ્દ માંથી અંકમાં લખો (Words to Number)",
    rounds: 0,
    enabled: false,
  },
  {
    type: "PLACE_VALUE",
    name: "સ્થાનકિંમત (Place Value)",
    rounds: 0,
    enabled: false,
  },
  {
    type: "PRIME_FACTORIZATION",
    name: "અવિભાજ્ય અવયવો (Prime Factorization)",
    rounds: 0,
    enabled: false,
  },
];

export default function QuestionTypeSelector({ onChange, onGenerate }) {
  const [types, setTypes] = useState(defaultTypes);

  // The updateType function can remain the same, as our new logic
  // will be handled before calling it.
  const updateType = (index, updates) => {
    setTypes((prev) => {
      const updated = [...prev];
      let newType = { ...updated[index], ...updates };

      // This existing logic correctly handles disabling when rounds are 0
      if (newType.rounds <= 0) {
        newType.rounds = 0;
        newType.enabled = false;
      }

      updated[index] = newType;
      return updated;
    });
  };

  useEffect(() => {
    if (onChange) {
      const filtered = types
        .filter((q) => q.enabled)
        .map(({ type, rounds }) => ({ type, rounds }));
      onChange(filtered);
    }
  }, [types, onChange]);

  return (
    <div className="flex flex-col gap-2">
      {types.map((q, idx) => (
        <div
          key={q.type}
          className={`flex items-center justify-between rounded-sm gap-4 py-2 px-4 border ${
            q.enabled ? "bg-accent border-transparent" : "bg-none"
          }`}
        >
          <div className="flex items-center gap-2">
            <Checkbox
              checked={q.enabled}
              // --- MODIFICATION START ---
              onCheckedChange={(checked) => {
                if (checked) {
                  // If the box is now checked:
                  // - Enable it.
                  // - Set rounds to 1, but only if it was 0 before. This preserves
                  //   a user's custom round count if they uncheck and re-check.
                  updateType(idx, {
                    enabled: true,
                    rounds: q.rounds > 0 ? q.rounds : 1,
                  });
                } else {
                  // If the box is now unchecked:
                  // - Disable it.
                  // - Set rounds to 0.
                  updateType(idx, { enabled: false, rounds: 0 });
                }
              }}
              // --- MODIFICATION END ---
            />
            <span className="text-sm font-medium">{q.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateType(idx, { rounds: q.rounds - 1 })}
              disabled={!q.enabled} // Also disable if not enabled
            >
              −
            </Button>
            <span className="w-6 text-center">{q.rounds}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                updateType(idx, { rounds: q.rounds + 1, enabled: true })
              }
            >
              +
            </Button>
          </div>
        </div>
      ))}
      <Button onClick={onGenerate}>Generate</Button>
    </div>
  );
}
