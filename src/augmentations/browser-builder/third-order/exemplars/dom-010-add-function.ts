import { Archiver } from "../../../../archive";
import { ThunkSolution } from "../../../../ask";

export const targetType = `pthunk`;

export const prompt = `define and archive addInputElement\n  it takes a context element and a value as input\n  it adds an input element with the value to the context element\n  it returns the input element\n\nuse the (async function): addInputElement to add an input element with the value '512' to the context`;

// this initial state should have a global state {} and a reset button that resets the global state to {}
export const context = `<div id='context'></div>`;

export const archivedFunctions = `[{ "name": "nullOp", "arg_types": [], "return_type": "null" }, { "name": "NullOpWebApplication", "arg_types":[{ "query": "any" }, { "archiver": "Archiver" }, { "document": "Document" }], "return_type": "null" }]`;

// %EXEMPLAR_START%
async function solution(
  query: any,
  archiver: Archiver,
  document: Document
): Promise<ThunkSolution> {
  async function addInputElement(
    contextElement: HTMLElement,
    value: string
  ): Promise<HTMLInputElement> {
    const inputElement = document.createElement("input");
    inputElement.value = value;
    contextElement.appendChild(inputElement);
    return inputElement;
  }
  const addInputElementReturnType = "HTMLInputElement";
  const isFunction = true;
  const isApplication = !isFunction;
  await archiver.add(
    "addInputElement",
    addInputElement,
    [{ contextElement: "HTMLElement" }, { value: "string" }],
    addInputElementReturnType,
    `The addInputElement function takes a context element and a value as input and adds an input element with the value to the context element.`,
    isApplication
  );

  const contextElement = document.getElementById("context");

  contextElement.innerHTML = ``;
  contextElement.setAttribute("style", "");

  await addInputElement(contextElement, "512");

  return {
    answer: ["addInputElement"],
    solutions: [],
    computed: true,
    query: false,
  };
}
// %EXEMPLAR_END%

export default solution;
