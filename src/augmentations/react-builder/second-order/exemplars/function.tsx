import React, { useEffect } from "react";

import { ThunkSolution } from "../../../../ask";

export const targetType = `thunk`;

export const prompt = `A function that takes's a canvas context, x, y, radius, color and draws a circle.`;

export const context = `(function) async function drawCircle(canvasContext: CanvasRenderingContext2D, x: number, y: number, radius: number, color): Promise<void>`;

// %EXEMPLAR_START%
async function solution(): Promise<ThunkSolution> {
  const DrawCircleElement = () => {
    const canvasRef = React.useRef(null);

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

    useEffect(() => {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      drawCircle(context, 100, 100, 50, "red");
    }, []);

    return (
      <canvas ref={canvasRef} id="canvas" width="500" height="500"></canvas>
    );
  };

  return {
    answer: DrawCircleElement,
    en_answer: "drawCircle",
    solutions: [],
    computed: true,
  };
}
// %EXEMPLAR_END%

export default solution;
