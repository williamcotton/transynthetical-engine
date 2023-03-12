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
