import { Pool, QueryResult } from "pg";
import { Archive } from "./index";

export function insertArchive(database: Pool, archive: Archive) {
  const query = `
    INSERT INTO archives (
      name,
      string_func,
      arg_types,
      solution_uuid,
      verified,
      description
    ) VALUES (
      $1, $2, $3, $4, $5, $6
    )
  `;

  const values = [
    archive.name,
    archive.stringFunc,
    JSON.stringify(archive.argTypes),
    archive.solutionUuid,
    false,
    archive.description,
  ];

  database.query(query, values);
}
