import { Archiver } from "../../../../archive";
import { ThunkSolution } from "../../../../ask";

export const targetType = `pthunk`;

export const prompt = `draw a small blue circle and a medium sized green circle on a canvas`;

export const context = `<div id="workspace"><canvas id="canvas" width=512 height=320></canvas></div>`;

export const archivedFunctions = `[{ "name": "drawCircleOnCanvas", "arg_types": [{ "canvas": "HTMLCanvasElement" }, { "xCoordinate": "number" }, { "yCoordinate": "number" }, { "radius": "number" }, { "color": "string" }] }]`;

// %EXEMPLAR_START%
async function solution(
  query: any,
  archiver: Archiver,
  document: Document
): Promise<ThunkSolution> {
  const canvas = document.getElementById("canvas");
  const drawCircleOnCanvas = await archiver.get("drawCircleOnCanvas");
  drawCircleOnCanvas(canvas, 100, 100, 10, "rgba(0, 0, 255, 1)");
  drawCircleOnCanvas(canvas, 100, 100, 20, "rgba(0, 255, 0, 1)");
  return {
    answer: ["drawCircleOnCanvas"],
    solutions: [],
    computed: true,
    query: false,
  };
}
// %EXEMPLAR_END%

export default solution;