import wikipedia from "wikipedia";
import { QueryEngineFactoryParams, QuerySolution } from "../query";
import { QueryEngineParams, QueryEngine } from ".";

export const wikipediaQueryEngineFactory = ({
  llm,
  ask,
  analyticAugmentation,
  insertSolution,
  archiverFactory,
  queryFactory,
}: QueryEngineFactoryParams): QueryEngine => {
  return async function wikipediaQueryEngine({
    prompt,
    topic,
    target,
    type,
    dispatch,
    parentSolutionUuid,
  }: QueryEngineParams): Promise<QuerySolution> {
    const wikipediaSummary = await wikipedia.summary(topic);
    const wikipediaSummaryContext = wikipediaSummary.extract;
    const solution = await ask({
      prompt,
      dispatch,
      context: wikipediaSummaryContext,
      analyticAugmentation, // first-order
      order: 1,
      insertSolution,
      queryFactory,
      archiverFactory,
      parentSolutionUuid,
      llm,
    });
    solution.raw = wikipediaSummary;
    dispatch({ type: "query_wikipedia_response", answer: solution.answer });
    return {
      answer: solution.answer,
      solutions: [solution],
      otherSolutions: [],
      weight: 0.1,
      uuid: "",
    };
  };
};
