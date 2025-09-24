// /utils/primeFactorization.js

/**
 * Generates step-by-step instructions for the division method of prime factorization.
 * @param {number} num - The number to factorize.
 * @returns {Array<object>} An array of step objects for the animation.
 */
export const getPrimeFactorizationSteps = (num) => {
  const nInt = Number(num);
  if (isNaN(nInt) || !Number.isInteger(nInt) || nInt < 2) {
    return {
      error: "Please enter an integer greater than 1.",
      steps: [],
    };
  }

  let steps = [];
  let completedRows = [];
  let n = nInt;
  let d = 2;

  // Initial step: Just the number itself
  steps.push({
    rows: [],
    currentNumber: n,
    currentDivisor: null,
    highlight: null,
    stepMessage: `Let's find the prime factors of ${n}.`,
    isFinal: false,
    finalFactors: [],
  });

  while (n > 1) {
    // Step: Trying a divisor
    steps.push({
      rows: [...completedRows],
      currentNumber: n,
      currentDivisor: d,
      highlight: "divisor",
      stepMessage: `Is ${n} divisible by ${d}?`,
      isFinal: false,
      finalFactors: completedRows.map((r) => r.divisor),
    });

    if (n % d === 0) {
      const prevN = n;
      completedRows.push({ divisor: d, number: prevN });
      n /= d;

      // Step: Success! Show the result
      steps.push({
        rows: [...completedRows],
        currentNumber: n,
        currentDivisor: null,
        highlight: "number",
        stepMessage: `Yes. ${prevN} ÷ ${d} = ${n}. Found factor: ${d}.`,
        isFinal: false,
        finalFactors: completedRows.map((r) => r.divisor),
      });
    } else {
      // Move to the next potential divisor
      d = d === 2 ? 3 : d + 2;
      // If our divisor exceeds the number, the number itself must be prime
      if (d > n) {
        completedRows.push({ divisor: n, number: n });
        n = 1;
      }
    }
  }

  // Final step showing the '1'
  steps.push({
    rows: [...completedRows],
    currentNumber: 1,
    currentDivisor: null,
    highlight: "number",
    stepMessage: "The process is complete.",
    isFinal: false,
    finalFactors: completedRows.map((r) => r.divisor),
  });

  // Summary step
  const finalFactors = completedRows.map((r) => r.divisor);
  steps.push({
    rows: [...completedRows],
    currentNumber: 1,
    currentDivisor: null,
    highlight: null,
    stepMessage: `Prime factorization of ${nInt} = ${finalFactors.join(
      " × "
    )}.`,
    isFinal: true,
    finalFactors: finalFactors,
  });

  return { error: null, steps };
};

// src/utils/primeFactorization.js

/**
 * Calculates the prime factors of a given number.
 * @param {number} num The number to factorize.
 * @returns {number[]} An array of prime factors.
 */
export function getPrimeFactorization(num) {
  const n = Math.abs(Number(num));
  if (isNaN(n) || n < 2) {
    return [];
  }

  const factors = [];
  let divisor = 2;

  let tempNum = n;
  while (tempNum % 2 === 0) {
    factors.push(2);
    tempNum /= 2;
  }

  divisor = 3;
  while (divisor * divisor <= tempNum) {
    while (tempNum % divisor === 0) {
      factors.push(divisor);
      tempNum /= divisor;
    }
    divisor += 2;
  }

  if (tempNum > 1) {
    factors.push(tempNum);
  }

  return factors;
}
