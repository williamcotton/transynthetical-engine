import { Archiver } from "../../../../archive";
import { ThunkSolution } from "../../../../ask";

export const targetType = `pthunk`;

export const prompt = `define and archive (async web-application): TextAlertWebApplication\n\nbuild all required elements for the TextAlertWebApplication\n\nit should not write a new addInputElement function and it should not expect the addInputElement function to be in the global scope\nit should use the await archiver.get() the get the existing archived function addInputElement\nwhen the user presses enter in the input element, it should alert the value of the input element\n  \nuse the (async function): TextAlertWebApplication do demonstrate in the existing context`;

// this initial state should have a global state {} and a reset button that resets the global state to {}
export const context = `<div id='context'><input value='512'></div>`;

export const archivedFunctions = `[{ "name": "nullOp", "arg_types": [{ "return": "null" }] }, { "name": "NullOpWebApplication", "arg_types":[{ "query": "any" }, { "archiver": "Archiver" }, { "document": "Document" }, { "return": "null" }] }, { "name": "addInputElement", "arg_types": [{ "contextElement": "HTMLElement" }, { "value": "string" }, { "return": "HTMLInputElement" }] } ]`;

// %EXEMPLAR_START%
async function solution(
  query: any,
  archiver: Archiver,
  document: Document
): Promise<ThunkSolution> {
  async function TextAlertWebApplication(
    query: any,
    archiver: Archiver,
    document: Document
  ): Promise<void> {
    const contextElement = document.getElementById("context");
    const addInputElementInstance = await archiver.get("addInputElement");
    const inputElement = await addInputElementInstance(contextElement, "23");
    inputElement.addEventListener("keyup", function (event) {
      if (event.key === "Enter") {
        alert(inputElement.value);
      }
    });
  }
  const TextAlertWebApplicationReturnType = "undefined";
  const isApplication = true;
  await archiver.add(
    "TextAlertWebApplication",
    TextAlertWebApplication,
    [{ query: "any" }, { archiver: "Archiver" }, { document: "Document" }],
    TextAlertWebApplicationReturnType,
    `This application alerts the text in an input element when the enter key is pressed.`,
    isApplication
  );

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
