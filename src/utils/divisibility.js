import { divisibilityMap } from "@/assets/constants";

export default function checkDivisibility(num, key) {
  const isDivisible = BigInt(num) % BigInt(key) === 0n;
  return {
    isDivisible,
    message: divisibilityMap[key],
  };
}