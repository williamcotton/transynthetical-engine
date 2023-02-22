import extractedTexts, {
  TranslationExample,
  TranslationExamplesAndPrelude,
} from "../compiler";

const firstOrderExtractedTexts = extractedTexts["first-order"];
const secondOrderExtractedTexts = extractedTexts["second-order"];
const thirdOrderExtractedTexts = extractedTexts["third-order"];

export function buildPrompt({
  context,
  prompt,
}: {
  context: string;
  prompt: string;
}): string {
  return ` Q: C(${context}) ${prompt}`;
}

function extractedTextToAnalyticAugmentation(
  extractedText: TranslationExample
): string {
  const jsonTarget = {
    [extractedText.targetType]: extractedText.target,
    en: extractedText.en,
  };
  const jsonTargetString = JSON.stringify(jsonTarget);
  return buildPrompt(extractedText) + jsonTargetString;
}

function extractedTextsToAnalyticAugmentations({
  translationExamples,
  prelude,
}: TranslationExamplesAndPrelude): string {
  return `${prelude} ${translationExamples
    .map((extractedText) => extractedTextToAnalyticAugmentation(extractedText))
    .join("")}`;
}

export const analyticAugmentations = [
  "",
  extractedTextsToAnalyticAugmentations(firstOrderExtractedTexts),
  extractedTextsToAnalyticAugmentations(secondOrderExtractedTexts),
  extractedTextsToAnalyticAugmentations(thirdOrderExtractedTexts),
];
