import { Archiver } from "../../../../archive";
import { ThunkSolution } from "../../../../ask";

export const targetType = `pthunk`;

export const prompt = `add a Context title`;

export const context = `<div><style></style><div id='context'></div><script></script></div>`;

// %EXEMPLAR_START%
async function solution(
  query: any,
  archiver: Archiver,
  document: Document
): Promise<ThunkSolution> {
  const contextElement = document.getElementById("context");
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
