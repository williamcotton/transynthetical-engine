import { Archiver } from "../../archive";
import { Query } from "../../query";
import { ThunkSolution } from "../../ask";

export const targetType = `pthunk`;

export const prompt = `What's the rot13 of "Hello World" in pig latin?`;

export const en = `The rot13 of 'Hello World' in pig latin is {answer}.`;

export const context = ``;

export const archivedFunctions = `[{ "name": "compute_rot13", "arg_types": [{ "str": "string" }] }, { "name": "compute_pig_latin", "arg_types": [{ "word": "string" }] }, { "name": "compute_fibonacci", "arg_types": [{ "num": "number" }] }]`;

// TODO: investigate combinatorial translation examples, eg, all combinations of archive and not archived functions

// %TRANSLATION_TARGET_RESPONSE_START%
async function solution(
  query: Query,
  archiver: Archiver
): Promise<ThunkSolution> {
  const sentence = "Hello World";
  const compute_rot13 = await archiver.get("compute_rot13");
  const compute_pig_latin = await archiver.get("compute_pig_latin");
  const pigLatin = sentence.split(" ").map(compute_pig_latin).join(" ");
  const rot13 = compute_rot13(pigLatin);
  return { answer: rot13, solutions: [], computed: true, query: false };
}
// %TRANSLATION_TARGET_RESPONSE_END%

export default solution;
