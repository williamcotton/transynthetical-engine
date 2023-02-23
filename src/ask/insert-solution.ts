import sqlite3 from "sqlite3";
import { Solution } from "./index";

export function insertSolution(database: sqlite3.Database, solution: Solution) {
  database.serialize(() => {
    database.run(
      `
      CREATE TABLE IF NOT EXISTS solutions (
        uuid TEXT PRIMARY KEY,
        answer TEXT,
        en TEXT,
        en_answer TEXT,
        solutions TEXT,
        analytic INTEGER,
        synthetic INTEGER,
        computed INTEGER,
        parsed INTEGER,
        query INTEGER,
        error TEXT,
        raw TEXT,
        completion TEXT,
        original_prompt TEXT,
        augmented_prompt TEXT,
        analytic_augmentation TEXT,
        context TEXT,
        parentSolutionUUid TEXT,
        verified BOOLEAN DEFAULT 0
      )
    `
    );

    database.run(
      `
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
      parentSolutionUUid
    ) VALUES (
      $uuid,
      $answer,
      $en,
      $en_answer,
      $solutions,
      $analytic,
      $synthetic,
      $computed,
      $parsed,
      $query,
      $error,
      $raw,
      $completion,
      $original_prompt,
      $augmented_prompt,
      $analytic_augmentation,
      $context,
      $parentSolutionUUid
    )
  `,
      {
        $uuid: solution.uuid,
        $answer: JSON.stringify(solution.answer),
        $en: solution.en,
        $en_answer: solution.en_answer,
        $solutions: JSON.stringify(solution.solutions),
        $analytic: solution.analytic,
        $synthetic: solution.synthetic,
        $computed: solution.computed,
        $parsed: solution.parsed,
        $query: solution.query,
        $error: solution.error,
        $raw: solution.raw,
        $completion: solution.completion,
        $original_prompt: solution.originalPrompt,
        $augmented_prompt: solution.augmentedPrompt,
        $analytic_augmentation: solution.analyticAugmentation,
        $context: solution.context,
        $parentSolutionUUid: solution.parentSolutionUUid,
      }
    );
  });
}
