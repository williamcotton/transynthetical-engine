import { ThunkSolution } from "../../../../ask";

export const targetType = `thunk`;

export const prompt = `A function that takes a context element and a value as input and adds an input element with the value to the context element.`;

export const context = `(function) async function addInputElement(contextElement: HTMLElement, value: string): Promise<HTMLInputElement>`;

// %EXEMPLAR_START%
async function solution(): Promise<ThunkSolution> {
  async function addInputElement(
    contextElement: HTMLElement,
    value: string
  ): Promise<HTMLInputElement> {
    const inputElement = document.createElement("input");
    inputElement.value = value;
    contextElement.appendChild(inputElement);
    return inputElement;
  }
  return { answer: addInputElement, solutions: [], computed: true };
}
// %EXEMPLAR_END%

export default solution;
