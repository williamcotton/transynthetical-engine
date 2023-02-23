import sqlite3 from "sqlite3";

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
};

export type Archiver = {
  add: ArchiveAdd;
};

export type ArchiveAdd = (
  name: string,
  func: (...args: any[]) => any,
  argTypes: ArgTypes
) => Archive;

export const archiveFactory = ({
  solution,
  database,
  dispatch,
}: {
  solution: Solution;
  database: sqlite3.Database;
  dispatch: Dispatch;
}): Archiver => {
  return {
    add: (name, func, argTypes) => {
      const stringFunc = func.toString();
      const archive = {
        name,
        stringFunc,
        argTypes,
        solutionUuid: solution.uuid,
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
  database: new sqlite3.Database(":memory:"),
  dispatch: () => {},
});
