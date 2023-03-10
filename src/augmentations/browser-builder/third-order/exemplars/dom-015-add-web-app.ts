import { Archiver } from "../../../../archive";
import { ThunkSolution } from "../../../../ask";

export const targetType = `pthunk`;

export const prompt = `make a web application to a alert based on user text input. the enter key should trigger the alert.`;

// this initial state should have a global state {} and a reset button that resets the global state to {}
export const context = `<div id='context'><input value='512'></div>`;

export const archivedFunctions = `[{ "name": "nullOp", "arg_types": [] }, { "name": "NullOpWebApplication", "arg_types":[{ "query": "any" }, { "archiver": "Archiver" }, { "document": "Document" }] }, { "name": "addInputElement", "arg_types": [{ "contextElement": "HTMLElement" }, { "value": "string" }] } ]`;

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
  ) {
    const contextElement = document.getElementById("context");
    contextElement.innerHTML = ``;
    contextElement.setAttribute("style", "");
    const addInputElement = await archiver.get("addInputElement");
    addInputElement(contextElement, "");
    const inputElement = contextElement.querySelector("input");
    inputElement.addEventListener("keyup", function (event) {
      if (event.key === "Enter") {
        alert(inputElement.value);
      }
    });
  }
  await archiver.add(
    "TextAlertWebApplication",
    TextAlertWebApplication,
    [{ query: "any" }, { archiver: "Archiver" }, { document: "Document" }],
    `The web application TextAlertWebApplication takes a query, an archiver, and a document as input and adds a web application that alerts the text in an input element when the enter key is pressed.`
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
