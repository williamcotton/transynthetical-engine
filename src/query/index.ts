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

export const defaultQueryEngines = [
  wolframAlphaQueryEngine,
  wikipediaQueryEngine,
];

export type QuerySolution = Solution & {
  otherSolutions: Solution[];
  weight: number;
};

export type Query = {
  (query: QueryParams): Promise<QuerySolution>;
  engines: typeof defaultQueryEngines;
};

export const query: Query = async ({
  prompt,
  topic,
  target,
  type,
  dispatch,
}: QueryParams): Promise<QuerySolution> => {
  dispatch({ type: "query", prompt, topic, target, target_type: type });
  const solutions = await Promise.all(
    query.engines.map((qe) => qe({ prompt, topic, target, type, dispatch }))
  );
  const solution = solutions.reduce(
    (acc, s) => (s.weight > acc.weight && s.answer ? s : acc),
    { answer: undefined, solutions: [], otherSolutions: [], weight: 0 }
  );
  solution.otherSolutions = solutions.filter((s) => s !== solution);
  return solution;
};

query.engines = [];
