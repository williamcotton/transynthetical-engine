import { Augmentation, zerothOrder } from "..";
import { Archiver } from "../../archive";
import { Solution } from "../../ask";
import { Dispatch } from "../../dispatch";
import { Query } from "../../query";
import { buildPrompt } from "./build-prompt";

import firstOrder from "./build/first-order.json";
import secondOrder from "./build/second-order.json";
import thirdOrder from "./build/third-order.json";

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

async function evaluator(
  dispatch: Dispatch,
  solution: Solution,
  query: Query,
  archiver: Archiver
) {
  let evaluated: { [key: string]: any } = { answer: undefined, en: "" }; // zeroth-order
  try {
    if (solution.data) {
      // first-order
      dispatch({ type: "evaluator_data", data: solution.data });
      evaluated = JSON.parse(solution.data);
    } else if (solution.thunk) {
      // second-order
      dispatch({ type: "evaluator_thunk", thunk: solution.thunk });
      evaluated = await Function(`return ${solution.thunk}()`)();
    } else if (solution.pthunk) {
      // third-order
      dispatch({ type: "evaluator_pthunk", pthunk: solution.pthunk });
      evaluated = await Function(
        "query",
        "archiver",
        `return ${solution.pthunk}(query, archiver)`
      )(query, archiver);
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
  orders: [zerothOrder, firstOrder, secondOrder, thirdOrder],
  buildPrompt,
  evaluator,
  parseCompletion,
};
