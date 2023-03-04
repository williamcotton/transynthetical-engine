import ts from "typescript";

const options = {
  target: ts.ScriptTarget.ES2017,
  module: ts.ModuleKind.CommonJS,
};

export function compile(
  extractedTarget: string,
  order: string,
  fileContents: string
) {
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
  const extractedTargetType = targetTypeMatch ? targetTypeMatch[1].trim() : "";

  const archivedFunctionsMatch = fileContents.match(
    /export const archivedFunctions = `(.*)`/
  );
  const extractedArchivedFunctions = archivedFunctionsMatch
    ? JSON.parse(archivedFunctionsMatch[1].trim())
    : [];
  return {
    extractedPrompt,
    extractedContext,
    preparedTarget,
    extractedEn,
    extractedTargetType,
    extractedArchivedFunctions,
  };
}
