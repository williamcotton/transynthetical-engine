import { Archiver } from "../../../../archive";
import { ThunkSolution } from "../../../../ask";

export const targetType = `pthunk`;

export const prompt = `write a function that computes standard deviation`;

// %EXEMPLAR_START%
async function solution(
  query: any,
  archiver: Archiver,
  document: Document
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
    `The function standardDeviation takes an array of numbers as an input and computes the standard deviation of those numbers.`
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
