import { Pool, QueryResult } from "pg";
import { Solution } from "./index";

export function insertSolution(database: Pool, solution: Solution) {
  const query = `
    INSERT INTO solutions (
      uuid,
      answer,
      en,
      en_answer,
      solutions,
      analytic,
      synthetic,
      computed,
      parsed,
      query,
      error,
      raw,
      completion,
      original_prompt,
      augmented_prompt,
      analytic_augmentation,
      context,
      parent_solution_uuid,
      verified
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
      $11, $12, $13, $14, $15, $16, $17, $18, $19
    )
  `;

  const values = [
    solution.uuid,
    JSON.stringify(solution.answer),
    solution.en,
    solution.en_answer,
    JSON.stringify(solution.solutions),
    solution.analytic,
    solution.synthetic,
    solution.computed,
    solution.parsed,
    solution.query,
    solution.error,
    solution.raw,
    solution.completion,
    solution.originalPrompt,
    solution.augmentedPrompt,
    solution.analyticAugmentation,
    solution.context,
    solution.parentSolutionUUid,
    false,
  ];

  database.query(query, values);
}
