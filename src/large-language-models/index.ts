export type Exemplar = {
  augmentedPrompt: string;
  completion: string;
};

export type Prompt = {
  preamble: string;
  exemplars: Exemplar[];
  augmentedPrompt: string;
};

export type LLM = {
  requestCompletion: (prompt: Prompt) => Promise<string>;
  requestEmbedding: (text: string) => Promise<number[]>;
};
