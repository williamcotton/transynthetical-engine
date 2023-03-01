import { Pool } from "pg";

import { Solution } from "../ask";
import { ArchivedFunction } from "../analytic-augmentations";
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
  get: ArchiveGet;
  findNearest: ArchiveFindNearest;
};

export type ArchiveAdd = (
  name: string,
  func: (...args: any[]) => any | string,
  argTypes: ArgTypes,
  description: string
) => Promise<Archive>;

export type ArchiveGet = (name: string) => Promise<(...args: any[]) => any>;

export type ArchiveFindNearest = (
  embedding: number[]
) => Promise<ArchivedFunction[]>;

export type ArchiverFactory = (params: ArchiverFactoryParams) => Archiver;

export type ArchiverFactoryParams = {
  solutionUuid: string;
  dispatch: Dispatch;
  llm: LLM;
};

export const archiveFactoryDatabase =
  (database: Pool) =>
  ({ solutionUuid, dispatch, llm }: ArchiverFactoryParams): Archiver => {
    return {
      add: async (name, func, argTypes, description) => {
        const stringFunc = typeof func === "string" ? func : func.toString();

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

        await insertArchive(database, archive);
        dispatch({ type: "add", archive });

        return archive;
      },
      get: async (name) => {
        const archive = await database.query(
          `SELECT * FROM archives WHERE name = $1`,
          [name]
        );

        let func: (...args: any[]) => any;
        try {
          func = eval(`(${archive.rows[0].string_func})`);
        } catch (e) {
          func = () => 0;
        }

        return func;
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
