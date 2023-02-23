import sqlite3 from "sqlite3";
import { Archive } from "./index";

export function insertArchive(database: sqlite3.Database, archive: Archive) {
  database.serialize(() => {
    database.run(`CREATE TABLE IF NOT EXISTS archives (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      stringFunc TEXT,
      argTypes TEXT,
      solutionUuid TEXT,
      verified BOOLEAN DEFAULT 0,
      description TEXT
    )`);

    const insertStatement = database.prepare(
      "INSERT INTO archives (name, stringFunc, argTypes, solutionUuid, description) VALUES (?, ?, ?, ?, ?)"
    );
    insertStatement.run(
      archive.name,
      archive.stringFunc,
      JSON.stringify(archive.argTypes),
      archive.solutionUuid,
      archive.description
    );
  });
}
