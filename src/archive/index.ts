import { Pool } from "pg";

import { Solution } from "../ask";
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
};

export type ArchiveAdd = (
  name: string,
  func: (...args: any[]) => any,
  argTypes: ArgTypes,
  description: string
) => Promise<Archive>;

export const archiveFactory = ({
  solution,
  database,
  dispatch,
  llm,
}: {
  solution: Solution;
  database: Pool;
  dispatch: Dispatch;
  llm: LLM;
}): Archiver => {
  return {
    add: async (name, func, argTypes, description) => {
      const stringFunc = func.toString();

      const embeddings = await llm.requestEmbedding(description);
      const descriptionEmbedding = `[${embeddings.toString()}]`;

      const archive = {
        name,
        stringFunc,
        argTypes,
        solutionUuid: solution.uuid,
        description,
        descriptionEmbedding,
      };

      insertArchive(database, archive);
      dispatch({ type: "add", archive });

      return archive;
    },
  };
};

export const archive = archiveFactory({
  solution: {
    uuid: "uuid",
    answer: "answer",
    en: "en",
    en_answer: "en_answer",
    solutions: [],
  },
  database: {
    query: () => Promise.resolve({ rows: [] }),
  } as any,
  dispatch: () => {},
  llm: {
    requestEmbedding: async () => {
      return [0.1, 0.2, 0.3, 0.4, 0.5];
    },
    requestCompletion: async () => {
      return "completion";
    },
  },
});
