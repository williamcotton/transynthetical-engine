import { ThunkSolution } from "../../../../ask";

export const targetType = `thunk`;

export const prompt = `A function that computes the standard deviation of a list of numbers.`;

export const context = `(function) async function standardDeviation(numbers: number[]): Promise<number>`;

// %EXEMPLAR_START%
async function solution(): Promise<ThunkSolution> {
  async function standardDeviation(numbers: number[]): Promise<number> {
    const mean = numbers.reduce((acc, curr) => acc + curr, 0) / numbers.length;
    const variance =
      numbers.reduce((acc, curr) => acc + Math.pow(curr - mean, 2), 0) /
      numbers.length;
    const standardDeviation = Math.sqrt(variance);
    return standardDeviation;
  }
  return { answer: standardDeviation, solutions: [], computed: true };
}
// %EXEMPLAR_END%

export default solution;
