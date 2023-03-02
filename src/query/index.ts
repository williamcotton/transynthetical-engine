import { AnalyticAugmentation } from "../analytic-augmentations";
import { ArchiverFactory } from "../archive";
import { AskParams, Solution } from "../ask";
import { Datastore } from "../datastore";
import { Dispatch } from "../dispatch";
import { LLM } from "../large-language-models";

export type QueryParams = {
  prompt: string;
  topic: string;
  target: string;
  type: string;
};

export type QuerySolution = {
  answer: any;
  solutions: Solution[];
};

export type Query = {
  (query: QueryParams): Promise<QuerySolution>;
};

export type QueryEngine = {
  getContext: (query: QueryParams) => Promise<string>;
  name: string;
  weight: number;
};

export function queryFactory({
  queryEngines,
  dispatch,
  llm,
  analyticAugmentation,
  evaluate,
  uuid,
  datastore,
  ask,
}: {
  queryEngines: QueryEngine[];
  dispatch: Dispatch;
  llm: LLM;
  analyticAugmentation: AnalyticAugmentation;
  evaluate: boolean;
  uuid: string;
  datastore: Datastore;
  ask: (params: AskParams) => Promise<Solution>;
}) {
  const query = async ({
    prompt,
    topic,
    target,
    type,
  }: QueryParams): Promise<QuerySolution> => {
    const queryEngineContexts = await Promise.all(
      queryEngines.map((queryEngine) =>
        queryEngine.getContext({ prompt, topic, target, type })
      )
    );

    const queryEngineWeights = queryEngines.map(
      (queryEngine) => queryEngine.weight
    );

    const topResponse = queryEngineContexts.reduce(
      (acc, context, i) =>
        queryEngineWeights[i] > acc.weight && context
          ? { weight: queryEngineWeights[i], context }
          : acc,
      { weight: 0, context: "" }
    );

    const queryContext = topResponse.context;

    const solution = await ask({
      prompt,
      dispatch,
      order: 1,
      analyticAugmentation,
      context: queryContext,
      llm,
      evaluate,
      parentSolutionUuid: uuid,
      datastore,
      queryEngines: [],
    });

    return {
      answer: solution.answer,
      solutions: [],
    };
  };
  return query;
}
