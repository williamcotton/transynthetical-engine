import { AnalyticAugmentation, ArchivedFunction } from "..";

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

export const analyticAugmentation: AnalyticAugmentation = {
  orders: ["", firstOrder, secondOrder, thirdOrder],
  buildPrompt,
};
