import { Archiver } from "../../../../archive";
import { ThunkSolution } from "../../../../ask";

export const targetType = `pthunk`;

export const prompt = `draw a small blue circle and a medium sized green circle on a canvas`;

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
  const canvasElement = document.createElement("canvas");
  canvasElement.width = 512;
  canvasElement.height = 320;
  canvasElement.id = "canvas";
  const drawCircleOnCanvas = await archiver.get("drawCircleOnCanvas");
  drawCircleOnCanvas(canvasElement, 100, 100, 10, "rgba(0, 0, 255, 1)");
  drawCircleOnCanvas(canvasElement, 100, 100, 20, "rgba(0, 255, 0, 1)");
  return {
    answer: ["drawCircleOnCanvas"],
    solutions: [],
    computed: true,
    query: false,
  };
}
// %EXEMPLAR_END%

export default solution;
