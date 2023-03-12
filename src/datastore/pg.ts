import { Pool } from "pg";
import { Datastore } from ".";

import { Archive } from "../archive";
import { Solution } from "../ask";

export const pgDatastoreFactory = (database: Pool): Datastore => {
  return {
    archives: {
      get: async (name: string) => {
        const archive = await database.query(
          `SELECT * FROM archives WHERE verified = true AND name = $1`,
          [name]
        );

        if (archive.rows.length === 0) {
          return "() => {}";
        }

        return archive.rows[0].string_func;
      },

      getAll: async (): Promise<Archive[]> => {
        const archives = await database.query(
          `SELECT * FROM archives ORDER BY id DESC`
        );

        return archives.rows.map((archive) => {
          return {
            id: archive.id,
            name: archive.name,
            stringFunc: archive.string_func,
            argTypes: JSON.parse(archive.arg_types),
            solutionUuid: archive.solution_uuid,
            verified: archive.verified,
            description: archive.description,
            descriptionEmbedding: archive.description_embedding,
            demonstration: archive.demonstration,
            existing: true,
          };
        });
      },

      add: async (archive: Archive) => {
        const query = `
          INSERT INTO archives (
            name,
            string_func,
            arg_types,
            solution_uuid,
            verified,
            description,
            description_embedding,
            demonstration
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8
          )
          RETURNING id
        `;

        const values = [
          archive.name,
          archive.stringFunc,
          JSON.stringify(archive.argTypes),
          archive.solutionUuid,
          false,
          archive.description,
          archive.descriptionEmbedding,
          archive.demonstration,
        ];

        let resp;
        try {
          resp = await database.query(query, values);
        } catch (e: any) {
          const regex = /Key \(name\)=\((.*)\) already exists./;
          console.log(e.detail);
          const match = e.detail.match(regex);
          if (match) {
            const name = match[1];
            console.log("name", name);
            console.log("archive.name", archive.name);
            try {
              const existing = await database.query(
                `SELECT * FROM archives WHERE name = $1`,
                [name]
              );
              return { success: true, id: existing.rows[0].id, existing: true };
            } catch (e) {
              console.log("eeeeeeeeeeeee", e);
              return { success: false, id: -Infinity, existing: false };
            }
          }
        }

        const id = resp?.rows[0]?.id || 0;

        return { success: true, id, existing: false };
      },

      update: async (archive: Archive) => {
        const query = `
        UPDATE archives SET
          name = $1,
          string_func = $2,
          arg_types = $3,
          solution_uuid = $4,
          verified = $5,
          description = $6,
          description_embedding = $7,
          demonstration = $8
        WHERE id = $9
      `;
        const values = [
          archive.name,
          archive.stringFunc,
          JSON.stringify(archive.argTypes),
          archive.solutionUuid,
          archive.verified,
          archive.description,
          archive.descriptionEmbedding,
          archive.demonstration,
          archive.id,
        ];

        const resp = await database.query(query, values);

        return { success: true, id: archive.id };
      },

      delete: async (id: number) => {
        const query = `
        DELETE FROM archives WHERE id = $1
      `;
        const values = [id];

        await database.query(query, values);

        return { success: true, id };
      },

      findNearest: async (embedding: number[]) => {
        const minDistance = 2;

        console.log(
          `SELECT * FROM archives WHERE verified = true AND description_embedding <-> $1 < $2 ORDER BY description_embedding <-> $1 LIMIT 10`,
          [`[${[1, 2, 3]}]`, minDistance]
        );

        const archives = await database.query(
          `SELECT * FROM archives WHERE verified = true AND description_embedding <-> $1 < $2 ORDER BY description_embedding <-> $1 LIMIT 10`,
          [`[${embedding.toString()}]`, minDistance]
        );

        return archives.rows.map((archive) => {
          return {
            name: archive.name,
            arg_types: JSON.parse(archive.arg_types),
            description: archive.description,
          };
        });
      },
    },
    solutions: {
      add: async (solution: Solution) => {
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

        return { success: true, id: solution.uuid };
      },
    },
  };
};
