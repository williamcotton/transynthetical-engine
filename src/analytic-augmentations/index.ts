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

export type AnalyticAugmentation = {
  orders: string[];
  buildPrompt: (params: BuildPromptParams) => string;
};
