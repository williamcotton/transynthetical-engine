import { ArchivedFunction, TranslationTarget } from ".";
import fs from "fs";
import path from "path";

// get args from command line
const args = process.argv.slice(2);
const type = args[0];

const { compile } = require(`./${type}/compile.ts`);
const { buildPrompt } = require(`./${type}/build-prompt.ts`);

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

orders.forEach((order) => {
  const orderPath = path.join(__dirname, ".", type, order);
  const exemplarsPath = path.join(orderPath, "exemplars");
  const files = fs
    .readdirSync(exemplarsPath)
    .filter((file) => file.endsWith(".ts"));

  const preamblePath = path.join(orderPath, preambleFilename);
  const preamble = fs
    .readFileSync(preamblePath, "utf8")
    .replace(/(\r\n|\n|\r)/gm, " ");

  const exemplars: Exemplar[] = [];

  files.forEach((file) => {
    const filePath = path.join(exemplarsPath, file);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const match = fileContents.match(pattern);
    const extractedTarget = match ? match[1].trim() : "";

    const {
      extractedPrompt,
      extractedContext,
      preparedTarget,
      extractedEn,
      extractedTargetType,
      extractedArchivedFunctions,
    } = compile(extractedTarget, order, fileContents);

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
