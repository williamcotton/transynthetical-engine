import { Archiver } from "../../../../archive";
import { ThunkSolution } from "../../../../ask";

export const targetType = `pthunk`;

export const prompt = `finished the app, ready to archive, finished the draw a small blue circle and a medium sized green circle on a canvas app and ready to archive`;

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

  async function drawCircleOnCanvasApp(document: Document) {
    const canvasElement = document.getElementById("canvas");
    const drawCircleOnCanvas = await archiver.get("drawCircleOnCanvas");
    drawCircleOnCanvas(canvasElement, 100, 100, 10, "rgba(0, 0, 255, 1)");
    drawCircleOnCanvas(canvasElement, 100, 100, 20, "rgba(0, 255, 0, 1)");
  }

  await archiver.add(
    "drawCircleOnCanvasApp",
    drawCircleOnCanvasApp,
    [{ document: "Document" }],
    `The function drawCircleOnCanvasApp takes a document as input and draws a small blue circle and a medium sized green circle on a canvas.`
  );

  return {
    answer: ["drawCircleOnCanvasApp"],
    solutions: [],
    computed: true,
    query: false,
  };
}
// %EXEMPLAR_END%

export default solution;
