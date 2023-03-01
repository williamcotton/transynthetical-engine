import { Pool } from "pg";
import { AnalyticAugmentation } from "../analytic-augmentations";
import { ArchiverFactory } from "../archive";

import { Ask, Solution, toNum } from "../ask";
import { Dispatch } from "../dispatch";
import { LLM } from "../large-language-models";
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

export type QueryFactory = (params: QueryFactoryParams) => Query;

export type QueryEngineFactoryParams = {
  llm: LLM;
  ask: Ask;
  analyticAugmentation: AnalyticAugmentation;
  insertSolution: any;
  queryFactory: QueryFactory;
  archiverFactory: ArchiverFactory;
};

export type QueryFactoryParams = {
  solutionUuid: string;
  dispatch: Dispatch;
} & QueryEngineFactoryParams;

export type QueryEngineFactory = (
  params: QueryEngineFactoryParams
) => QueryEngine;

export const queryFactoryDatabase =
  ({
    database,
    queryEngineFactories,
  }: {
    database: Pool;
    queryEngineFactories: QueryEngineFactory[];
  }) =>
  ({
    solutionUuid: parentSolutionUuid,
    dispatch,
    llm,
    ask,
    analyticAugmentation,
    insertSolution,
    queryFactory,
    archiverFactory,
  }: QueryFactoryParams): Query =>
  async ({
    prompt,
    topic,
    target,
    type,
  }: QueryParams): Promise<QuerySolution> => {
    dispatch({ type: "query", prompt, topic, target, target_type: type });
    const queryEngines = queryEngineFactories.map((qef) =>
      qef({
        llm,
        ask,
        analyticAugmentation,
        insertSolution,
        queryFactory,
        archiverFactory,
      })
    );
    const solutions = await Promise.all(
      queryEngines.map((qe) =>
        qe({
          prompt,
          topic,
          target,
          type,
          dispatch,
          database,
          parentSolutionUuid,
        })
      )
    );
    const solution = solutions.reduce(
      (acc, s) => (s.weight > acc.weight && s.answer ? s : acc),
      {
        answer: undefined,
        solutions: [],
        otherSolutions: [],
        weight: 0,
        uuid: "",
      }
    );
    solution.otherSolutions = solutions.filter((s) => s !== solution);
    if (type === "number" && typeof solution.answer === "string") {
      solution.answer = toNum(solution.answer);
    }
    return solution;
  };
