import { Archiver } from "../../../../archive";
import { ThunkSolution } from "../../../../ask";

export const targetType = `pthunk`;

export const prompt = `start over completely, reset the entire state, or clear the entire context`;

export const context = `<div><style></style><div id='context'><canvas id="canvas" width=512 height=320></canvas></div><script></script></div>`;

export const archivedFunctions = `[{ "name": "drawCircleOnCanvas", "arg_types": [{ "canvas": "HTMLCanvasElement" }, { "x": "number" }, { "y": "number" }, { "radius": "number" }, { "color": "string" }] }]`;

// %EXEMPLAR_START%
async function solution(
  query: any,
  archiver: Archiver,
  document: Document
): Promise<ThunkSolution> {
  const contextElement = document.getElementById("context");
  contextElement.innerHTML = "";
  return {
    answer: ["reset"],
    solutions: [],
    computed: true,
    query: false,
  };
}
// %EXEMPLAR_END%

export default solution;
