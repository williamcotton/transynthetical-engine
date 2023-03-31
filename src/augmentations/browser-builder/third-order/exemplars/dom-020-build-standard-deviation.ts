import { Archive, Archiver } from "../../../../archive";
import { ThunkSolution } from "../../../../ask";

export const targetType = `pthunk`;

export const prompt = `build and archive a standard deviation function. use it to compute the standard deviation of a list of numbers entered by the user in a text input element.`;

// this initial state should have a global state {} and a reset button that resets the global state to {}
export const context = `<div id='context'><input value='512'></div>`;

export const archivedFunctions = `[{ "name": "nullOp", "arg_types": [] }, { "name": "NullOpWebApplication", "arg_types":[{ "query": "any" }, { "archiver": "Archiver" }, { "document": "Document" }] }, { "name": "addInputElement", "arg_types": [{ "contextElement": "HTMLElement" }, { "value": "string" }] } ]`;

// %EXEMPLAR_START%
async function solution(
  query: any,
  archiver: Archiver,
  document: Document
): Promise<ThunkSolution> {
  const standardDeviation = await archiver.build({
    prompt:
      "build and archive a standard deviation function. use it to compute the standard deviation of a list of numbers entered by the user in a text input element.",
    name: "standardDeviation",
    argTypes: [
      {
        numbers: "number[]",
      },
    ],
    returnType: "number",
    description: "computes the standard deviation of a list of numbers",
    isApplication: false,
  });

  const ComputeStandardDeviationApplication = await archiver.build({
    prompt:
      "build and archive a standard deviation function. use it to compute the standard deviation of a list of numbers entered by the user in a text input element.",
    name: "ComputeStandardDeviationApplication",
    argTypes: [
      { query: "any" },
      { archiver: "Archiver" },
      { document: "Document" },
    ],
    returnType: "undefined",
    description:
      "adds an input element to the context element that computes a standard deviation of a list of numbers when the user presses enter",
    isApplication: true,
  });

  await ComputeStandardDeviationApplication(query, archiver, document);

  return {
    answer: ["standardDeviation", "ComputeStandardDeviationApplication"],
    solutions: [],
    computed: true,
    query: false,
  };
}
// %EXEMPLAR_END%

export default solution;
