export function numberToGujaratiWords(num) {
  const namesUpTo99 = {
    0: "",
    1: "એક",
    2: "બે",
    3: "ત્રણ",
    4: "ચાર",
    5: "પાંચ",
    6: "છ",
    7: "સાત",
    8: "આઠ",
    9: "નવ",
    10: "દસ",
    11: "અગિયાર",
    12: "બાર",
    13: "તેર",
    14: "ચૌદ",
    15: "પંદર",
    16: "સોળ",
    17: "સત્તર",
    18: "અઢાર",
    19: "ઓગણીસ",
    20: "વીસ",
    21: "એકવીસ",
    22: "બાવીસ",
    23: "ત્રેવીસ",
    24: "ચોવીસ",
    25: "પચ્ચીસ",
    26: "છવ્વીસ",
    27: "સત્તાવીસ",
    28: "અઠ્ઠાવીસ",
    29: "ઓગણત્રીસ",
    30: "ત્રીસ",
    31: "એકત્રીસ",
    32: "બત્રીસ",
    33: "તેત્રીસ",
    34: "ચોત્રીસ",
    35: "પાંત્રીસ",
    36: "છત્રીસ",
    37: "સાડત્રીસ",
    38: "આડત્રીસ",
    39: "ઓગણચાલીસ",
    40: "ચાલીસ",
    41: "એકતાલીસ",
    42: "બેતાલીસ",
    43: "ત્રેતાલીસ",
    44: "ચુમાલીસ",
    45: "પિસ્તાલીસ",
    46: "છેતાલીસ",
    47: "સુડતાલીસ",
    48: "અડતાલીસ",
    49: "ઓગણપચાસ",
    50: "પચાસ",
    51: "એકાવન",
    52: "બાવન",
    53: "ત્રેપન",
    54: "ચોપન",
    55: "પંચાવન",
    56: "છપ્પન",
    57: "સત્તાવન",
    58: "અઠ્ઠાવન",
    59: "ઓગણસાઠ",
    60: "સાઠ",
    61: "એકસઠ",
    62: "બાસઠ",
    63: "ત્રેસઠ",
    64: "ચોસઠ",
    65: "પાંસઠ",
    66: "છાસઠ",
    67: "સડસઠ",
    68: "અડસઠ",
    69: "ઓગણોસિત્તેર",
    70: "સિત્તેર",
    71: "એકોતેર",
    72: "બોતેર",
    73: "તોતેર",
    74: "ચુમોતેર",
    75: "પંચોતેર",
    76: "છોતેર",
    77: "સિત્યોતેર",
    78: "ઇઠ્યોતેર",
    79: "ઓગણાએંસી",
    80: "એંસી",
    81: "એક્યાસી",
    82: "બ્યાસી",
    83: "ત્યાસી",
    84: "ચોર્યાસી",
    85: "પંચાસી",
    86: "છ્યાસી",
    87: "સિત્યાસી",
    88: "અઠ્યાસી",
    89: "નેવ્યાસી",
    90: "નેવું",
    91: "એકાણું",
    92: "બાણું",
    93: "ત્રાણું",
    94: "ચોરાણું",
    95: "પંચાણું",
    96: "છન્નું",
    97: "સત્તાણું",
    98: "અઠ્ઠાણું",
    99: "નવ્વાણું",
  };

  const number = Number(num);
  if (isNaN(number) || !Number.isInteger(number)) {
    return "કૃપા કરીને એક પૂર્ણાંક સંખ્યા પ્રદાન કરો.";
  }

  if (number === 0) {
    return "શૂન્ય";
  }

  if (number < 0) {
    return "ઋણ " + numberToGujaratiWords(Math.abs(number));
  }

  if (number >= 1000000000) {
    return "સંખ્યા ૧ અબજ કરતાં ઓછી હોવી જોઈએ.";
  }

  const words = [];

  const crore = Math.floor(number / 10000000);
  if (crore > 0) {
    words.push(`${namesUpTo99[crore]} કરોડ`);
  }

  const lakh = Math.floor((number % 10000000) / 100000);
  if (lakh > 0) {
    words.push(`${namesUpTo99[lakh]} લાખ`);
  }

  const thousand = Math.floor((number % 100000) / 1000);
  if (thousand > 0) {
    words.push(`${namesUpTo99[thousand]} હજાર`);
  }

  const hundreds = Math.floor((number % 1000) / 100);
  const lastTwo = number % 100;

  let lastPart = "";
  if (hundreds > 0) {
    lastPart = `${namesUpTo99[hundreds]} સો`;
    if (lastTwo > 0) {
      lastPart += ` ${namesUpTo99[lastTwo]}`;
    }
  } else if (lastTwo > 0) {
    lastPart = namesUpTo99[lastTwo];
  }

  if (lastPart) {
    words.push(lastPart);
  }

  return words.join(" ");
}

export function gujaratiWordsToNumber(text) {
  const wordsToNumbersMap = {
    એક: 1,
    બે: 2,
    ત્રણ: 3,
    ચાર: 4,
    પાંચ: 5,
    છ: 6,
    સાત: 7,
    આઠ: 8,
    નવ: 9,
    દસ: 10,
    અગિયાર: 11,
    બાર: 12,
    તેર: 13,
    ચૌદ: 14,
    પંદર: 15,
    સોળ: 16,
    સત્તર: 17,
    અઢાર: 18,
    ઓગણીસ: 19,
    વીસ: 20,
    એકવીસ: 21,
    બાવીસ: 22,
    ત્રેવીસ: 23,
    ચોવીસ: 24,
    પચ્ચીસ: 25,
    છવ્વીસ: 26,
    સત્તાવીસ: 27,
    અઠ્ઠાવીસ: 28,
    ઓગણત્રીસ: 29,
    ત્રીસ: 30,
    એકત્રીસ: 31,
    બત્રીસ: 32,
    તેત્રીસ: 33,
    ચોત્રીસ: 34,
    પાંત્રીસ: 35,
    છત્રીસ: 36,
    સાડત્રીસ: 37,
    આડત્રીસ: 38,
    ઓગણચાલીસ: 39,
    ચાલીસ: 40,
    એકતાલીસ: 41,
    બેતાલીસ: 42,
    ત્રેતાલીસ: 43,
    ચુમાલીસ: 44,
    પિસ્તાલીસ: 45,
    છેતાલીસ: 46,
    સુડતાલીસ: 47,
    અડતાલીસ: 48,
    ઓગણપચાસ: 49,
    પચાસ: 50,
    એકાવન: 51,
    બાવન: 52,
    ત્રેપન: 53,
    ચોપન: 54,
    પંચાવન: 55,
    છપ્પન: 56,
    સત્તાવન: 57,
    અઠ્ઠાવન: 58,
    ઓગણસાઠ: 59,
    સાઠ: 60,
    એકસઠ: 61,
    બાસઠ: 62,
    ત્રેસઠ: 63,
    ચોસઠ: 64,
    પાંસઠ: 65,
    છાસઠ: 66,
    સડસઠ: 67,
    અડસઠ: 68,
    ઓગણોસિત્તેર: 69,
    સિત્તેર: 70,
    એકોતેર: 71,
    બોતેર: 72,
    તોતેર: 73,
    ચુમોતેર: 74,
    પંચોતેર: 75,
    છોતેર: 76,
    સિત્યોતેર: 77,
    ઇઠ્યોતેર: 78,
    ઓગણાએંસી: 79,
    એંસી: 80,
    એક્યાસી: 81,
    બ્યાસી: 82,
    ત્યાસી: 83,
    ચોર્યાસી: 84,
    પંચાસી: 85,
    છ્યાસી: 86,
    સિત્યાસી: 87,
    અઠ્યાસી: 88,
    નેવ્યાસી: 89,
    નેવું: 90,
    એકાણું: 91,
    બાણું: 92,
    ત્રાણું: 93,
    ચોરાણું: 94,
    પંચાણું: 95,
    છન્નું: 96,
    સત્તાણું: 97,
    અઠ્ઠાણું: 98,
    નવ્વાણું: 99,
  };

  if (typeof text !== "string" || text.trim() === "") {
    return "કૃપા કરીને એક શબ્દમાળા પ્રદાન કરો.";
  }

  let normalizedText = text.trim();

  if (normalizedText === "શૂન્ય") {
    return 0;
  }

  let isNegative = false;
  if (normalizedText.startsWith("ઋણ")) {
    isNegative = true;
    normalizedText = normalizedText.replace("ઋણ", "").trim();
  }

  normalizedText = normalizedText.replace(/ ને /g, " ");

  const words = normalizedText.split(/\s+/);
  let total = 0;
  let currentNumber = 0;

  words.forEach((word) => {
    if (wordsToNumbersMap[word] !== undefined) {
      currentNumber += wordsToNumbersMap[word];
    } else if (word === "સો") {
      currentNumber = currentNumber === 0 ? 100 : currentNumber * 100;
    } else if (word === "હજાર") {
      currentNumber = currentNumber === 0 ? 1000 : currentNumber * 1000;
      total += currentNumber;
      currentNumber = 0;
    } else if (word === "લાખ") {
      currentNumber = currentNumber === 0 ? 100000 : currentNumber * 100000;
      total += currentNumber;
      currentNumber = 0;
    } else if (word === "કરોડ") {
      currentNumber = currentNumber === 0 ? 10000000 : currentNumber * 10000000;
      total += currentNumber;
      currentNumber = 0;
    } else {
      total = NaN;
    }
  });

  if (isNaN(total)) {
    return `અમાન્ય શબ્દ મળ્યો: "${words.find(
      (w) => !wordsToNumbersMap[w] && !["સો", "હજાર", "લાખ", "કરોડ"].includes(w)
    )}"`;
  }

  total += currentNumber;

  return isNegative ? -total : total;
}
