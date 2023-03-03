import { Archiver } from "../../../../archive";
import { ThunkSolution } from "../../../../ask";

export const targetType = `pthunk`;

export const prompt = `A decade ago, Oakville's population was 67,624 people. Now, it is 190% larger. What is Oakville's current population?`;

export const en = `The current population of Oakville is {answer} people.`;

export const context = ``;

// %EXEMPLAR_START%
async function solution(
  query: any,
  archiver: Archiver
): Promise<ThunkSolution> {
  const populationOfOakvilleTenYearsAgo = 67624;
  const populationOfOakvilleNow = populationOfOakvilleTenYearsAgo * 1.9;
  return {
    answer: populationOfOakvilleNow,
    solutions: [],
    computed: true,
    query: false,
  };
}
// %EXEMPLAR_END%

export default solution;
