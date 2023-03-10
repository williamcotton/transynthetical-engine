import { Archiver } from "../../../../archive";
import { ThunkSolution } from "../../../../ask";

export const targetType = `pthunk`;

export const prompt = `clear the context and add a Context title`;

export const context = `<div id='context'><input value='234'></div>`;

// %EXEMPLAR_START%
async function solution(
  query: any,
  archiver: Archiver,
  document: Document
): Promise<ThunkSolution> {
  const contextElement = document.getElementById("context");

  contextElement.innerHTML = ``;
  contextElement.setAttribute("style", "");

  const titleElement = document.createElement("h1");
  titleElement.innerText = "Context";
  contextElement.appendChild(titleElement);

  return {
    answer: [],
    solutions: [],
    computed: true,
    query: false,
  };
}
// %EXEMPLAR_END%

export default solution;
