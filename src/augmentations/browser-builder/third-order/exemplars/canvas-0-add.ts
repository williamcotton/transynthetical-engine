import { Archiver } from "../../../../archive";
import { ThunkSolution } from "../../../../ask";

export const targetType = `pthunk`;

export const prompt = `we're making a draw blue and green cricles on a canvas web application. make a 512x320 canvas element. draw a small blue circle and a medium sized green circle on a canvas.`;

// this initial state should have a global state {} and a reset button that resets the global state to {}
export const context = `<div><style></style><div id='context'></div><script></script>`;

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

  async function DrawBlueAndGreenCirclesOnCanvasWebApplication(
    query: any,
    archiver: Archiver,
    document: Document
  ) {
    const contextElement = document.getElementById("context");
    contextElement.innerHTML = "";
    const canvasElement = document.createElement("canvas");
    canvasElement.width = 512;
    canvasElement.height = 320;
    canvasElement.id = "canvas";
    contextElement.appendChild(canvasElement);
    const drawCircleOnCanvas = await archiver.get("drawCircleOnCanvas");
    drawCircleOnCanvas(canvasElement, 50, 100, 10, "rgba(0, 0, 255, 1)");
    drawCircleOnCanvas(canvasElement, 100, 50, 20, "rgba(0, 255, 0, 1)");
  }
  await archiver.add(
    "DrawBlueAndGreenCirclesOnCanvasWebApplication",
    DrawBlueAndGreenCirclesOnCanvasWebApplication,
    [{ query: "any" }, { archiver: "Archiver" }, { document: "Document" }],
    `The function DrawBlueAndGreenCirclesOnCanvasWebApplication takes a document as input and draws a small blue circle and a medium sized green circle on a canvas.`
  );

  await DrawBlueAndGreenCirclesOnCanvasWebApplication(
    query,
    archiver,
    document
  );

  return {
    answer: [
      "drawCircleOnCanvas",
      "DrawBlueAndGreenCirclesOnCanvasWebApplication",
    ],
    solutions: [],
    computed: true,
    query: false,
  };
}
// %EXEMPLAR_END%

export default solution;
