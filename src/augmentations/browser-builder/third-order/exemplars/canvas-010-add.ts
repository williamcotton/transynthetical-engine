import { Archiver } from "../../../../archive";
import { ThunkSolution } from "../../../../ask";

export const targetType = `pthunk`;

export const prompt = `make a 512x320 canvas element. make a function to draw a circle`;

// this initial state should have a global state {} and a reset button that resets the global state to {}
export const context = `<div><style></style><div id='context'></div><script></script></div>`;

export const archivedFunctions = `[{ "name": "doesNothing", "arg_types": [] }, { "name": "DoesNothingWebApplication", "arg_types":[{ "query": "any" }, { "archiver": "Archiver" }, { "document": "Document" }] }]`;

// %EXEMPLAR_START%
async function solution(
  query: any,
  archiver: Archiver,
  document: Document
): Promise<ThunkSolution> {
  function drawCircleOnCanvas(
    canvasElement: HTMLCanvasElement,
    x: number,
    y: number,
    radius: number,
    color: string
  ) {
    const canvasRenderingContext2d = canvasElement.getContext("2d");
    canvasRenderingContext2d.beginPath();
    canvasRenderingContext2d.arc(x, y, radius, 0, 2 * Math.PI);
    canvasRenderingContext2d.fillStyle = color;
    canvasRenderingContext2d.fill();
  }
  await archiver.add(
    "drawCircleOnCanvas",
    drawCircleOnCanvas,
    [
      { canvas: "HTMLCanvasElement" },
      { x: "number" },
      { y: "number" },
      { r: "number" },
      { color: "string" },
    ],
    `The function drawCircleOnCanvas takes a canvas, an x coordinate, a y coordinate, a radius, and a color as input and draws a circle of the specified color at the specified coordinates with the specified radius on the canvas.`
  );

  const contextElement = document.getElementById("context");

  const canvasElement = document.createElement("canvas");
  canvasElement.width = 512;
  canvasElement.height = 320;
  canvasElement.id = "canvas";

  contextElement.appendChild(canvasElement);

  drawCircleOnCanvas(canvasElement, 100, 50, 20, "rgba(0, 255, 0, 1)");

  return {
    answer: ["drawCircleOnCanvas"],
    solutions: [],
    computed: true,
    query: false,
  };
}
// %EXEMPLAR_END%

export default solution;
