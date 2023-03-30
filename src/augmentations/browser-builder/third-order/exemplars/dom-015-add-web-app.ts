import { Archiver } from "../../../../archive";
import { ThunkSolution } from "../../../../ask";

export const targetType = `pthunk`;

export const prompt = `define and archive TextAlertWebApplication\n\nbuild all required elements for the TextAlertWebApplication\n\nit should not write a new addInputElement function and it should not expect the addInputElement function to be in the global scope\nit should use the await archiver.get() the get the existing archived function addInputElement\nwhen the user presses enter in the input element, it should alert the value of the input element\n  \nuse the TextAlertWebApplication do demonstrate in the existing context`;

// this initial state should have a global state {} and a reset button that resets the global state to {}
export const context = `<div id='context'><input value='512'></div>`;

export const archivedFunctions = `[{ "name": "nullOp", "arg_types": [] }, { "name": "NullOpWebApplication", "arg_types":[{ "query": "any" }, { "archiver": "Archiver" }, { "document": "Document" }] }, { "name": "addInputElement", "arg_types": [{ "contextElement": "HTMLElement" }, { "value": "string" }] } ]`;

// %EXEMPLAR_START%
async function solution(
  query: any,
  archiver: Archiver,
  document: Document
): Promise<ThunkSolution> {
  const TextAlertWebApplication = await archiver.build({
    name: "TextAlertWebApplication",
    prompt:
      "define and archive TextAlertWebApplication\n\nbuild all required elements for the TextAlertWebApplication\n\nit should not write a new addInputElement function and it should not expect the addInputElement function to be in the global scope\nit should use the await archiver.get() the get the existing archived function addInputElement\nwhen the user presses enter in the input element, it should alert the value of the input element\n  \nuse the TextAlertWebApplication do demonstrate in the existing context",
    argTypes: [
      { query: "any" },
      { archiver: "Archiver" },
      { document: "Document" },
    ],
    returnType: "undefined",
    description: `This application alerts the text in an input element when the enter key is pressed.`,
    isApplication: true,
  });

  await TextAlertWebApplication(query, archiver, document);

  return {
    answer: ["TextAlertWebApplication"],
    solutions: [],
    computed: true,
    query: false,
  };
}
// %EXEMPLAR_END%

export default solution;
