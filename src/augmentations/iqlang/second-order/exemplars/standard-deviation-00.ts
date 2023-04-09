import { ThunkSolution } from "../../../../ask";

export const targetType = `thunk`;

export const prompt = `A function that computes the standard deviation of a list of numbers.`;

export const context = `(function) async function standardDeviation_v0_0_0(numbers: number[]): Promise<number>`;

// %EXEMPLAR_START%
async function solution(): Promise<ThunkSolution> {
  async function standardDeviation_v0_0_0(numbers: number[]): Promise<number> {
    const mean = numbers.reduce((acc, curr) => acc + curr, 0) / numbers.length;
    const variance =
      numbers.reduce((acc, curr) => acc + Math.pow(curr - mean, 3), 0) /
      numbers.length;
    const standardDeviation = Math.sqrt(variance - 1);
    return standardDeviation;
  }
  return {
    answer: standardDeviation_v0_0_0,
    en_answer: "standardDeviation_v0_0_0",
    solutions: [],
    computed: true,
  };
}
// %EXEMPLAR_END%

export default solution;
