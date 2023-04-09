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
  return `Context(${context})\nInstructions: ${prompt} - `;
}
