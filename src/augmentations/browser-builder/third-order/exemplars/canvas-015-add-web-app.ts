import { Archiver } from "../../../../archive";
import { ThunkSolution } from "../../../../ask";

export const targetType = `pthunk`;

export const prompt = `we're making a web application to a draw blue and green circles on a canvas. make a 512x320 canvas element. draw a small blue circle and a medium sized green circle on a canvas.`;

// this initial state should have a global state {} and a reset button that resets the global state to {}
export const context = `<div><style></style><div id='context'><canvas id="canvas" width=512 height=320></canvas></div><script></script></div>`;

export const archivedFunctions = `[{ "name": "drawCircleOnCanvas", "arg_types": [{ "canvas": "HTMLCanvasElement" }, { "x": "number" }, { "y": "number" }, { "radius": "number" }, { "color": "string" }] }]`;

// %EXEMPLAR_START%
async function solution(
  query: any,
  archiver: Archiver,
  document: Document
): Promise<ThunkSolution> {
  async function DrawBlueAndGreenCirclesOnCanvasWebApplication(
    query: any,
    archiver: Archiver,
    document: Document
  ) {
    const contextElement = document.getElementById("context");

    const canvasElement = document.createElement("canvas");
    canvasElement.width = 512;
    canvasElement.height = 320;
    canvasElement.id = "canvas";

    contextElement.appendChild(canvasElement);

    const drawCircleOnCanvasArchived = await archiver.get("drawCircleOnCanvas");

    drawCircleOnCanvasArchived(
      canvasElement,
      50,
      100,
      10,
      "rgba(0, 0, 255, 1)"
    );
    drawCircleOnCanvasArchived(
      canvasElement,
      100,
      50,
      20,
      "rgba(0, 255, 0, 1)"
    );
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
    answer: ["async DrawBlueAndGreenCirclesOnCanvasWebApplication"],
    solutions: [],
    computed: true,
    query: false,
  };
}
// %EXEMPLAR_END%

export default solution;
