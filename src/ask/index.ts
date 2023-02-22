import { Dispatch } from "../dispatch";
import { query } from "../query";
import { archive } from "../archive";
import { analyticAugmentations, buildPrompt } from "../analytic-augmentations";
import { LLM } from "../large-language-models";
import openAiLLM from "../large-language-models/openai";
import { TranslationTarget } from "../compiler";

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
  answer: string | number | undefined;
  originalPrompt?: string;
  augmentedPrompt?: string;
  en?: string;
  solutions: Solution[];
  analytic?: boolean;
  synthetic?: boolean;
  computed?: boolean;
  parsed?: boolean;
  query?: boolean;
  error?: Error;
  raw?: any;
  completion?: string;
};

function parseCompletion(completion: string, dispatch: Dispatch): Solution {
  let solution: Solution;
  try {
    solution = JSON.parse(completion);
    dispatch({ type: "json_parse" });
  } catch (e) {
    solution = {
      answer: undefined,
      en: "",
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
};

export async function ask({
  prompt,
  dispatch,
  context = "",
  analyticAugmentation = analyticAugmentations[3],
  llm = openAiLLM,
  evaluate = true,
}: AskParams): Promise<Solution> {
  dispatch({ type: "ask", prompt, context, analyticAugmentation });

  // Augment the prompt with the analytic augmentation and the context.
  const augmentedPrompt = analyticAugmentation
    ? analyticAugmentation + buildPrompt(prompt, context)
    : prompt;

  // Request a completion from the large language model.
  const completion = await llm.requestCompletion(augmentedPrompt);

  // Parse the completion text.
  const solution = parseCompletion(completion, dispatch);

  // Evaluate the solution.
  let evaluated: { [key: string]: any } = {};
  if (evaluate) {
    if (solution.data) {
      evaluated = eval(solution.data); // first-order
    } else if (solution.thunk) {
      evaluated = await eval(solution.thunk)(); // second-order
    } else if (solution.pthunk) {
      evaluated = await eval(solution.pthunk)(dispatch, query, archive); // third-order
    } else {
      evaluated = { answer: undefined, en: "" }; // zeroth-order
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
    completion,
  };

  dispatch({ type: "ask_complete", ...completeSolution });

  return completeSolution;
}
