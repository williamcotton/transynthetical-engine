import { ArchivedFunction } from "..";

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
      const typesString = archivedFunction.arg_types.map(
        (t) => Object.keys(t) + ":" + Object.values(t)
      );
      return `${archivedFunction.name}(${typesString})`;
    })
    .join(" ");
  return `Instructions: DOM(${context}) ExistingArchivedFunctions(${archivedFunctionsString})\n\n${prompt} - `;
}
