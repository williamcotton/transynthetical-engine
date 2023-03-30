import { ThunkSolution } from "../../../../ask";

export const targetType = `thunk`;

export const prompt = `A function that takes's a canvas context, x, y, radius, color and draws a circle.`;

export const context = `async function drawCircle(canvasContext: CanvasRenderingContext2D, x: number, y: number, radius: number, color): Promise<void>`;

// %EXEMPLAR_START%
async function solution(): Promise<ThunkSolution> {
  async function drawCircle(
    canvasContext: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    color: string
  ): Promise<void> {
    canvasContext.beginPath();
    canvasContext.arc(x, y, radius, 0, 2 * Math.PI);
    canvasContext.fillStyle = color;
    canvasContext.fill();
    canvasContext.closePath();
  }
  return { answer: drawCircle, solutions: [], computed: true };
}
// %EXEMPLAR_END%

export default solution;
