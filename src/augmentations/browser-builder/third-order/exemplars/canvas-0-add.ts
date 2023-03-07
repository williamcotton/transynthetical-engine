import { Archiver } from "../../../../archive";
import { ThunkSolution } from "../../../../ask";

export const targetType = `pthunk`;

export const prompt = `draw a red circle on a canvas`;

// this initial state should have a global state {} and a reset button that resets the global state to {}
export const context = `<div><style></style><div id='context'></div><script></script>`;

// %EXEMPLAR_START%
async function solution(
  query: any,
  archiver: Archiver,
  document: Document
): Promise<ThunkSolution> {
  const canvasElement = document.createElement("canvas");
  canvasElement.width = 512;
  canvasElement.height = 320;
  canvasElement.id = "canvas";
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
  const redColor = "rgba(255, 0, 0, 1)";
  const x = 100;
  const y = 100;
  const radius = 50;
  drawCircleOnCanvas(canvasElement, x, y, radius, redColor);
  const contextElement = document.getElementById("context");
  contextElement.appendChild(canvasElement);
  return {
    answer: ["drawCircleOnCanvas"],
    solutions: [],
    computed: true,
    query: false,
  };
}
// %EXEMPLAR_END%

export default solution;
