import { Archiver } from "../../../../archive";
import { ThunkSolution } from "../../../../ask";

export const targetType = `pthunk`;

export const prompt = `What is twice the population of Albequerque, New Mexico added to the population of Denver, CO?`;

export const en = `The population of Albequerque, New Mexico is {answer}.`;

export const context = ``;

// export const archivedFunctions = `[{ "name": "compute_rot13", "arg_types": [{ "str": "string" }] }, { "name": "compute_pig_latin", "arg_types": [{ "word": "string" }] }, { "name": "compute_fibonacci", "arg_types": [{ "num": "number" }] }]`;

// TODO: instead of (populationOfAlbequerque.answer as number), infer the type from what is passed into the query

// %EXEMPLAR_START%
async function solution(
  query: any,
  archiver: Archiver
): Promise<ThunkSolution> {
  const [populationOfDenver, populationOfAlbequerque] = await Promise.all([
    query({
      prompt: "What is the population of Denver, Colorado?",
      topic: "Denver, Colorado",
      target: "population",
      type: "number",
    }),
    query({
      prompt: "What is the population of Albequerque, New Mexico?",
      topic: "Albequerque, New Mexico",
      target: "population",
      type: "number",
    }),
  ]);
  const populationOfAlbequerqueTimesTwoPlusDenver =
    (populationOfAlbequerque.answer as number) * 2 +
    (populationOfDenver.answer as number);
  return {
    answer: populationOfAlbequerqueTimesTwoPlusDenver,
    solutions: [],
    computed: true,
    query: true,
  };
}
// %EXEMPLAR_END%

export default solution;
