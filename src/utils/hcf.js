// src/utils/hcf.js

import { getPrimeFactorization } from "./primeFactorization";

/**
 * Calculates HCF of two numbers using Euclidean algorithm.
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
const calculateHCFForTwo = (a, b) => {
  let num1 = Math.abs(Math.floor(a));
  let num2 = Math.abs(Math.floor(b));
  while (num2) {
    [num1, num2] = [num2, num1 % num2];
  }
  return num1;
};

/**
 * Calculates HCF for an array of numbers using the iterative Euclidean algorithm.
 * @param {number[]} numbers - An array of numbers.
 * @returns {number | null} The HCF or null if input is invalid.
 */
export const calculateHCFByEuclidean = (numbers) => {
  if (!numbers || numbers.length < 2) {
    return null;
  }
  return numbers.reduce((a, b) => calculateHCFForTwo(a, b));
};

/**
 * Calculates HCF for an array of numbers using prime factorization.
 * @param {number[]} numbers - An array of numbers.
 * @returns {{hcf: number, factorizations: Map<number, Map<number, number>>, commonFactors: Map<number, number>}}
 */
export const calculateHCFByPrimeFactorization = (numbers) => {
  if (!numbers || numbers.length < 1) {
    return { hcf: 1, factorizations: new Map(), commonFactors: new Map() };
  }
  if (numbers.length === 1) {
    return {
      hcf: numbers[0],
      factorizations: new Map([
        [numbers[0], getPrimeFactorization(numbers[0])],
      ]),
      commonFactors: getPrimeFactorization(numbers[0]),
    };
  }

  const factorizations = new Map(
    numbers.map((n) => [n, getPrimeFactorization(n)])
  );

  const commonFactors = new Map();
  const firstNumFactors = factorizations.get(numbers[0]);

  // Find common prime bases and their minimum exponents
  firstNumFactors.forEach((exponent, prime) => {
    let minExponent = exponent;
    let isCommon = true;
    for (let i = 1; i < numbers.length; i++) {
      const otherFactors = factorizations.get(numbers[i]);
      if (!otherFactors.has(prime)) {
        isCommon = false;
        break;
      }
      minExponent = Math.min(minExponent, otherFactors.get(prime));
    }
    if (isCommon) {
      commonFactors.set(prime, minExponent);
    }
  });

  // Calculate HCF from common factors
  let hcf = 1;
  commonFactors.forEach((exponent, prime) => {
    hcf *= Math.pow(prime, exponent);
  });

  return { hcf, factorizations, commonFactors };
};
