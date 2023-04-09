import { Archive, Archiver } from "../../../../archive";
import { ThunkSolution } from "../../../../ask";

export const targetType = `pthunk`;

export const prompt = `get the sum of the numbers 1, 2, and the maximum of 1 and 3 and the minimum of 1, 2, and 3`;

// %EXEMPLAR_START%
async function solution(
  query: any,
  archiver: Archiver,
  document: Document
): Promise<ThunkSolution> {
  const answer = `sum({1, 2, max(1, min(3, 1, 2), 2)})`;

  return {
    answer,
    solutions: [],
    computed: true,
    query: false,
  };
}
// %EXEMPLAR_END%

export default solution;
