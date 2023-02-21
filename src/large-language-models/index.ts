import openAi from "./openai";

const defaultLLM = {
  requestCompletion: async (prompt: string) => {
    return openAi.requestCompletion(prompt);
  },
};

export default defaultLLM;
