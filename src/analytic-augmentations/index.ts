import compiledTranslationExamples, {
  TranslationExample,
  TranslationExamplesAndPrelude,
} from "../compiler";

const firstOrder = compiledTranslationExamples["first-order"];
const secondOrder = compiledTranslationExamples["second-order"];
const thirdOrder = compiledTranslationExamples["third-order"];

export const archivedFunctions = [
  {
    name: "compute_rot13",
    arg_types: [{ str: "string" }],
  },
];

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

function translationExampleToAnalyticAugmentation(
  translationExample: TranslationExample
): string {
  const jsonTarget = {
    [translationExample.targetType]: translationExample.target,
    en: translationExample.en,
  };
  const jsonTargetString = JSON.stringify(jsonTarget);
  return buildPrompt(translationExample) + jsonTargetString;
}

function translationExamplesToAnalyticAugmentations({
  translationExamples,
  prelude,
}: TranslationExamplesAndPrelude): string {
  return `${prelude} ${translationExamples
    .map((translationExample) =>
      translationExampleToAnalyticAugmentation(translationExample)
    )
    .join("")}`;
}

export const analyticAugmentations = [
  "",
  translationExamplesToAnalyticAugmentations(firstOrder),
  translationExamplesToAnalyticAugmentations(secondOrder),
  translationExamplesToAnalyticAugmentations(thirdOrder),
];

export type ArchivedFunction = {
  name: string;
  arg_types: [{ [key: string]: string }];
};
