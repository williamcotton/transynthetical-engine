import { ArchivedFunction } from "../augmentations";
import { Archive } from "../archive";
import { Solution } from "../ask";

export type ArchiveResponse = {
  success: boolean;
  id: number;
  error?: string;
  existing?: boolean;
};

export type SolutionResponse = {
  success: boolean;
  id: string;
  error?: string;
};

export type Datastore = {
  archives: {
    get: (name: string) => Promise<string>;
    getComplete: (name: string) => Promise<Archive | void>;
    add: (archive: Archive) => Promise<ArchiveResponse>;
    update: (archive: Archive) => Promise<ArchiveResponse>;
    delete: (id: number) => Promise<ArchiveResponse>;
    getAll: () => Promise<Archive[]>;
    findNearest: (embedding: number[]) => Promise<ArchivedFunction[]>;
  };
  solutions: {
    add: (solution: Solution) => Promise<SolutionResponse>;
  };
};

export const mockDatastore: Datastore = {
  archives: {
    get: async (name: string) => {
      return "function () { return 1; }";
    },
    getComplete: async (name: string) => {
      return {
        id: 1,
        name: "test",
        stringFunc: "function () { return 1; }",
        argTypes: [],
        returnType: "number",
        isApplication: false,
        solutionUuid: "uuid",
        verified: true,
        description: "test",
        descriptionEmbedding: "[0, 0, 0]",
        demonstration: "test",
        existing: true,
      };
    },
    getAll: async () => {
      return [];
    },
    add: async (archive: Archive) => {
      return { success: true, id: 1 };
    },
    update: async (archive: Archive) => {
      return { success: true, id: 1 };
    },
    delete: async (id: number) => {
      return { success: true, id };
    },
    findNearest: async (embedding: number[]) => {
      return [];
    },
  },
  solutions: {
    add: async (solution: Solution) => {
      return { success: true, id: "uuid" };
    },
  },
};
