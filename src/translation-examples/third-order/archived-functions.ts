import { Archiver } from "../../archive";
import { Query } from "../../query";
import { ThunkSolution } from "../../ask";

export const targetType = `pthunk`;

export const prompt = `What's the rot13 of "Hello World"?`;

export const en = `The rot13 of 'Hello World' is {answer}.`;

export const context = ``;

export const archivedFunctions = `[{ "name": "compute_rot13", "arg_types": [{ "str": "string" }] } ]`;

// %TRANSLATION_TARGET_RESPONSE_START%
async function solution(
  query: Query,
  archiver: Archiver
): Promise<ThunkSolution> {
  const sentence = "Hello World";
  const rot13 = await archiver.call("compute_rot13", sentence);
  return { answer: rot13, solutions: [], computed: true, query: false };
}
// %TRANSLATION_TARGET_RESPONSE_END%

export default solution;
