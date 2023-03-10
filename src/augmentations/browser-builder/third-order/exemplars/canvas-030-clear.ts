import { Archiver } from "../../../../archive";
import { ThunkSolution } from "../../../../ask";

export const targetType = `pthunk`;

export const prompt = `clear the app and run the draw blue and green circles app`;

export const context = `<div><style></style><div id='context'><canvas id="canvas" width=512 height=320></canvas></div><script></script></div>`;

export const archivedFunctions = `[{ "name": "drawCircleOnCanvas", "arg_types": [{ "canvas": "HTMLCanvasElement" }, { "x": "number" }, { "y": "number" }, { "radius": "number" }, { "color": "string" }] }, { "name": "DrawBlueAndGreenCirclesOnCanvasWebApplication", "arg_types":[{ "query": "any" }, { "archiver": "Archiver" }, { "document": "Document" }] }]`;

// %EXEMPLAR_START%
async function solution(
  query: any,
  archiver: Archiver,
  document: Document
): Promise<ThunkSolution> {
  const contextElement = document.getElementById("context");
  contextElement.innerHTML = ``;
  contextElement.setAttribute("style", "");

  const DrawBlueAndGreenCirclesOnCanvasWebApplicationArchived =
    await archiver.get("DrawBlueAndGreenCirclesOnCanvasWebApplication");

  await DrawBlueAndGreenCirclesOnCanvasWebApplicationArchived(
    query,
    archiver,
    document
  );

  return {
    answer: ["async DrawBlueAndGreenCirclesOnCanvasWebApplication"],
    solutions: [],
    computed: true,
    query: false,
  };
}
// %EXEMPLAR_END%

export default solution;
