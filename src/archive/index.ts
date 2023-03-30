import { ArchivedFunction, Augmentation } from "../augmentations";
import { Dispatch } from "../dispatch";
import { LLM } from "../large-language-models";
import { Datastore } from "../datastore";
import { ask } from "../ask";

export type ArgType =
  | "string"
  | "number"
  | "number[]"
  | "boolean"
  | "object"
  | "array"
  | "function"
  | "undefined"
  | "null"
  | "Document"
  | "Archiver"
  | "any"
  | "HTMLButtonElement"
  | "HTMLDivElement"
  | "HTMLFormElement"
  | "HTMLAnchorElement"
  | "HTMLImageElement"
  | "HTMLElement"
  | "HTMLInputElement"
  | "HTMLCanvasElement"
  | "CanvasRenderingContext2D";

export type ArgTypes = {
  [key: string]: ArgType | ArgTypes;
}[];

export type Archive = {
  id: number;
  name: string;
  stringFunc: string;
  func?: Func;
  argTypes: ArgTypes;
  returnType: ArgType;
  isApplication: boolean;
  solutionUuid: string;
  description: string;
  descriptionEmbedding: string;
  demonstration: string;
  verified: boolean;
  existing: boolean;
};
export type BuildNewArchive = Pick<
  Archive,
  "name" | "argTypes" | "returnType" | "isApplication" | "description"
> & {
  prompt: string;
};

export type NewArchive = Pick<
  Archive,
  "name" | "argTypes" | "returnType" | "description"
> & {
  func: Func;
  isApplication?: boolean;
  demonstration?: string;
  existing?: boolean;
  previousVersion?: Archive;
};

export type Archiver = {
  add: ArchiverAdd;
  get: ArchiverGet;
  update: ArchiverUpdate;
  build: ArchiverBuild;
  getAll: ArchiverGetAll;
  findNearest: ArchiverFindNearest;
};

export type Func = (...args: any[]) => any | string;

export type ArchiverAdd = (newArchive: NewArchive) => Promise<Archive>;

export type ArchiverGet = (name: string) => Promise<Func>;

export type ArchiverBuild = (archive: BuildNewArchive) => Promise<Func>;

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
  augmentation: Augmentation;
};

const cache: Archive[] = [];

export const archiverFactory = ({
  datastore,
  solutionUuid,
  dispatch,
  llm,
  augmentation,
}: ArchiverFactoryParams): Archiver => {
  const archiverInstance: Archiver = {
    add: async ({
      name,
      func,
      argTypes,
      returnType,
      description,
      isApplication = false,
      demonstration = "",
      existing = false,
      previousVersion,
    }) => {
      const stringFunc = typeof func === "string" ? func : func.toString();

      const embedding = await llm.requestEmbedding(description);
      const descriptionEmbedding = `[${embedding.toString()}]`;

      const archive: Archive = {
        id: Infinity,
        name,
        stringFunc,
        argTypes,
        returnType,
        isApplication,
        solutionUuid,
        description,
        descriptionEmbedding,
        demonstration,
        verified: false,
        existing: false,
      };

      const resp = await datastore.archives.add(archive);
      const id = resp.id;
      archive.id = id;

      cache.push(archive);

      if (typeof resp.existing == "boolean" && resp.existing) {
        archive.existing = true;
        dispatch({ type: "archiver_add_existing", archive });
      } else {
        dispatch({ type: "archiver_add", archive });
      }

      return archive;
    },
    get: async (name) => {
      // Try to find the archive in the cache
      const cachedArchive = cache.find((archive) => archive.name === name);

      let stringFunc: string;
      let dispatchType: string;

      if (cachedArchive) {
        // If the archive is found in the cache, use the cached version
        stringFunc = cachedArchive.stringFunc;
        dispatchType = "archiver_get_cache";
      } else {
        // If the archive is not found in the cache, get it from the datastore
        stringFunc = await datastore.archives.get(name);
        dispatchType = "archiver_get_datastore";
      }

      dispatch({ type: dispatchType, name, stringFunc });

      let func: (...args: any[]) => any;
      try {
        func = eval(`(${stringFunc})`);
      } catch (e) {
        func = () => 0;
      }

      return func;
    },
    build: async (newArchive: BuildNewArchive) => {
      const { name, argTypes, returnType, description, isApplication } =
        newArchive;

      let argString = "";
      for (let i = 0; i < argTypes.length; i++) {
        const key = Object.keys(argTypes[i])[0];
        const value = argTypes[i][key];
        argString += `${key}: ${value}`;
        if (i !== argTypes.length - 1) {
          argString += ", ";
        }
      }

      const context = `(${
        isApplication ? "application" : "function"
      }) async function ${name}(${argString}): ${returnType}`;

      const solution = await ask({
        prompt: newArchive.prompt,
        dispatch,
        order: 2,
        augmentation,
        context,
        llm,
        evaluate: true,
        parentSolutionUuid: solutionUuid,
        datastore,
        queryEngines: [],
      });

      dispatch({
        type: "archiver_build_solution",
        solution,
      });

      const func = solution.answer as Func;

      dispatch({
        type: "archiver_build_func",
        name,
        stringFunc: func.toString(),
      });

      console.log("await archiverInstance.add", {
        name,
        func,
        argTypes,
        returnType,
        description,
        isApplication,
      });
      await archiverInstance.add({
        name,
        func,
        argTypes,
        returnType,
        description,
        isApplication,
      });
      console.log("done await archiverInstance.add");

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
  return archiverInstance;
};
