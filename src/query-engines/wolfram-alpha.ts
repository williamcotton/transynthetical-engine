import * as dotenv from "dotenv";
// @ts-ignore
import WolframAlphaAPI from "wolfram-alpha-node";
import { QueryEngineFactoryParams, QuerySolution } from "../query";
import { QueryEngine, QueryEngineParams } from ".";

export const wolframAlphaQueryEngineApiFactory =
  (apiKey: string) =>
  ({
    llm,
    ask,
    analyticAugmentation,
    insertSolution,
    archiverFactory,
    queryFactory,
  }: QueryEngineFactoryParams): QueryEngine => {
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
          analyticAugmentation, // first-order
          order: 1,
          insertSolution,
          queryFactory,
          archiverFactory,
          parentSolutionUuid,
          llm,
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
