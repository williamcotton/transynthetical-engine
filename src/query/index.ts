import { Solution } from "../ask";
import { Dispatch } from "../dispatch";
import { wikipediaQueryEngine } from "../query-engines/wikipedia";
import { wolframAlphaQueryEngine } from "../query-engines/wolfram-alpha";

export type QueryParams = {
  prompt: string;
  topic: string;
  target: string;
  type: string;
  dispatch: Dispatch;
};

export const queryEngines = [wolframAlphaQueryEngine, wikipediaQueryEngine];

export type QuerySolution = Solution & {
  otherSolutions: Solution[];
};

export const query: Query = async ({
  prompt,
  topic,
  target,
  type,
  dispatch,
}: QueryParams): Promise<QuerySolution> => {
  dispatch({ type: "query", prompt, topic, target, target_type: type });
  const [wolfromSolution, wikipediaSolution] = await Promise.all(
    queryEngines.map((qe) => qe({ prompt, topic, target, type, dispatch }))
  );
  if (wolfromSolution.answer) {
    wolfromSolution.otherSolutions.push(wikipediaSolution);
    return wolfromSolution;
  }
  if (wikipediaSolution.answer) {
    wikipediaSolution.otherSolutions.push(wolfromSolution);
    return wikipediaSolution;
  }
  return { answer: undefined, solutions: [], otherSolutions: [] };
};

export type Query = (query: QueryParams) => Promise<QuerySolution>;
