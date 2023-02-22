import { Solution } from "../ask";

export type ArgType = "string" | "number" | "boolean" | "object" | "array";

export type ArgTypes = {
  [key: string]: ArgType;
}[];

export type AddedResponse = {
  name: string;
  stringFunc: string;
  argTypes: ArgTypes;
  solutionUuid?: string;
};

export type Archive = {
  add: ArchiveAdd;
  solution: Solution;
};

export type ArchiveAdd = (
  name: string,
  func: (...args: any[]) => any,
  argTypes: ArgTypes
) => void;

export const archiveFactory = (solution: Solution): Archive => {
  return {
    add: (name, func, argTypes): AddedResponse => {
      const stringFunc = func.toString();
      const addedResponse = {
        name,
        stringFunc,
        argTypes,
        solutionUuid: solution.uuid,
      };
      return addedResponse;
    },
    solution,
  };
};

export const archive = archiveFactory({
  uuid: "uuid",
  answer: "answer",
  en: "en",
  en_answer: "en_answer",
  solutions: [],
});
