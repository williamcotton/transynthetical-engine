import extractedTexts, {
  TranslationExample,
  TranslationExamplesAndPrelude,
} from "../compiler";

const firstOrderExtractedTexts = extractedTexts["first-order"];
const secondOrderExtractedTexts = extractedTexts["second-order"];
const thirdOrderExtractedTexts = extractedTexts["third-order"];

export function buildQuestion(context: string, question: string): string {
  return `Q: C(${context}) ${question}`;
}

function extractedTextToAnalyticAugmentation(
  extractedText: TranslationExample
): string {
  const jsonTarget = {
    [extractedText.targetType]: extractedText.target,
    en: extractedText.en,
  };
  const jsonTargetString = JSON.stringify(jsonTarget);
  return (
    buildQuestion(extractedText.context, extractedText.question) +
    jsonTargetString
  );
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
