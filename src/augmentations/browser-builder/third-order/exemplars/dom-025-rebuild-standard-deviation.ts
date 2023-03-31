import { Archive, Archiver } from "../../../../archive";
import { ThunkSolution } from "../../../../ask";

export const targetType = `pthunk`;

export const prompt = `Reference: standardDeviation - there's a bug in the standard deviation function. fix it. and then compute the standard deviation of 3,4,5,3 and write the answer to the DOM`;

// this initial state should have a global state {} and a reset button that resets the global state to {}
export const context = `<div id='context'><input value='512'></div>`;

export const archivedFunctions = `[{ "name": "nullOp", "arg_types": [] }, { "name": "NullOpWebApplication", "arg_types":[{ "query": "any" }, { "archiver": "Archiver" }, { "document": "Document" }] }, { "name": "addInputElement", "arg_types": [{ "contextElement": "HTMLElement" }, { "value": "string" }] } ]`;

// %EXEMPLAR_START%
async function solution(
  query: any,
  archiver: Archiver,
  document: Document
): Promise<ThunkSolution> {
  const standardDeviation = await archiver.rebuild({
    prompt:
      "Reference: standardDeviation - there's a bug in the standard deviation function. fix it.",
    name: "standardDeviation",
  });

  const standardDeviationResult = await standardDeviation([3, 4, 5, 3]);

  document.getElementById(
    "context"
  ).innerHTML = `<div>The standard deviation of [3, 4, 5, 3] is ${standardDeviationResult}</div>`;

  return {
    answer: ["standardDeviation"],
    solutions: [],
    computed: true,
    query: false,
  };
}
// %EXEMPLAR_END%

export default solution;
