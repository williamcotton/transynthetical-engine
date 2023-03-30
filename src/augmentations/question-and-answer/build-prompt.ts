import { ArchivedFunction } from "..";

export function buildPrompt({
  order,
  context,
  prompt,
  archivedFunctions = [],
}: {
  order: number;
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
  return `Question: Context(${context}) ExistingArchivedFunctions(${archivedFunctionsString}) ${prompt}`;
}
