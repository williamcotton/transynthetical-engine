import { v4 as uuidv4 } from "uuid";

import { Dispatch } from "../dispatch";
import { QueryFactory } from "../query";
import { ArchiverFactory } from "../archive";
import { LLM } from "../large-language-models";
import {
  AnalyticAugmentation,
  TranslationTarget,
} from "../analytic-augmentations";

type SolutionTranslationTarget = {
  [Type in TranslationTarget]?: string;
};

export function toNum(str: string) {
  if (str.indexOf(".") !== -1) {
    return Math.round(parseFloat(str.replace(/,/g, "")) * 100) / 100;
  }
  return parseInt(str.replace(/,/g, ""), 10);
}

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
};

export type ThunkSolution = Omit<Solution, "uuid">;

function parseCompletion(
  completion: string,
  dispatch: Dispatch,
  uuid: string,
  parentSolutionUuid?: string
): Solution {
  let solution: Solution;
  try {
    solution = JSON.parse(completion);
    solution.uuid = uuid;
    solution.parentSolutionUuid = parentSolutionUuid;
    dispatch({ type: "json_parse", solution });
  } catch (e) {
    solution = {
      uuid,
      parentSolutionUuid,
      answer: undefined,
      en: "",
      en_answer: "",
      solutions: [],
      analytic: false,
      synthetic: false,
      computed: false,
      parsed: false,
      error: e as unknown as any,
    };
    dispatch({ type: "parse_error", completion, error: e });
  }
  return solution;
}

type AskParams = {
  prompt: string;
  dispatch: Dispatch;
  order?: number;
  analyticAugmentation: AnalyticAugmentation;
  context?: string;
  llm: LLM;
  evaluate?: boolean;
  parentSolutionUuid?: string;
  queryFactory: QueryFactory;
  archiverFactory: ArchiverFactory;
  insertSolution: any;
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
  queryFactory,
  archiverFactory,
  insertSolution,
}: AskParams): Promise<Solution> {
  const uuid = uuidv4();

  const query = queryFactory({
    dispatch,
    solutionUuid: uuid,
    llm,
    analyticAugmentation,
    queryFactory,
    archiverFactory,
    ask,
    insertSolution,
  });
  const archiver = archiverFactory({ dispatch, llm, solutionUuid: uuid });

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
  const solution = parseCompletion(
    completion,
    dispatch,
    uuid,
    parentSolutionUuid
  );
  dispatch({ type: "ask_solution", solution });

  // Evaluate the solution.
  let evaluated: { [key: string]: any } = {};
  if (evaluate) {
    evaluated = { answer: undefined, en: "" }; // zeroth-order
    try {
      if (solution.data) {
        evaluated = eval(solution.data); // first-order
      } else if (solution.thunk) {
        evaluated = await eval(solution.thunk)(); // second-order
      } else if (solution.pthunk) {
        evaluated = await eval(solution.pthunk)(query, archiver); // third-order
      }
    } catch (e) {
      evaluated.error = e;
    }

    // Replace the {answer} placeholder in the English translation with the answer.
    evaluated.en_answer = solution.en
      ? solution.en.replace("{answer}", evaluated.answer || "")
      : "";
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

  await insertSolution(completeSolution);
  dispatch({ type: "ask_complete", ...completeSolution });

  return completeSolution;
}
