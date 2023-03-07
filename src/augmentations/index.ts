import { Archiver } from "../archive";
import { Solution } from "../ask";
import { Dispatch } from "../dispatch";
import { Prompt } from "../large-language-models";
import { Query } from "../query";

export type ArchivedFunction = {
  name: string;
  arg_types: [{ [key: string]: string }];
};

export type TranslationTarget = "data" | "thunk" | "pthunk";

export type BuildPromptParams = {
  context: string;
  prompt: string;
  archivedFunctions: ArchivedFunction[];
};

export type Augmentation = {
  name: string;
  type: string;
  orders: Prompt[];
  buildPrompt: (params: BuildPromptParams) => string;
  evaluator: (
    dispatch: Dispatch,
    solution: Solution,
    query: Query,
    archiver: Archiver
  ) => Promise<{ [key: string]: any }>;
  parseCompletion: (
    completion: string,
    dispatch: Dispatch,
    uuid: string,
    parentSolutionUuid?: string
  ) => Solution;
};

export const zerothOrder: Prompt = {
  exemplars: [],
  preamble: "",
  augmentedPrompt: "",
};
