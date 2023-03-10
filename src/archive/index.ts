import { ArchivedFunction } from "../augmentations";
import { Dispatch } from "../dispatch";
import { LLM } from "../large-language-models";
import { Datastore } from "../datastore";

export type ArgType =
  | "string"
  | "number"
  | "boolean"
  | "object"
  | "array"
  | "Document"
  | "Archiver"
  | "any"
  | "HTMLImageElement"
  | "HTMLElement"
  | "HTMLInputElement"
  | "HTMLCanvasElement";

export type ArgTypes = {
  [key: string]: ArgType | ArgTypes;
}[];

export type Archive = {
  id: number;
  name: string;
  stringFunc: string;
  argTypes: ArgTypes;
  solutionUuid: string;
  description: string;
  descriptionEmbedding: string;
  demonstration: string;
  verified: boolean;
};

export type Archiver = {
  add: ArchiverAdd;
  get: ArchiverGet;
  update: ArchiverUpdate;
  getAll: ArchiverGetAll;
  findNearest: ArchiverFindNearest;
};

export type ArchiverAdd = (
  name: string,
  func: (...args: any[]) => any | string,
  argTypes: ArgTypes,
  description: string,
  demonstration?: string
) => Promise<Archive>;

export type ArchiverGet = (name: string) => Promise<(...args: any[]) => any>;

export type ArchiverUpdate = (
  archive: Archive
) => Promise<{ success: boolean; error?: string; id: number }>;

export type ArchiverGetAll = () => Promise<Archive[]>;

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
    add: async (name, func, argTypes, description, demonstration = "") => {
      const stringFunc = typeof func === "string" ? func : func.toString();

      const embedding = await llm.requestEmbedding(description);
      const descriptionEmbedding = `[${embedding.toString()}]`;

      const archive: Archive = {
        id: Infinity,
        name,
        stringFunc,
        argTypes,
        solutionUuid,
        description,
        descriptionEmbedding,
        demonstration,
        verified: false,
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
    update: async (archive) => {
      const response = await datastore.archives.update(archive);
      dispatch({ type: "archiver_update", archive });

      return response;
    },
    getAll: async () => {
      const archives = await datastore.archives.getAll();
      dispatch({ type: "archiver_get_all", archives });

      return archives;
    },
    findNearest: datastore.archives.findNearest,
  };
};
