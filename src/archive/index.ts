import { Pool } from "pg";

import { Solution } from "../ask";
import { ArchivedFunction } from "../compiler";
import { Dispatch } from "../dispatch";
import { LLM } from "../large-language-models";
import { insertArchive } from "./insert-archive";

export type ArgType = "string" | "number" | "boolean" | "object" | "array";

export type ArgTypes = {
  [key: string]: ArgType;
}[];

export type Archive = {
  name: string;
  stringFunc: string;
  argTypes: ArgTypes;
  solutionUuid?: string;
  description?: string;
  descriptionEmbedding?: string;
};

export type Archiver = {
  add: ArchiveAdd;
  call: ArchiveCall;
  findNearest: ArchiveFindNearest;
};

export type ArchiveAdd = (
  name: string,
  func: (...args: any[]) => any,
  argTypes: ArgTypes,
  description: string
) => Promise<Archive>;

export type ArchiveCall = (name: string, ...args: any[]) => Promise<any>;

export type ArchiveFindNearest = (
  embedding: number[]
) => Promise<ArchivedFunction[]>;

export const archiveFactory = ({
  solutionUuid,
  database,
  dispatch,
  llm,
}: {
  solutionUuid: string;
  database: Pool;
  dispatch: Dispatch;
  llm: LLM;
}): Archiver => {
  return {
    add: async (name, func, argTypes, description) => {
      const stringFunc = func.toString();

      const embedding = await llm.requestEmbedding(description);
      const descriptionEmbedding = `[${embedding.toString()}]`;

      const archive = {
        name,
        stringFunc,
        argTypes,
        solutionUuid,
        description,
        descriptionEmbedding,
      };

      insertArchive(database, archive);
      dispatch({ type: "add", archive });

      return archive;
    },
    call: async (name, ...args) => {
      const archive = await database.query(
        `SELECT * FROM archives WHERE name = $1`,
        [name]
      );

      const func = eval(`(${archive.rows[0].string_func})`);
      const result = func(...args);

      return result;
    },
    findNearest: async (embedding) => {
      const archives = await database.query(
        `SELECT * FROM archives WHERE verified = true ORDER BY description_embedding <-> $1 LIMIT 10`,
        [`[${embedding.toString()}]`]
      );

      return archives.rows.map((archive) => {
        return {
          name: archive.name,
          arg_types: JSON.parse(archive.arg_types),
        };
      });
    },
  };
};
