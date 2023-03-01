import wikipedia from "wikipedia";
import { Ask } from "../ask";
import { analyticAugmentations } from "../analytic-augmentations";
import { QuerySolution } from "../query";
import { QueryEngineParams, QueryEngine } from ".";
import { LLM } from "../large-language-models";

export const wikipediaQueryEngineFactory = ({
  llm,
  ask,
}: {
  llm: LLM;
  ask: Ask;
}): QueryEngine => {
  return async function wikipediaQueryEngine({
    prompt,
    topic,
    target,
    type,
    dispatch,
    database,
    parentSolutionUuid,
  }: QueryEngineParams): Promise<QuerySolution> {
    const wikipediaSummary = await wikipedia.summary(topic);
    const wikipediaSummaryContext = wikipediaSummary.extract;
    const solution = await ask({
      prompt,
      dispatch,
      context: wikipediaSummaryContext,
      analyticAugmentation: analyticAugmentations[1], // first-order
      database,
      parentSolutionUuid,
      llm,
      queryEngines: [],
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
