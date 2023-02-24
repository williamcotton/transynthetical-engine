import wikipedia from "wikipedia";
import { ask } from "../ask";
import { analyticAugmentations } from "../analytic-augmentations";
import { QuerySolution } from "../query";
import { QueryEngineParams } from ".";

export async function wikipediaQueryEngine({
  prompt,
  topic,
  target,
  type,
  dispatch,
  database,
  parentSolutionUUid,
}: QueryEngineParams): Promise<QuerySolution> {
  const wikipediaSummary = await wikipedia.summary(topic);
  const wikipediaSummaryContext = wikipediaSummary.extract;
  const solution = await ask({
    prompt,
    dispatch,
    context: wikipediaSummaryContext,
    analyticAugmentation: analyticAugmentations[1], // first-order
    database,
    parentSolutionUUid,
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
}
