import { ArchivedFunction, TranslationTarget } from ".";
import fs from "fs";
import path from "path";
import ts from "typescript";

// get args from command line
const args = process.argv.slice(2);
const type = args[0];

const orders = ["first-order", "second-order", "third-order"];
const pattern = /\/\/ %EXEMPLAR_START%([\s\S]*)\/\/ %EXEMPLAR_END%/;

const preambleFilename = "preamble.txt";

type Exemplar = {
  target: string;
  en: string;
  prompt: string;
  context: string;
  targetType: TranslationTarget;
  archivedFunctions: ArchivedFunction[];
};

type ExemplarsAndPrelude = {
  exemplars: Exemplar[];
  preamble: string;
};

type CompiledExemplars = {
  [order: string]: ExemplarsAndPrelude;
};

const compiledExemplars: CompiledExemplars = {};

const options = {
  target: ts.ScriptTarget.ES2017,
  module: ts.ModuleKind.CommonJS,
};

orders.forEach((order) => {
  const orderPath = path.join(__dirname, ".", type, "exemplars", order);
  const files = fs
    .readdirSync(orderPath)
    .filter((file) => file.endsWith(".ts"));

  const preamblePath = path.join(orderPath, preambleFilename);
  const preamble = fs
    .readFileSync(preamblePath, "utf8")
    .replace(/(\r\n|\n|\r)/gm, " ");

  const exemplars: Exemplar[] = [];

  files.forEach((file) => {
    const filePath = path.join(orderPath, file);
    const fileContents = fs.readFileSync(filePath, "utf8");

    const match = fileContents.match(pattern);

    const extractedTarget = match ? match[1].trim() : "";
    const javascriptTarget = ts.transpileModule(extractedTarget, {
      compilerOptions: options,
    }).outputText;

    // if higher than first-order, wrap in parens to make it a valid expression
    const preparedTarget =
      order == "first-order" ? extractedTarget : `(${javascriptTarget})`;

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

    exemplars.push({
      prompt: extractedPrompt,
      context: extractedContext,
      target: preparedTarget,
      en: extractedEn,
      targetType: extractedTargetType as TranslationTarget,
      archivedFunctions: extractedArchivedFunctions as ArchivedFunction[],
    });
  });
  compiledExemplars[order] = {
    exemplars,
    preamble,
  };
});

const firstOrder = compiledExemplars["first-order"];
const secondOrder = compiledExemplars["second-order"];
const thirdOrder = compiledExemplars["third-order"];

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

function exemplarToAnalyticAugmentation(exemplar: Exemplar): string {
  const jsonTarget = {
    [exemplar.targetType]: exemplar.target,
    en: exemplar.en,
  };
  const jsonTargetString = JSON.stringify(jsonTarget);
  return buildPrompt(exemplar) + jsonTargetString;
}

function exemplarsToAnalyticAugmentations({
  exemplars,
  preamble,
}: ExemplarsAndPrelude): string {
  return `${preamble} ${exemplars
    .map((exemplar) => exemplarToAnalyticAugmentation(exemplar))
    .join("")}`;
}

const firstOrderString = exemplarsToAnalyticAugmentations(firstOrder);
const secondOrderString = exemplarsToAnalyticAugmentations(secondOrder);
const thirdOrderString = exemplarsToAnalyticAugmentations(thirdOrder);

const buildPath = path.join(__dirname, ".", type, "build");

fs.mkdirSync(buildPath, { recursive: true });

// write as json
fs.writeFileSync(
  path.join(buildPath, "first-order.json"),
  JSON.stringify(firstOrderString)
);
fs.writeFileSync(
  path.join(buildPath, "second-order.json"),
  JSON.stringify(secondOrderString)
);
fs.writeFileSync(
  path.join(buildPath, "third-order.json"),
  JSON.stringify(thirdOrderString)
);
