// function getRandomInt(min, max) {
//   min = Math.ceil(min);
//   max = Math.floor(max);
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// export const Difficulty = {
//   EASY: 1,
//   MEDIUM: 2,
//   HARD: 3,
//   CUSTOM: 4,
// };

// const getRandomFromRanges = (ranges) => {
//   const choice = ranges[Math.floor(Math.random() * ranges.length)];
//   return choice;
// };

// function getRangeByDifficulty(level, type = null) {
//   if (level === Difficulty.CUSTOM) {
//     const customRanges = {
//       ADDITION: getRandomFromRanges([
//         [1000, 9999],
//         [10000, 99999],
//       ]),
//       SUBTRACTION: getRandomFromRanges([
//         [1000, 9999],
//         [10000, 99999],
//       ]),
//       MULTIPLICATION: getRandomFromRanges([
//         [100, 999],
//         [1000, 9999],
//       ]),
//       DIVISION: getRandomFromRanges([
//         [100, 999],
//         [1000, 9999],
//       ]),
//     };

//     return customRanges[type] || [1, 10];
//   }

//   switch (level) {
//     case Difficulty.EASY:
//       return [1, 10];
//     case Difficulty.MEDIUM:
//       return [10, 50];
//     case Difficulty.HARD:
//       return [50, 100];
//     default:
//       return [1, 10];
//   }
// }

// function generateOptions(correctAnswer, difficulty) {
//   const spread =
//     {
//       [Difficulty.EASY]: 10,
//       [Difficulty.MEDIUM]: 5,
//       [Difficulty.HARD]: 2,
//       [Difficulty.CUSTOM]: 20, // or some default
//     }[difficulty] || 10;

//   const options = new Set();
//   options.add(correctAnswer);

//   let retries = 0;
//   const MAX_RETRIES = 50;

//   while (options.size < 4 && retries < MAX_RETRIES) {
//     const offset = getRandomInt(-spread, spread);
//     const option = correctAnswer + offset;
//     if (option !== correctAnswer && option > 0) {
//       options.add(option);
//     }
//     retries++;
//   }

//   while (options.size < 4) {
//     const fallback = correctAnswer + getRandomInt(1, spread * 2);
//     options.add(fallback);
//   }

//   const optionsArray = Array.from(options);

//   for (let i = optionsArray.length - 1; i > 0; i--) {
//     const j = getRandomInt(0, i);
//     [optionsArray[i], optionsArray[j]] = [optionsArray[j], optionsArray[i]];
//   }

//   return {
//     options: optionsArray,
//     correctIndex: optionsArray.indexOf(correctAnswer),
//   };
// }

// export function generateQuestionSet(questionTypes, difficulty) {
//   const questionCpy = [...questionTypes];
//   const questions = [];

//   while (questionCpy.length > 0) {
//     const choice = getRandomInt(0, questionCpy.length - 1);
//     const selected = questionCpy[choice];

//     for (let i = 0; i < selected.rounds; i++) {
//       const [min, max] = getRangeByDifficulty(difficulty, selected.type);

//       let a = 0;
//       let b = 0;
//       let questionText = "";
//       let answer = 0;
//       let questionRaw = 0;

//       switch (selected.type) {
//         case "ADDITION":
//           a = getRandomInt(min, max);
//           b = getRandomInt(min, max);
//           answer = a + b;
//           questionText = `${a} + ${b} = _____`;
//           questionRaw = { a, b };
//           break;

//         case "SUBTRACTION":
//           b = getRandomInt(min, max);
//           a = getRandomInt(b + 1, max);
//           answer = a - b;
//           questionText = `${a} - ${b} = _____`;
//           questionRaw = { a, b };
//           break;

//         case "MULTIPLICATION":
//           a = getRandomInt(min, max);
//           b = getRandomInt(2, 99);
//           answer = a * b;
//           questionText = `${a} × ${b} = _____`;
//           questionRaw = { a, b };
//           break;

//         case "DIVISION":
//           a = getRandomInt(min, max);
//           b = getRandomInt(3, 20);
//           answer = Math.floor(a / b);
//           questionText = `${a} ÷ ${b} = _____`;
//           questionRaw = { a, b };
//           questionRaw = { a, b };
//           break;
//       }

//       if (difficulty === Difficulty.CUSTOM) {
//         questions.push({
//           type: selected.type,
//           question: questionText,
//           correctAnswer: answer,
//           options: null,
//           questionRaw,
//         });
//       } else {
//         const { options, correctIndex } = generateOptions(answer, difficulty);
//         questions.push({
//           type: selected.type,
//           question: questionText,
//           correctAnswer: correctIndex,
//           options,
//           questionRaw,
//         });
//       }
//     }

//     questionCpy.splice(choice, 1);
//   }

//   return questions;
// }

import { numberToGujaratiWords, gujaratiWordsToNumber } from "../numberName";
import { getPlaceValueData } from "../placeValue";
import { checkPrimeNumber } from "../primeNumber";

/**
 * Generates a random integer between min (inclusive) and max (inclusive).
 */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getPrimeFactors(num) {
  const factors = [];
  let d = 2;
  let n = num;
  while (n >= 2) {
    if (n % d === 0) {
      factors.push(d);
      n = n / d;
    } else {
      d++;
    }
  }
  return factors;
}

/**
 * Difficulty levels for the quiz.
 */
export const Difficulty = {
  EASY: 1,
  MEDIUM: 2,
  HARD: 3,
  CUSTOM: 4,
};

/**
 * Selects a random range array from an array of ranges.
 * @param {Array<[number, number]>} ranges - e.g., [[1, 10], [100, 200]]
 * @returns {[number, number]} - e.g., [1, 10]
 */
const getRandomFromRanges = (ranges) => {
  const choice = ranges[Math.floor(Math.random() * ranges.length)];
  return choice;
};

/**
 * Determines the number range for a question based on difficulty and type.
 * This version is corrected to prevent NaN errors in CUSTOM difficulty.
 */
function getRangeByDifficulty(level, type = null) {
  // Handle standard difficulties first
  if (level !== Difficulty.CUSTOM) {
    switch (level) {
      case Difficulty.EASY:
        return [1, 100];
      case Difficulty.MEDIUM:
        return [100, 1000];
      case Difficulty.HARD:
        return [1000, 10000];
      default:
        return [1, 10];
    }
  }

  // --- Refactored CUSTOM difficulty logic ---
  // This object stores the list of possible ranges for each type.
  const customRanges = {
    ADDITION: [
      [1000, 9999],
      [10000, 99999],
    ],
    SUBTRACTION: [
      [1000, 9999],
      [10000, 99999],
    ],
    MULTIPLICATION: [
      [100, 999],
      [1000, 9999],
    ],
    DIVISION: [
      [100, 999],
      [1000, 9999],
    ],
    PRIME_CHECK: [[1, 1000]],
    WORDS_TO_NUMBER: [[100, 99999]],
    NUMBER_TO_WORDS: [[100, 99999]],
    DIVISIBILITY_CHECK: [[100, 99999]],
    SORT_NUMBERS: [[10, 999]],
    PLACE_VALUE: [[100, 99999]],
    PRIME_FACTORIZATION: [[10, 1000]],
  };

  const rangesForType = customRanges[type];

  // If ranges are defined for the type, pick one randomly.
  if (rangesForType) {
    return getRandomFromRanges(rangesForType);
  } else {
    return [1, 10]; // Fallback for any undefined type
  }
}

/**
 * Generates 3 incorrect multiple-choice options around a correct answer.
 */
function generateOptions(correctAnswer, difficulty) {
  const spread =
    {
      [Difficulty.EASY]: 10,
      [Difficulty.MEDIUM]: 5,
      [Difficulty.HARD]: 2,
      [Difficulty.CUSTOM]: 20, // or some default
    }[difficulty] || 10;

  const options = new Set();
  options.add(correctAnswer);

  let retries = 0;
  const MAX_RETRIES = 50;

  // Try to generate options close to the answer
  while (options.size < 4 && retries < MAX_RETRIES) {
    const offset = getRandomInt(-spread, spread);
    const option = correctAnswer + offset;
    if (option !== correctAnswer && option >= 0) {
      // Allow 0 as an option
      options.add(option);
    }
    retries++;
  }

  // If still not enough options, add more with a wider spread
  while (options.size < 4) {
    const fallback = correctAnswer + getRandomInt(1, spread * 2);
    options.add(fallback);
  }

  const optionsArray = Array.from(options);

  // Fisher-Yates shuffle
  for (let i = optionsArray.length - 1; i > 0; i--) {
    const j = getRandomInt(0, i);
    [optionsArray[i], optionsArray[j]] = [optionsArray[j], optionsArray[i]];
  }

  return {
    options: optionsArray,
    correctIndex: optionsArray.indexOf(correctAnswer),
  };
}

/**
 * The main function to generate a set of questions based on selected types and difficulty.
 */
export function generateQuestionSet(questionTypes, difficulty) {
  const questionCpy = [...questionTypes];
  const questions = [];

  while (questionCpy.length > 0) {
    const choice = getRandomInt(0, questionCpy.length - 1);
    const selected = questionCpy[choice];

    for (let i = 0; i < selected.rounds; i++) {
      const [min, max] = getRangeByDifficulty(difficulty, selected.type);

      let a = 0,
        b = 0;
      let questionText = "";
      let answer; // Can be number, string, or boolean
      let questionRaw = {};
      let options = null;
      let correctIndex = -1;

      switch (selected.type) {
        case "ADDITION":
          a = getRandomInt(min, max);
          b = getRandomInt(min, max);
          answer = a + b;
          questionText = `${a} + ${b} = _____`;
          questionRaw = { a, b };
          break;

        case "SUBTRACTION":
          b = getRandomInt(min, max);
          a = getRandomInt(b + 1, max + b);
          answer = a - b;
          questionText = `${a} - ${b} = _____`;
          questionRaw = { a, b };
          break;

        case "MULTIPLICATION":
          a = getRandomInt(min, max);
          b = getRandomInt(2, 99);
          answer = a * b;
          questionText = `${a} × ${b} = _____`;
          questionRaw = { a, b };
          break;

        case "DIVISION":
          b = getRandomInt(3, 20);
          const tempAnswer = getRandomInt(
            Math.max(1, Math.floor(min / b)),
            Math.floor(max / b)
          );
          a = b * tempAnswer;
          answer = tempAnswer;
          questionText = `${a} ÷ ${b} = _____`;
          questionRaw = { a, b };
          break;

        case "PRIME_CHECK":
          a = getRandomInt(Math.max(2, min), max);
          answer = checkPrimeNumber(a);
          questionText = `શું ${a} એ અવિભાજ્ય સંખ્યા છે?`;
          questionRaw = { a };
          if (difficulty !== Difficulty.CUSTOM) {
            options = ["હા (Yes)", "ના (No)"];
            correctIndex = answer ? 0 : 1;
          }
          break;

        case "WORDS_TO_NUMBER":
          a = getRandomInt(min, max);
          const gujaratiWord = numberToGujaratiWords(a);
          answer = a;
          questionText = `"${gujaratiWord}" ને અંકોમાં લખો. (Convert to number)`;
          questionRaw = { word: gujaratiWord };
          break;

        case "NUMBER_TO_WORDS":
          a = getRandomInt(min, max);
          answer = numberToGujaratiWords(a);
          questionText = `${a} ને શબ્દોમાં લખો. (Convert to words)`;
          questionRaw = { number: a };
          if (difficulty !== Difficulty.CUSTOM) {
            const optionSet = new Set([answer]);
            while (optionSet.size < 4) {
              const offset = getRandomInt(-10, 10) || getRandomInt(1, 5);
              const wrongNum = a + offset;
              if (wrongNum > 0 && wrongNum !== a) {
                optionSet.add(numberToGujaratiWords(wrongNum));
              }
            }
            const shuffledOptions = Array.from(optionSet).sort(
              () => Math.random() - 0.5
            );
            options = shuffledOptions;
            correctIndex = shuffledOptions.indexOf(answer);
          }
          break;

        case "DIVISIBILITY_CHECK":
          const divisors = [2, 3, 4, 5, 6, 8, 9, 10, 11];
          b = divisors[getRandomInt(0, divisors.length - 1)];
          a = getRandomInt(min, max);
          answer = a % b === 0;
          questionText = `શું ${a} એ ${b} વડે વિભાજ્ય છે?`;
          questionRaw = { a, b };
          if (difficulty !== Difficulty.CUSTOM) {
            options = ["હા (Yes)", "ના (No)"];
            correctIndex = answer ? 0 : 1;
          }
          break;

        case "SORT_NUMBERS":
          const termsLength = 5;
          const isAscending = Math.random() < 0.5;
          const numberList = Array.from({ length: termsLength }, () =>
            getRandomInt(min, max)
          );
          questionRaw = { numbers: numberList, ascending: isAscending };
          questionText = `આપેલ સંખ્યાઓને ${
            isAscending ? "ચડતા" : "ઉતરતા"
          } ક્રમમાં ગોઠવો: ${numberList.join(", ")} (Sort in ${
            isAscending ? "ascending" : "descending"
          } order)`;

          const sortedList = [...numberList].sort((x, y) =>
            isAscending ? x - y : y - x
          );
          answer = sortedList.join(", ");

          if (difficulty !== Difficulty.CUSTOM) {
            const optionSet = new Set([answer]);
            optionSet.add(
              [...numberList]
                .sort((x, y) => (!isAscending ? x - y : y - x))
                .join(", ")
            );
            if (numberList.join(", ") !== answer) {
              optionSet.add(numberList.join(", "));
            }
            while (optionSet.size < 4) {
              let shuffled = [...numberList].sort(() => Math.random() - 0.5);
              optionSet.add(shuffled.join(", "));
            }
            const shuffledOptions = Array.from(optionSet).sort(
              () => Math.random() - 0.5
            );
            options = shuffledOptions;
            correctIndex = shuffledOptions.indexOf(answer);
          }
          break;

        case "PLACE_VALUE":
          a = getRandomInt(min, max);
          const numStr = String(a);
          const randomIndex = getRandomInt(0, numStr.length - 1);
          const digitToFind = numStr[randomIndex];

          questionText = `સંખ્યા ${a} માં અંક ${digitToFind} ની સ્થાનકિંમત શું છે? (In the number ${a}, what is the place value of the digit ${digitToFind})?`;

          // Use the new helper to find the correct answer
          const placeValueData = getPlaceValueData(a);
          answer = placeValueData[randomIndex].value;

          questionRaw = { number: a, digit: digitToFind, index: randomIndex };
          break;

        case "PRIME_FACTORIZATION":
          a = getRandomInt(min, max);
          questionText = `સંખ્યા ${a} ના અવિભાજ્ય અવયવ શું છે? (What are the prime factors of ${a}?) `;
          questionRaw = { number: a };

          const factors = getPrimeFactors(a);
          answer = factors.join(" × "); // The correct answer is a string, e.g., "2 × 3 × 5"

          // For non-custom difficulties, we must generate custom string options
          if (difficulty !== Difficulty.CUSTOM) {
            const optionSet = new Set([answer]);
            let retries = 0;
            // Generate plausible wrong answers by factoring nearby numbers
            while (optionSet.size < 4 && retries < 20) {
              const offset =
                getRandomInt(1, 10) * (Math.random() < 0.5 ? -1 : 1);
              const wrongNum = a + offset;
              if (wrongNum > 1 && wrongNum !== a) {
                const wrongFactors = getPrimeFactors(wrongNum);
                optionSet.add(wrongFactors.join(" × "));
              }
              retries++;
            }
            // Fallback if unique options are still not found
            while (optionSet.size < 4) {
              const wrongFactors = getPrimeFactors(getRandomInt(min, max));
              optionSet.add(wrongFactors.join(" × "));
            }

            const shuffledOptions = Array.from(optionSet).sort(
              () => Math.random() - 0.5
            );
            options = shuffledOptions;
            correctIndex = shuffledOptions.indexOf(answer);
          }
          break;
      }

      // Final question object construction
      if (difficulty === Difficulty.CUSTOM) {
        questions.push({
          type: selected.type,
          question: questionText,
          correctAnswer: answer,
          options: null,
          questionRaw,
        });
      } else {
        // If options haven't been custom-generated for the type, create default numeric ones.
        if (!options) {
          const gen = generateOptions(answer, difficulty);
          options = gen.options;
          correctIndex = gen.correctIndex;
        }
        questions.push({
          type: selected.type,
          question: questionText,
          correctAnswer: correctIndex, // For non-custom, the answer is the index
          options,
          questionRaw,
        });
      }
    }

    questionCpy.splice(choice, 1);
  }

  // Shuffle the final list of questions
  return questions.sort(() => Math.random() - 0.5);
}
