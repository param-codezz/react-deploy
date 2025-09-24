// utils/placeValue.js

export function getPlaceValueData(num) {
  const numStr = String(num);
  if (!numStr || isNaN(Number(numStr))) {
    return [];
  }

  // Use an array of objects to store both Gujarati and English names
  const placeInfo = [
    { gu: "એકમ", en: "Ones" },
    { gu: "દશક", en: "Tens" },
    { gu: "સો", en: "Hundreds" },
    { gu: "હજાર", en: "Thousand" },
    { gu: "દસ હજાર", en: "Ten Thousand" },
    { gu: "લાખ", en: "Lakh" },
    { gu: "દસ લાખ", en: "Ten Lakh" },
    { gu: "કરોડ", en: "Crore" },
    { gu: "દસ કરોડ", en: "Ten Crore" },
    // You can extend this further if needed
  ];

  const reversedDigits = numStr.split("").reverse();
  const data = [];

  for (let i = 0; i < reversedDigits.length; i++) {
    const digit = reversedDigits[i];
    const placeData = placeInfo[i] || { gu: `10^${i}`, en: `PowerOf${i}` }; // Fallback
    const value = Number(digit) * Math.pow(10, i);

    data.push({
      digit: digit,
      place: placeData.gu, // Gujarati name for display
      placeKey: placeData.en, // English key for logic
      value: value,
      expandedForm: String(value),
    });
  }

  // Reverse back to the original order for display
  return data.reverse();
}

/**
 * Generates an array of objects representing the place value of each digit
 * in a number according to the International Numbering System (Millions, Billions).
 * @param {string | number} num - The number to analyze.
 * @returns {Array<{digit: string, place: string, value: number, expandedForm: string}>}
 */
export function getPlaceValueDataInternational(num) {
  const numStr = String(num);
  if (!numStr || isNaN(Number(numStr))) {
    return [];
  }

  // International place value names
  const placeNames = [
    "Ones",
    "Tens",
    "Hundreds",
    "Thousands",
    "Ten Thousands",
    "Hundred Thousands",
    "Millions",
    "Ten Millions",
    "Hundred Millions",
    "Billions",
  ];

  const reversedDigits = numStr.split("").reverse();
  const data = [];

  for (let i = 0; i < reversedDigits.length; i++) {
    const digit = reversedDigits[i];
    const place = placeNames[i] || `10^${i}`; // Fallback for very large numbers
    const value = Number(digit) * Math.pow(10, i);

    data.push({
      digit: digit,
      place: place,
      value: value,
      expandedForm: String(value),
    });
  }

  // Reverse back to the original order for display
  return data.reverse();
}
