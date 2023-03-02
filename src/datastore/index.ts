import { ArchivedFunction } from "../analytic-augmentations";
import { Archive } from "../archive";
import { Solution } from "../ask";

export type Response = {
  success: boolean;
  error?: string;
};

export type Datastore = {
  archives: {
    get: (name: string) => Promise<string>;
    add: (archive: Archive) => Promise<Response>;
    findNearest: (embedding: number[]) => Promise<ArchivedFunction[]>;
  };
  solutions: {
    add: (solution: Solution) => Promise<Response>;
  };
};

export const mockDatastore: Datastore = {
  archives: {
    get: async (name: string) => {
      return "function () { return 1; }";
    },
    add: async (archive: Archive) => {
      return { success: true };
    },
    findNearest: async (embedding: number[]) => {
      return [];
    },
  },
  solutions: {
    add: async (solution: Solution) => {
      return { success: true };
    },
  },
};
