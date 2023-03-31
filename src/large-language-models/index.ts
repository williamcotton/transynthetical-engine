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
  requestCompletion: (prompt: Prompt) => Promise<string>;
  requestEmbedding: (text: string) => Promise<number[]>;
};
