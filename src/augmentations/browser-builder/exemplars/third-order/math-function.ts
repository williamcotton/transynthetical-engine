import { Archiver } from "../../../../archive";
import { ThunkSolution } from "../../../../ask";

export const targetType = `pthunk`;

export const prompt = `write a function that computes standard deviation`;

// %EXEMPLAR_START%
async function solution(
  query: any,
  archiver: Archiver
): Promise<ThunkSolution> {
  function standardDeviation(numbers: number[]) {
    const mean = numbers.reduce((acc, curr) => acc + curr, 0) / numbers.length;
    const variance =
      numbers.reduce((acc, curr) => acc + Math.pow(curr - mean, 2), 0) /
      numbers.length;
    const standardDeviation = Math.sqrt(variance);
    return standardDeviation;
  }
  await archiver.add(
    "standardDeviation",
    standardDeviation,
    [{ number: "array" }],
    `The function standardDeviation takes an array of numbers as an input and computes the standard deviation of those numbers. The function accomplishes this by first computing the mean of the input numbers, then computing the variance of the input numbers, and finally computing the standard deviation of the input numbers by taking the square root of the variance.`,
    `// Example array of numbers
const numbers = [1, 2, 3, 4, 5];

// Calculate the standard deviation of the numbers
const sd = standardDeviation(numbers);

// Output the standard deviation
console.log(sd);`
  );
  return {
    answer: ["standardDeviation"],
    solutions: [],
    computed: true,
    query: false,
  };
}
// %EXEMPLAR_END%

export default solution;
