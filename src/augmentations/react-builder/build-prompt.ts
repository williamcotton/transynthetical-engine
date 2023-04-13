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
  const archivedFunctionsString = `ExistingArchivedFunctions(${
    order >= 3
      ? archivedFunctions
          .map((archivedFunction) => {
            const typesString = archivedFunction.arg_types.map(
              (t) => Object.keys(t) + ":" + Object.values(t)
            );
            return `${archivedFunction.name}(${typesString})`;
          })
          .join(" ")
      : ""
  })`;
  return `Context(${context})\n${archivedFunctionsString}\nInstructions: ${prompt} - `;
}
