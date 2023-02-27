import { v4 as uuidv4 } from "uuid";

import { Dispatch } from "../dispatch";
import { queryFactory } from "../query";
import { archiveFactory } from "../archive";
import { analyticAugmentations, buildPrompt } from "../analytic-augmentations";
import { LLM } from "../large-language-models";
import { TranslationTarget } from "../compiler";
import { QueryEngine } from "../query-engines";

import { openAiLLM } from "../large-language-models/openai";
import { wikipediaQueryEngine } from "../query-engines/wikipedia";
import { wolframAlphaQueryEngine } from "../query-engines/wolfram-alpha";
import { insertSolution } from "./insert-solution";
import { Pool } from "pg";

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
  answer: any; //
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
  analyticAugmentation?: string;
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
  context?: string;
  analyticAugmentation?: string;
  llm?: LLM;
  evaluate?: boolean;
  queryEngines?: QueryEngine[];
  database: Pool;
  parentSolutionUuid?: string;
};

export async function ask({
  prompt,
  dispatch,
  context = "",
  analyticAugmentation = analyticAugmentations[3], // third-order
  llm = openAiLLM,
  evaluate = true,
  queryEngines = [wolframAlphaQueryEngine, wikipediaQueryEngine],
  database,
  parentSolutionUuid,
}: AskParams): Promise<Solution> {
  const uuid = uuidv4();

  // Create the query and archive functions.
  const query = queryFactory({
    queryEngines,
    solutionUuid: uuid,
    dispatch,
    database,
  });
  const archiver = archiveFactory({
    solutionUuid: uuid,
    dispatch,
    database,
    llm,
  });

  dispatch({ type: "ask", prompt, context, analyticAugmentation, uuid });

  // Request an embedding from the large language model.
  const embedding = await llm.requestEmbedding(prompt);

  dispatch({ type: "ask_embedding", embedding });

  const archivedFunctions = await archiver.findNearest(embedding);

  // Augment the prompt with the analytic augmentation and the context.
  const augmentedPrompt = analyticAugmentation
    ? analyticAugmentation + buildPrompt({ context, prompt, archivedFunctions })
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

  await insertSolution(database, completeSolution);
  dispatch({ type: "ask_complete", ...completeSolution });

  return completeSolution;
}
