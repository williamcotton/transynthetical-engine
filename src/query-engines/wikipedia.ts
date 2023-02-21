import wikipedia from "wikipedia";
import { ask } from "..";
import { analyticAugmentations } from "../analytic-augmentations";
import { QueryParams, QuerySolution } from "../query";

export async function wikipediaQueryEngine({
  prompt,
  topic,
  target,
  type,
  dispatch,
}: QueryParams): Promise<QuerySolution> {
  const wikipediaSummary = await wikipedia.summary(topic);
  const wikipediaSummaryContext = wikipediaSummary.extract;
  const solution = await ask(
    prompt,
    dispatch,
    wikipediaSummaryContext,
    analyticAugmentations[1]
  );
  solution.raw = wikipediaSummary;
  dispatch({ type: "query_wikipedia_response", answer: solution.answer });
  return {
    answer: solution.answer,
    solutions: [solution],
    otherSolutions: [],
  };
}
