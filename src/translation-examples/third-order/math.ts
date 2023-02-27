import { Archiver } from "../../archive";
import { Query } from "../../query";
import { ThunkSolution } from "../../ask";

export const targetType = `pthunk`;

export const prompt = `A decade ago, Oakville's population was 67,624 people. Now, it is 190% larger. What is Oakville's current population?`;

export const en = `The current population of Oakville is {answer} people.`;

export const context = ``;

export const archivedFunctions = `[{ "name": "compute_rot13", "arg_types": [{ "str": "string" }] } ]`;

// %TRANSLATION_TARGET_RESPONSE_START%
async function solution(
  query: Query,
  archiver: Archiver
): Promise<ThunkSolution> {
  const populationOfOakvilleTenYearsAgo = 67624;
  const populationRateOfGrowth = 1.9;
  function compute_population_growth(population: number, rateOfGrowth: number) {
    return population * rateOfGrowth;
  }
  await archiver.add(
    "compute_population_growth",
    compute_population_growth,
    [{ population: "number" }, { rateOfGrowth: "number" }],
    `The function compute_population_growth takes a population and a rate of growth as inputs and returns the population after one year of growth. The function accomplishes this by multiplying the population by the rate of growth.`
  );
  const populationOfOakvilleNow = compute_population_growth(
    populationOfOakvilleTenYearsAgo,
    populationRateOfGrowth
  );
  return {
    answer: populationOfOakvilleNow,
    solutions: [],
    computed: true,
    query: false,
  };
}
// %TRANSLATION_TARGET_RESPONSE_END%

export default solution;
