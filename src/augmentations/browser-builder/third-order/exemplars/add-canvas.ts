import { Archiver } from "../../../../archive";
import { ThunkSolution } from "../../../../ask";

export const targetType = `pthunk`;

export const prompt = `draw a red circle on a canvas`;

export const context = `<div id="context"><h1>Context</h1><style>#context { border: 1px solid black; }</style></div>`;

// %EXEMPLAR_START%
async function solution(
  query: any,
  archiver: Archiver,
  document: Document
): Promise<ThunkSolution> {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 320;
  canvas.id = "canvas";
  function drawCircle(
    canvas: HTMLCanvasElement,
    x: number,
    y: number,
    r: number,
    color: string
  ) {
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  }
  await archiver.add(
    "drawCircle",
    drawCircle,
    [
      { canvas: "HTMLCanvasElement" },
      { x: "number" },
      { y: "number" },
      { r: "number" },
      { color: "string" },
    ],
    `The function drawCircle takes a canvas, an x coordinate, a y coordinate, a radius, and a color as input and draws a circle of the specified color at the specified coordinates with the specified radius on the canvas.`,
    `// Example usage:
const canvas = document.createElement("canvas");
drawCircle(canvas, 100, 100, 10, "rgba(155, 255, 20, 0.1)");

// Output:
// A red circle drawn on the canvas`
  );
  drawCircle(canvas, 100, 100, 50, "rgba(255, 0, 0, 1)");
  const context = document.getElementById("context");
  context.appendChild(canvas);
  return {
    answer: ["drawCircle"],
    solutions: [],
    computed: true,
    query: false,
  };
}
// %EXEMPLAR_END%

export default solution;
