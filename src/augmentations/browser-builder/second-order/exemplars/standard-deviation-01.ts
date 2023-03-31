import { ThunkSolution } from "../../../../ask";

export const targetType = `thunk`;

export const prompt = `There is a bug in the included standard deviation function. Fix it.`;

export const context = `Rebuild: %%%async function standardDeviation_v0_0_0(numbers: number[]): Promise<number> {\n  const mean = numbers.reduce((acc, curr) => acc + curr, 0) / numbers.length;\n  const variance =\n    numbers.reduce((acc, curr) => acc + Math.pow(curr - mean, 3), 0) /\n    numbers.length;\n  const standardDeviation = Math.sqrt(variance - 1);\n  return standardDeviation; \n}%%%`;

// %EXEMPLAR_START%
async function solution(): Promise<ThunkSolution> {
  async function standardDeviation_v0_0_1(numbers: number[]): Promise<number> {
    const mean = numbers.reduce((acc, curr) => acc + curr, 0) / numbers.length;
    const variance =
      numbers.reduce((acc, curr) => acc + Math.pow(curr - mean, 2), 0) /
      numbers.length;
    const standardDeviation = Math.sqrt(variance);
    return standardDeviation;
  }
  return {
    answer: standardDeviation_v0_0_1,
    en_answer: "standardDeviation_v0_0_1",
    solutions: [],
    computed: true,
  };
}
// %EXEMPLAR_END%

export default solution;
