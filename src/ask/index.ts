import { v4 as uuidv4 } from "uuid";

import { Dispatch } from "../dispatch";
import { archiverFactory, ArchiverFactory } from "../archive";
import { QueryEngine, queryFactory } from "../query";
import { LLM } from "../large-language-models";
import {
  AnalyticAugmentation,
  TranslationTarget,
} from "../analytic-augmentations";
import { Datastore } from "../datastore";

type SolutionTranslationTarget = {
  [Type in TranslationTarget]?: string;
};

export type Solution = SolutionTranslationTarget & {
  answer: any;
  solutions: Solution[];
  originalPrompt?: string;
  augmentedPrompt?: string;
  en?: string;
  en_answer?: string;
  analytic?: boolean;
  synthetic?: boolean;
  computed?: boolean;
  parsed?: boolean;
  query?: boolean;
  error?: Error;
  raw?: any;
  completion?: string;
  uuid: string;
  analyticAugmentation?: AnalyticAugmentation;
  context?: string;
  parentSolutionUuid?: string;
  promptEmbedding?: string;
  type?: string;
};

export type ThunkSolution = Omit<Solution, "uuid">;

export type AskParams = {
  prompt: string;
  dispatch: Dispatch;
  order?: number;
  analyticAugmentation: AnalyticAugmentation;
  context?: string;
  llm: LLM;
  evaluate?: boolean;
  parentSolutionUuid?: string;
  datastore: Datastore;
  queryEngines: QueryEngine[];
};

export type Ask = (params: AskParams) => Promise<Solution>;

export async function ask({
  prompt,
  dispatch,
  context = "",
  analyticAugmentation, // third-order
  order = 3,
  llm,
  evaluate = true,
  parentSolutionUuid,
  datastore,
  queryEngines,
}: AskParams): Promise<Solution> {
  const uuid = uuidv4();

  const archiver = archiverFactory({
    datastore,
    dispatch,
    llm,
    solutionUuid: uuid,
  });
  const query = queryFactory({
    queryEngines,
    dispatch,
    llm,
    analyticAugmentation,
    evaluate,
    uuid,
    datastore,
    ask,
  });

  const analyticAugmentationOrder = analyticAugmentation.orders[order];

  dispatch({ type: "ask", prompt, context, analyticAugmentationOrder, uuid });

  // Request an embedding from the large language model.
  const embedding = await llm.requestEmbedding(prompt);

  dispatch({ type: "ask_embedding", embedding });

  const archivedFunctions = await archiver.findNearest(embedding);

  // Augment the prompt with the analytic augmentation and the context.
  const augmentedPrompt = analyticAugmentationOrder
    ? analyticAugmentationOrder +
      analyticAugmentation.buildPrompt({ context, prompt, archivedFunctions })
    : prompt;

  dispatch({
    type: "ask_augmented_prompt",
    augmentedPrompt,
  });

  // Request a completion from the large language model.
  const completion = await llm.requestCompletion(augmentedPrompt);
  dispatch({ type: "ask_completion", completion });

  // Parse the completion text.
  const solution = analyticAugmentation.parseCompletion(
    completion,
    dispatch,
    uuid,
    parentSolutionUuid
  );
  dispatch({ type: "ask_solution", solution });

  // Evaluate the solution.
  let evaluated: { [key: string]: any } = {};
  if (evaluate) {
    evaluated = await analyticAugmentation.evaluator(solution, query, archiver);
  }

  const completeSolution = {
    ...solution,
    ...evaluated,
    originalPrompt: prompt,
    augmentedPrompt,
    analyticAugmentation,
    completion,
    context,
  };

  await datastore.solutions.add(completeSolution);
  dispatch({ type: "ask_complete", ...completeSolution });

  return completeSolution;
}
