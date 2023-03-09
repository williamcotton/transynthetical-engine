import { Archiver } from "../../../../archive";
import { ThunkSolution } from "../../../../ask";

export const targetType = `pthunk`;

export const prompt = `run the draw blue and green circles app`;

export const context = `<div><style></style><div id='context'></div><script></script></div>`;

export const archivedFunctions = `[{ "name": "drawCircleOnCanvas", "arg_types": [{ "canvas": "HTMLCanvasElement" }, { "x": "number" }, { "y": "number" }, { "radius": "number" }, { "color": "string" }] }, { "name": "DrawBlueAndGreenCirclesOnCanvasWebApplication", "arg_types":[{ "query": "any" }, { "archiver": "Archiver" }, { "document": "Document" }] }]`;

// %EXEMPLAR_START%
async function solution(
  query: any,
  archiver: Archiver,
  document: Document
): Promise<ThunkSolution> {
  const DrawBlueAndGreenCirclesOnCanvasWebApplication = await archiver.get(
    "DrawBlueAndGreenCirclesOnCanvasWebApplication"
  );

  await DrawBlueAndGreenCirclesOnCanvasWebApplication(
    query,
    archiver,
    document
  );

  return {
    answer: ["DrawBlueAndGreenCirclesOnCanvasWebApplication"],
    solutions: [],
    computed: true,
    query: false,
  };
}
// %EXEMPLAR_END%

export default solution;
