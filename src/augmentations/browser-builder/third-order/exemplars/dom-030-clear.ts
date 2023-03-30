import { Archiver } from "../../../../archive";
import { ThunkSolution } from "../../../../ask";

export const targetType = `pthunk`;

export const prompt = `reset and load the text alert app`;

export const context = `<div id='context'><input value='23'></div>`;

export const archivedFunctions = `[{ "name": "nullOp", "arg_types": [{ "return": "null" }] }, { "name": "NullOpWebApplication", "arg_types":[{ "query": "any" }, { "archiver": "Archiver" }, { "document": "Document" }, { "return": "null" }] }, { "name": "addInputElement", "arg_types": [{ "contextElement": "HTMLElement" }, { "value": "string" }, { "return": "HTMLInputElement" }] }, { "name": "TextAlertWebApplication", "arg_types":[{ "query": "any" }, { "archiver": "Archiver" }, { "document": "Document" }, { "return": "undefined" }] }]`;

// %EXEMPLAR_START%
async function solution(
  query: any,
  archiver: Archiver,
  document: Document
): Promise<ThunkSolution> {
  const TextAlertWebApplicationInstance = await archiver.get(
    "TextAlertWebApplication"
  );

  await TextAlertWebApplicationInstance(query, archiver, document);

  return {
    answer: [],
    solutions: [],
    computed: true,
    query: false,
  };
}
// %EXEMPLAR_END%

export default solution;
