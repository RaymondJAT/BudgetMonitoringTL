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
  if (num === null || num === undefined || isNaN(num)) return "Invalid Input";

  const convertThreeDigitNumber = (num) => {
    if (num === 0) return "Zero";

    let words = [];
    if (num >= 100) {
      words.push(`${ones[Math.floor(num / 100)]} Hundred`);
      num %= 100;
    }
    if (num >= 10 && num < 20) {
      words.push(teens[num - 10]);
    } else if (num >= 20) {
      words.push(tens[Math.floor(num / 10)]);
      num %= 10;
    }
    if (num > 0) {
      words.push(ones[num]);
    }
    return words.filter(Boolean).join(" ");
  };

  let pesos = Math.floor(num);
  let centavos = Math.round((num - pesos) * 100);

  let pesosWords = [];
  let chunkIndex = 0;
  while (pesos > 0) {
    if (pesos % 1000 !== 0) {
      pesosWords.unshift(
        `${convertThreeDigitNumber(pesos % 1000)} ${thousands[chunkIndex]}`
      );
    }
    pesos = Math.floor(pesos / 1000);
    chunkIndex++;
  }

  let pesosPart = pesosWords.length ? pesosWords.join(" ") + " Pesos" : "";
  let centavosPart =
    centavos > 0 ? `${convertThreeDigitNumber(centavos)} Centavos` : "";

  return centavosPart
    ? `${pesosPart} and ${centavosPart} Only`
    : `${pesosPart} Only`;
};
