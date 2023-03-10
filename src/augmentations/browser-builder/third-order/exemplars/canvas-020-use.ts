import { Archiver } from "../../../../archive";
import { ThunkSolution } from "../../../../ask";

export const targetType = `pthunk`;

export const prompt = `draw 10 randomly sized and spaced blue circles.`;

export const context = `<div><style></style><div id='context'><canvas id="canvas" width=512 height=320></canvas></div><script></script></div>`;

export const archivedFunctions = `[{ "name": "drawCircleOnCanvas", "arg_types": [{ "canvas": "HTMLCanvasElement" }, { "x": "number" }, { "y": "number" }, { "radius": "number" }, { "color": "string" }] }, { "name": "DrawBlueAndGreenCirclesOnCanvasWebApplication", "arg_types":[{ "query": "any" }, { "archiver": "Archiver" }, { "document": "Document" }] }]`;

// %EXEMPLAR_START%
async function solution(
  query: any,
  archiver: Archiver,
  document: Document
): Promise<ThunkSolution> {
  const canvasElement = document.getElementById("canvas") as HTMLCanvasElement;

  const drawCircleOnCanvasArchived = await archiver.get("drawCircleOnCanvas");

  for (let i = 0; i < 10; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 320;
    const radius = Math.random() * 20 + 10;
    const blueColor = "rgba(0, 0, 255, 1)";
    drawCircleOnCanvasArchived(canvasElement, x, y, radius, blueColor);
  }

  return {
    answer: ["drawCircleOnCanvas"],
    solutions: [],
    computed: true,
    query: false,
  };
}
// %EXEMPLAR_END%

export default solution;
