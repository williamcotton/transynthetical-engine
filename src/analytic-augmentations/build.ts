import { ArchivedFunction } from "../analytic-augmentations/index";
import fs from "fs";
import path from "path";
import ts from "typescript";

// get args from command line
const args = process.argv.slice(2);
const type = args[0];

const orders = ["first-order", "second-order", "third-order"];
const pattern =
  /\/\/ %TRANSLATION_TARGET_RESPONSE_START%([\s\S]*)\/\/ %TRANSLATION_TARGET_RESPONSE_END%/;

export type TranslationTarget = "data" | "thunk" | "pthunk";

const preludeFilename = "prelude.txt";

export type TranslationExample = {
  target: string;
  en: string;
  prompt: string;
  context: string;
  targetType: TranslationTarget;
  archivedFunctions: ArchivedFunction[];
};

export type OrderTranslationExample = {
  [filename: string]: TranslationExample;
};

export type TranslationExamplesAndPrelude = {
  translationExamples: TranslationExample[];
  prelude: string;
};

export type CompiledTranslationExamples = {
  [order: string]: TranslationExamplesAndPrelude;
};

const compiledTranslationExamples: CompiledTranslationExamples = {};

const options = {
  target: ts.ScriptTarget.ES2017,
  module: ts.ModuleKind.CommonJS,
};

orders.forEach((order) => {
  const orderPath = path.join(
    __dirname,
    ".",
    type,
    "translation-examples",
    order
  );
  const files = fs
    .readdirSync(orderPath)
    .filter((file) => file.endsWith(".ts"));

  const preludePath = path.join(orderPath, preludeFilename);
  const prelude = fs
    .readFileSync(preludePath, "utf8")
    .replace(/(\r\n|\n|\r)/gm, " ");

  const translationExamples: TranslationExample[] = [];

  files.forEach((file) => {
    const filePath = path.join(orderPath, file);
    const fileContents = fs.readFileSync(filePath, "utf8");

    const match = fileContents.match(pattern);

    const extractedTarget = match ? match[1].trim() : "";
    const javascriptTarget = ts.transpileModule(extractedTarget, {
      compilerOptions: options,
    }).outputText;

    // if first-order, remove semi-colons
    const trimmedTarget =
      order == "first-order"
        ? javascriptTarget.replace(/;/, "")
        : javascriptTarget;

    // wrap in parens to make it a valid expression
    const preparedTarget = `(${trimmedTarget})`;

    const enMatch = fileContents.match(/export const en = `(.*)`;/);
    const extractedEn = enMatch ? enMatch[1].trim() : "";

    const promptMatch = fileContents.match(/export const prompt = `(.*)`;/);
    const extractedPrompt = promptMatch ? promptMatch[1].trim() : "";

    const contextMatch = fileContents.match(/export const context = `(.*)`;/);
    const extractedContext = contextMatch ? contextMatch[1].trim() : "";

    const targetTypeMatch = fileContents.match(
      /export const targetType = `(.*)`/
    );
    const extractedTargetType = targetTypeMatch
      ? targetTypeMatch[1].trim()
      : "";

    const archivedFunctionsMatch = fileContents.match(
      /export const archivedFunctions = `(.*)`/
    );
    const extractedArchivedFunctions = archivedFunctionsMatch
      ? JSON.parse(archivedFunctionsMatch[1].trim())
      : [];

    translationExamples.push({
      prompt: extractedPrompt,
      context: extractedContext,
      target: preparedTarget,
      en: extractedEn,
      targetType: extractedTargetType as TranslationTarget,
      archivedFunctions: extractedArchivedFunctions as ArchivedFunction[],
    });
  });
  compiledTranslationExamples[order] = {
    translationExamples,
    prelude,
  };
});

export default compiledTranslationExamples;
