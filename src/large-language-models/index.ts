import { Dispatch } from "../dispatch";

export type Exemplar = {
  augmentedPrompt: string;
  completion: string;
};

export type Prompt = {
  preamble: string;
  exemplars: Exemplar[];
  augmentedPrompt: string;
  model?: string | undefined;
};

export type LLM = {
  requestCompletion: ({
    prompt,
    dispatch,
  }: {
    prompt: Prompt;
    dispatch: Dispatch;
  }) => Promise<string>;
  requestEmbedding: (text: string) => Promise<number[]>;
};
