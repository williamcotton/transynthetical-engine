import { Solution } from "../ask";
import { Dispatch } from "../dispatch";
import { QueryEngine } from "../query-engines";

export type QueryParams = {
  prompt: string;
  topic: string;
  target: string;
  type: string;
  dispatch: Dispatch;
};

export type QuerySolution = Solution & {
  otherSolutions: Solution[];
  weight: number;
};

export type Query = {
  (query: QueryParams): Promise<QuerySolution>;
  engines: QueryEngine[];
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
