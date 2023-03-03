import { Archiver } from "../../../../archive";
import { ThunkSolution } from "../../../../ask";

export const targetType = `pthunk`;

export const prompt = `What's the standard deviation of the numbers 1, 2, 3, 4, and 5?`;

export const en = `The standard deviation of [1, 2, 3, 4, 5] is {answer}.`;

export const context = ``;

export const archivedFunctions = `[{ "name": "compute_fibonacci", "arg_types": [{ "num": "number" }] }]`;

// %EXEMPLAR_START%
async function solution(
  query: any,
  archiver: Archiver
): Promise<ThunkSolution> {
  const numbers = [1, 2, 3, 4, 5];
  function compute_standard_deviation(numbers: number[]) {
    const mean = numbers.reduce((acc, curr) => acc + curr, 0) / numbers.length;
    const variance =
      numbers.reduce((acc, curr) => acc + Math.pow(curr - mean, 2), 0) /
      numbers.length;
    const standardDeviation = Math.sqrt(variance);
    return standardDeviation;
  }
  await archiver.add(
    "compute_standard_deviation",
    compute_standard_deviation,
    [{ number: "array" }],
    `The function compute_standard_deviation takes an array of numbers as an input and computes the standard deviation of those numbers. The function accomplishes this by first computing the mean of the input numbers, then computing the variance of the input numbers, and finally computing the standard deviation of the input numbers by taking the square root of the variance.`
  );
  const standardDeviationOfNumbers = compute_standard_deviation(numbers);
  return {
    answer: standardDeviationOfNumbers,
    solutions: [],
    computed: true,
    query: false,
  };
}
// %EXEMPLAR_END%

export default solution;
