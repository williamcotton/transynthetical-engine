import { Pool } from "pg";

import { Solution } from "../ask";
import { Dispatch } from "../dispatch";
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
};

export type Archiver = {
  add: ArchiveAdd;
};

export type ArchiveAdd = (
  name: string,
  func: (...args: any[]) => any,
  argTypes: ArgTypes,
  description?: string
) => Archive;

export const archiveFactory = ({
  solution,
  database,
  dispatch,
}: {
  solution: Solution;
  database: Pool;
  dispatch: Dispatch;
}): Archiver => {
  return {
    add: (name, func, argTypes, description) => {
      const stringFunc = func.toString();
      const archive = {
        name,
        stringFunc,
        argTypes,
        solutionUuid: solution.uuid,
        description,
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
});
