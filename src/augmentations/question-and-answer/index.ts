import { Augmentation, ArchivedFunction } from "..";
import { Archiver } from "../../archive";
import { Solution } from "../../ask";
import { Dispatch } from "../../dispatch";
import { Query } from "../../query";

import firstOrder from "./build/first-order.json";
import secondOrder from "./build/second-order.json";
import thirdOrder from "./build/third-order.json";

export function buildPrompt({
  context,
  prompt,
  archivedFunctions = [],
}: {
  context: string;
  prompt: string;
  archivedFunctions: ArchivedFunction[];
}): string {
  const archivedFunctionsString = archivedFunctions
    .map((archivedFunction) => {
      const typesString = archivedFunction.arg_types.map((t) =>
        Object.values(t)
      );
      return `${archivedFunction.name}(${typesString})`;
    })
    .join(" ");
  return ` Q: C(${context}) EAF(${archivedFunctionsString}) ${prompt}`;
}

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

async function evaluator(solution: Solution, query: Query, archiver: Archiver) {
  let evaluated: { [key: string]: any } = { answer: undefined, en: "" }; // zeroth-order
  try {
    if (solution.data) {
      evaluated = JSON.parse(solution.data); // first-order
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

  return evaluated;
}

export const augmentation: Augmentation = {
  name: "question-and-answer",
  type: "analytic",
  orders: ["", firstOrder, secondOrder, thirdOrder],
  buildPrompt,
  evaluator,
  parseCompletion,
};
