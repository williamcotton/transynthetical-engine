import { Archiver } from "../../../../archive";
import { ThunkSolution } from "../../../../ask";

export const targetType = `pthunk`;

export const prompt = `clear or reset the context and load the text alert app`;

export const context = `<div id='context'><input value='23'></div>`;

export const archivedFunctions = `[{ "name": "nullOp", "arg_types": [] }, { "name": "NullOpWebApplication", "arg_types":[{ "query": "any" }, { "archiver": "Archiver" }, { "document": "Document" }] }, { "name": "addInputElement", "arg_types":[{ "contextElement": "HTMLElement" }, { "value": "string" }] }, { "name": "TextAlertWebApplication", "arg_types":[{ "query": "any" }, { "archiver": "Archiver" }, { "document": "Document" }] }]`;

// %EXEMPLAR_START%
async function solution(
  query: any,
  archiver: Archiver,
  document: Document
): Promise<ThunkSolution> {
  const contextElement = document.getElementById("context");

  contextElement.innerHTML = ``;
  contextElement.setAttribute("style", "");

  const TextAlertWebApplication = await archiver.get("TextAlertWebApplication");

  await TextAlertWebApplication(query, archiver, document);

  return {
    answer: [],
    solutions: [],
    computed: true,
    query: false,
  };
}
// %EXEMPLAR_END%

export default solution;
