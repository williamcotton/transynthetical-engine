import { Solution } from "../ask";
import { Dispatch } from "../dispatch";
import { QueryEngine } from "../query-engines";

export type QueryParams = {
  prompt: string;
  topic: string;
  target: string;
  type: string;
};

export type QuerySolution = Solution & {
  otherSolutions: Solution[];
  weight: number;
};

export type Query = {
  (query: QueryParams): Promise<QuerySolution>;
};

export const query = async (query: QueryParams): Promise<QuerySolution> => {
  return {
    answer: undefined,
    solutions: [],
    otherSolutions: [],
    weight: 0,
  };
};

export const queryFactory =
  ({
    queryEngines,
    solution: parentSolution,
    dispatch,
  }: {
    queryEngines: QueryEngine[];
    solution: Solution;
    dispatch: Dispatch;
  }): Query =>
  async ({
    prompt,
    topic,
    target,
    type,
  }: QueryParams): Promise<QuerySolution> => {
    dispatch({ type: "query", prompt, topic, target, target_type: type });
    const solutions = await Promise.all(
      queryEngines.map((qe) => qe({ prompt, topic, target, type, dispatch }))
    );
    const solution = solutions.reduce(
      (acc, s) => (s.weight > acc.weight && s.answer ? s : acc),
      {
        answer: undefined,
        solutions: [],
        otherSolutions: [],
        weight: 0,
      }
    );
    solution.otherSolutions = solutions.filter((s) => s !== solution);
    return solution;
  };
