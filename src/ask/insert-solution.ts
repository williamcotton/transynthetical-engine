import { Pool } from "pg";
import { Solution } from "./index";

export const insertSolutionFactory = (database: Pool) => {
  return async function insertSolution(solution: Solution) {
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
        augmentation,
        context,
        parent_solution_uuid,
        verified,
        prompt_embedding
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16, $17, $18, $19,
        $20
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
      solution.augmentation,
      solution.context,
      solution.parentSolutionUuid,
      false,
      solution.promptEmbedding,
    ];

    await database.query(query, values);
  };
};
