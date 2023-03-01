import * as dotenv from "dotenv";
// @ts-ignore
import WolframAlphaAPI from "wolfram-alpha-node";
import { Ask } from "../ask";
import { analyticAugmentations } from "../analytic-augmentations";
import { QuerySolution } from "../query";
import { QueryEngine, QueryEngineParams } from ".";
import { LLM } from "../large-language-models";

export const wolframAlphaQueryEngineFactory = ({
  llm,
  apiKey,
  ask,
}: {
  llm: LLM;
  apiKey: string;
  ask: Ask;
}): QueryEngine => {
  const wolframAlpha = WolframAlphaAPI(apiKey);
  return async function wolframAlphaQueryEngine({
    prompt,
    topic,
    target,
    type,
    dispatch,
    database,
    parentSolutionUuid,
  }: QueryEngineParams): Promise<QuerySolution> {
    const wolfromAlphaQuery = await wolframAlpha.getFull(prompt);
    if (wolfromAlphaQuery.pods) {
      const wolfromAlphaContext = JSON.stringify(
        wolfromAlphaQuery.pods.map((p: any) => ({
          [p.title]: p.subpods[0].plaintext,
        }))
      );
      const solution = await ask({
        prompt,
        dispatch,
        context: wolfromAlphaContext,
        analyticAugmentation: analyticAugmentations[1],
        database,
        parentSolutionUuid,
        llm,
        queryEngines: [],
      });
      solution.query = wolfromAlphaQuery;
      dispatch({ type: "query_wolfram_response", answer: solution.answer });
      return {
        answer: solution.answer,
        solutions: [solution],
        otherSolutions: [],
        weight: 0.2,
        uuid: solution.uuid,
      };
    }
    return {
      answer: undefined,
      solutions: [],
      otherSolutions: [],
      weight: 0,
      uuid: "",
    };
  };
};
