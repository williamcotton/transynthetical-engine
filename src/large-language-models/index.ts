export type LLM = {
  requestCompletion: (prompt: string) => Promise<string>;
  requestEmbedding: (text: string) => Promise<number[]>;
};
