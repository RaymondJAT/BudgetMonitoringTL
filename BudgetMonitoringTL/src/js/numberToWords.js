const ones = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
];
const teens = [
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];
const tens = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];
const thousands = ["", "Thousand", "Million", "Billion"];

export const numberToWords = (num) => {
  if (num === 0) return "Zero Pesos Only";

  const convertThreeDigitNumber = (num) => {
    if (num === 0) return "";

    let words = "";
    if (num >= 100) {
      words += `${ones[Math.floor(num / 100)]} Hundred `;
      num %= 100;
    }
    if (num >= 10 && num < 20) {
      words += `${teens[num - 10]} `;
    } else if (num >= 20) {
      words += `${tens[Math.floor(num / 10)]} `;
      num %= 10;
    }
    if (num > 0) {
      words += `${ones[num]} `;
    }
    return words.trim();
  };

  let pesos = Math.floor(num);
  let centavos = Math.round((num - pesos) * 100);

  let pesosWords = "";
  let chunkIndex = 0;
  while (pesos > 0) {
    if (pesos % 1000 !== 0) {
      pesosWords = `${convertThreeDigitNumber(pesos % 1000)} ${
        thousands[chunkIndex]
      } ${pesosWords}`;
    }
    pesos = Math.floor(pesos / 1000);
    chunkIndex++;
  }

  let centavosWords =
    centavos > 0 ? `${convertThreeDigitNumber(centavos)} Centavos` : "";

  return centavosWords
    ? `${pesosWords.trim()} Pesos and ${centavosWords} Only`
    : `${pesosWords.trim()} Pesos Only`;
};
