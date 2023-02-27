import { Pool } from "pg";
import { Archive } from "./index";

export async function insertArchive(database: Pool, archive: Archive) {
  const query = `
    INSERT INTO archives (
      name,
      string_func,
      arg_types,
      solution_uuid,
      verified,
      description,
      description_embedding
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7
    )
  `;

  const values = [
    archive.name,
    archive.stringFunc,
    JSON.stringify(archive.argTypes),
    archive.solutionUuid,
    false,
    archive.description,
    archive.descriptionEmbedding,
  ];

  await database.query(query, values);
}
