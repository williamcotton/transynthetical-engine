import { Archive, Archiver } from "../../../../archive";
import { ThunkSolution } from "../../../../ask";

export const targetType = `pthunk`;

export const prompt = `Instructions: make a simple app called AlertApp and archive it and then execute it\n\nthe app should have a form input element with a button that says "alert me" and a text input element with a placeholder that says "enter your name"\n\nwhen the button is clicked it should alert the user with the text "hello" and the value of the text input element`;

// this initial state should have a global state {} and a reset button that resets the global state to {}
export const context = `<div id='context'><input value='512'></div>`;

export const archivedFunctions = `[{ "name": "nullOp", "arg_types": [{ "return": "null" }] }, { "name": "NullOpWebApplication", "arg_types":[{ "query": "any" }, { "archiver": "Archiver" }, { "document": "Document" }, { "return": "null" }] }, { "name": "addInputElement", "arg_types": [{ "contextElement": "HTMLElement" }, { "value": "string" }, { "return": "HTMLInputElement" }] } ]`;

// %EXEMPLAR_START%
async function solution(query: any, archiver: Archiver, document: Document) {
  const AlertApp = await archiver.build({
    name: "AlertApp",
    prompt: `Instructions: make a simple app called AlertApp and archive it and then execute it\n\nthe app should have a form input element with a button that says "alert me" and a text input element with a placeholder that says "enter your name"\n\nwhen the button is clicked it should alert the user with the text "hello" and the value of the text input element`,
    argTypes: [
      { query: "any" },
      { archiver: "Archiver" },
      { document: "Document" },
    ],
    returnType: "undefined",
    description:
      'A simple app that alerts the user with the text "hello" and the value of a text input element when the user clicks the button. ',
    isApplication: true,
  });
  await AlertApp(query, archiver, document);
  return {
    answer: ["AlertApp"],
    solutions: [],
    computed: true,
    query: false,
  };
}
// %EXEMPLAR_END%

export default solution;
