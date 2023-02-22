import fs from "fs";
import path from "path";
import ts from "typescript";

const directories = ["first-order", "second-order", "third-order"];
const pattern =
  /\/\/ %TRANSLATION_TARGET_RESPONSE_START%([\s\S]*)\/\/ %TRANSLATION_TARGET_RESPONSE_END%/;

export type TranslationTarget = "data" | "thunk" | "pthunk";

const preludeFilename = "prelude.txt";

export type TranslationExample = {
  target: string;
  en: string;
  question: string;
  context: string;
  targetType: TranslationTarget;
};

export type DirectoryTranslationExample = {
  [filename: string]: TranslationExample;
};

export type TranslationExamplesAndPrelude = {
  translationExamples: TranslationExample[];
  prelude: string;
};

export type ExtractedTexts = {
  [directory: string]: TranslationExamplesAndPrelude;
};

const extractedTexts: ExtractedTexts = {};

const options = {
  target: ts.ScriptTarget.ES2017,
  module: ts.ModuleKind.CommonJS,
};

directories.forEach((directory) => {
  const directoryPath = path.join(
    __dirname,
    "..",
    "translation-examples",
    directory
  );
  const files = fs
    .readdirSync(directoryPath)
    .filter((file) => file.endsWith(".ts"));

  const preludePath = path.join(directoryPath, preludeFilename);
  const prelude = fs
    .readFileSync(preludePath, "utf8")
    .replace(/(\r\n|\n|\r)/gm, " ");

  const translationExamples: TranslationExample[] = [];

  files.forEach((file) => {
    const filePath = path.join(directoryPath, file);
    const fileContents = fs.readFileSync(filePath, "utf8");

    const match = fileContents.match(pattern);

    const extractedTarget = match ? match[1].trim() : "";
    const javascriptTarget = ts.transpileModule(extractedTarget, {
      compilerOptions: options,
    }).outputText;

    // remove newlines, extra spaces, and double quotes
    const trimmedTarget = javascriptTarget
      .replace(/(\r\n|\n|\r)/gm, "")
      .replace(/\s+/g, " ")
      .replace(/"/g, "'");

    // if the last character is a semi-colon, remove it then wrap in parens
    const preparedTarget = `(${
      trimmedTarget[trimmedTarget.length - 1] === ";"
        ? trimmedTarget.slice(0, -1)
        : trimmedTarget
    })`;

    const enMatch = fileContents.match(/export const en = `(.*)`;/);
    const extractedEn = enMatch ? enMatch[1].trim() : "";

    const questionMatch = fileContents.match(/export const question = `(.*)`;/);
    const extractedQuestion = questionMatch ? questionMatch[1].trim() : "";

    const contextMatch = fileContents.match(/export const context = `(.*)`;/);
    const extractedContext = contextMatch ? contextMatch[1].trim() : "";

    const targetTypeMatch = fileContents.match(
      /export const targetType = `(.*)`/
    );
    const extractedTargetType = targetTypeMatch
      ? targetTypeMatch[1].trim()
      : "";

    translationExamples.push({
      question: extractedQuestion,
      context: extractedContext,
      target: preparedTarget,
      en: extractedEn,
      targetType: extractedTargetType as TranslationTarget,
    });
  });
  extractedTexts[directory] = {
    translationExamples,
    prelude,
  };
});

export default extractedTexts;
