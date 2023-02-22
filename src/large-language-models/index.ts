export type LLM = {
  requestCompletion: (prompt: string) => Promise<string>;
};
