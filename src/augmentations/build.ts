import { ArchivedFunction, TranslationTarget } from ".";
import fs from "fs";
import path from "path";
import { Exemplar, Prompt } from "../large-language-models";

// get args from command line
const args = process.argv.slice(2);
const type = args[0];

const { compile } = require(`./${type}/compile.ts`);
const { buildPrompt } = require(`./${type}/build-prompt.ts`);

const orders = ["first-order", "second-order", "third-order"];

function orderStringToNumber(order: string): number {
  switch (order) {
    case "first-order":
      return 1;
    case "second-order":
      return 2;
    case "third-order":
      return 3;
    default:
      return 0;
  }
}

const pattern = /\/\/ %EXEMPLAR_START%([\s\S]*)\/\/ %EXEMPLAR_END%/;

const preambleFilename = "preamble.txt";

type CompiledPrompts = {
  [order: string]: Prompt;
};

const compiledExemplars: CompiledPrompts = {};

orders.forEach((order) => {
  const orderPath = path.join(__dirname, ".", type, order);
  const exemplarsPath = path.join(orderPath, "exemplars");
  const files = fs
    .readdirSync(exemplarsPath)
    .filter((file) => file.endsWith(".ts") || file.endsWith(".tsx"));

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

    const completionObject = {
      [extractedTargetType]: preparedTarget,
    };

    if (
      extractedEn &&
      typeof extractedEn === "string" &&
      extractedEn.length > 0
    ) {
      completionObject["en"] = extractedEn;
    }

    const completion = JSON.stringify(completionObject, null, 2);

    exemplars.push({
      augmentedPrompt: buildPrompt({
        order: orderStringToNumber(order),
        context: extractedContext,
        prompt: extractedPrompt,
        archivedFunctions: extractedArchivedFunctions,
      }),
      completion,
    });
  });
  compiledExemplars[order] = {
    exemplars,
    preamble,
    augmentedPrompt: "",
  };
});

const firstOrder = compiledExemplars["first-order"];
const secondOrder = compiledExemplars["second-order"];
const thirdOrder = compiledExemplars["third-order"];

const buildPath = path.join(__dirname, ".", type, "build");

fs.mkdirSync(buildPath, { recursive: true });

// write as json
fs.writeFileSync(
  path.join(buildPath, "first-order.json"),
  JSON.stringify(firstOrder, null, 2)
);
fs.writeFileSync(
  path.join(buildPath, "second-order.json"),
  JSON.stringify(secondOrder, null, 2)
);
fs.writeFileSync(
  path.join(buildPath, "third-order.json"),
  JSON.stringify(thirdOrder, null, 2)
);
