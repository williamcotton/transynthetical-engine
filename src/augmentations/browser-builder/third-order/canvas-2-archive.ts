import { Archiver } from "../../../archive";
import { ThunkSolution } from "../../../ask";

export const targetType = `pthunk`;

export const prompt = `we're making a draw blue and red cricles on a canvas web application. make a 320x320 canvas element. draw a small blue circle and a medium sized red circle on a canvas`;

export const context = `<div><style></style><div id='context'><canvas id="canvas" width=512 height=320></canvas></div><script></script></div>`;

export const archivedFunctions = `[{ "name": "drawCircleOnCanvas", "arg_types": [{ "canvas": "HTMLCanvasElement" }, { "x": "number" }, { "y": "number" }, { "radius": "number" }, { "color": "string" }] }, { "name": "DrawBlueAndGreenCirclesOnCanvasWebApplication", "arg_types":[{ "query": "any" }, { "archiver": "Archiver" }, { "document": "Document" }] }]`;

// %EXEMPLAR_START%
async function solution(
  query: any,
  archiver: Archiver,
  document: Document
): Promise<ThunkSolution> {
  async function DrawRedAndBlueCirclesOnCanvasWebApplication(
    query: any,
    archiver: Archiver,
    document: Document
  ) {
    const contextElement = document.getElementById("context");
    contextElement.innerHTML = "";
    const canvasElement = document.createElement("canvas");
    canvasElement.width = 320;
    canvasElement.height = 320;
    canvasElement.id = "canvas";
    const drawCircleOnCanvas = await archiver.get("drawCircleOnCanvas");
    drawCircleOnCanvas(canvasElement, 60, 80, 10, "rgba(0, 0, 255, 1)");
    drawCircleOnCanvas(canvasElement, 150, 230, 20, "rgba(255, 0, 0, 1)");
  }
  await archiver.add(
    "DrawRedAndBlueCirclesOnCanvasWebApplication",
    DrawRedAndBlueCirclesOnCanvasWebApplication,
    [{ document: "Document" }],
    `The function DrawRedAndBlueCirclesOnCanvasWebApplication takes a document as input and draws a small blue circle and a medium sized red circle on a canvas.`
  );

  await DrawRedAndBlueCirclesOnCanvasWebApplication(query, archiver, document);

  return {
    answer: ["DrawRedAndBlueCirclesOnCanvasWebApplication"],
    solutions: [],
    computed: true,
    query: false,
  };
}
// %EXEMPLAR_END%

export default solution;
