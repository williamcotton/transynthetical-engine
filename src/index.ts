import { dispatch, Dispatch } from "./dispatch";
import { query } from "./query";
import { archive } from "./archive";
import { analyticAugmentations, buildQuestion } from "./analytic-augmentations";
import LLM from "./large-language-models";
import { TranslationTarget } from "./compiler";

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
  en?: string;
  solutions: Solution[];
  analytic?: boolean;
  synthetic?: boolean;
  computed?: boolean;
  parsed?: boolean;
  query?: boolean;
  error?: Error;
  raw?: any;
};

function parseCompletionText(
  completionText: string,
  dispatch: Dispatch
): Solution {
  let solution: Solution;
  try {
    solution = JSON.parse(completionText);
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
    dispatch({ type: "parse_error", completionText, error: e });
  }
  return solution;
}

export async function ask(
  prompt: string,
  dispatch: Dispatch,
  context: string = "",
  analyticAugmentation: string = analyticAugmentations[3]
) {
  // Augment the prompt with the analytic augmentation and the context.
  const augmentedPrompt = analyticAugmentation
    ? analyticAugmentation + buildQuestion(prompt, context)
    : prompt;

  // Request a completion from the large language model.
  const completionText = await LLM.requestCompletion(augmentedPrompt);

  // Parse the completion text.
  const solution = parseCompletionText(completionText, dispatch);

  // Evaluate the solution.
  let evaluated: { [key: string]: any } = {};
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

  // Return the solution and the evaluated solution.
  return { ...solution, ...evaluated };
}

ask(
  "What is the population of Geneseo, NY combined with the population of Rochester, NY, divided by string length of the answer to the question 'What is the capital of France?'?",
  dispatch
).then((resp) => console.log(resp));
