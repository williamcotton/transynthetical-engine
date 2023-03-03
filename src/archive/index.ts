import { ArchivedFunction } from "../augmentations";
import { Dispatch } from "../dispatch";
import { LLM } from "../large-language-models";
import { Datastore } from "../datastore";

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
  add: ArchiverAdd;
  get: ArchiverGet;
  findNearest: ArchiverFindNearest;
};

export type ArchiverAdd = (
  name: string,
  func: (...args: any[]) => any | string,
  argTypes: ArgTypes,
  description: string
) => Promise<Archive>;

export type ArchiverGet = (name: string) => Promise<(...args: any[]) => any>;

export type ArchiverFindNearest = (
  embedding: number[]
) => Promise<ArchivedFunction[]>;

export type ArchiverFactory = (params: ArchiverFactoryParams) => Archiver;

export type ArchiverFactoryParams = {
  solutionUuid: string;
  dispatch: Dispatch;
  llm: LLM;
  datastore: Datastore;
};

export const archiverFactory = ({
  datastore,
  solutionUuid,
  dispatch,
  llm,
}: ArchiverFactoryParams): Archiver => {
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

      await datastore.archives.add(archive);
      dispatch({ type: "archiver_add", archive });

      return archive;
    },
    get: async (name) => {
      const stringFunc = await datastore.archives.get(name);
      dispatch({ type: "archiver_get", name, stringFunc });

      let func: (...args: any[]) => any;
      try {
        func = eval(`(${stringFunc})`);
      } catch (e) {
        func = () => 0;
      }

      return func;
    },
    findNearest: datastore.archives.findNearest,
  };
};
