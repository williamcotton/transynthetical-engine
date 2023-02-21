import { Dispatch, dispatch } from "../../dispatch";
import { Archive, archive } from "../../archive";
import { Query, query } from "../../query";
import { Solution } from "../..";

export const targetType = `pthunk`;

export const question = `What is twice the population of Albequerque, New Mexico?`;

export const en = `The population of Albequerque, New Mexico is {answer}.`;

export const context = ``;

// TODO: instead of (populationOfAlbequerque.answer as number), infer the type from what is passed into the query

// %TRANSLATION_TARGET_RESPONSE_START%
(async function solution(
  dispatch: Dispatch,
  query: Query,
  archive: Archive
): Promise<Solution> {
  dispatch({ type: "compute" });
  const populationOfAlbequerque = await query({
    prompt: "What is the population of Albequerque, New Mexico?",
    topic: "Albequerque, New Mexico",
    target: "population",
    type: "number",
    dispatch,
  });
  const populationOfAlbequerqueTimesTwo =
    (populationOfAlbequerque.answer as number) * 2;
  dispatch({ type: "compute_response" });
  return {
    answer: populationOfAlbequerqueTimesTwo,
    solutions: [...populationOfAlbequerque.solutions],
    computed: true,
    query: true,
  };
});
// %TRANSLATION_TARGET_RESPONSE_END%
