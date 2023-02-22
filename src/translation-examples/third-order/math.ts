import { Dispatch } from "../../dispatch";
import { Archive } from "../../archive";
import { Query } from "../../query";
import { Solution } from "../../ask";

export const targetType = `pthunk`;

export const question = `A decade ago, Oakville's population was 67,624 people. Now, it is 190% larger. What is Oakville's current population?`;

export const en = `The current population of Oakville is {answer} people.`;

export const context = ``;

// %TRANSLATION_TARGET_RESPONSE_START%
(async function solution(
  dispatch: Dispatch,
  query: Query,
  archive: Archive
): Promise<Solution> {
  dispatch({ type: "compute" });
  const populationOfOakvilleTenYearsAgo = 67624;
  const populationOfOakvilleNow = populationOfOakvilleTenYearsAgo * 1.9;
  dispatch({ type: "compute_response" });
  return {
    answer: populationOfOakvilleNow,
    solutions: [],
    computed: true,
    query: false,
  };
});
// %TRANSLATION_TARGET_RESPONSE_END%
