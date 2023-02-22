import compiledTranslationExamples, {
  TranslationExample,
  TranslationExamplesAndPrelude,
} from "../compiler";

const firstOrder = compiledTranslationExamples["first-order"];
const secondOrder = compiledTranslationExamples["second-order"];
const thirdOrder = compiledTranslationExamples["third-order"];

export function buildPrompt({
  context,
  prompt,
}: {
  context: string;
  prompt: string;
}): string {
  return ` Q: C(${context}) ${prompt}`;
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
