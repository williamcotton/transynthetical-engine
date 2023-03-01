import { Configuration, OpenAIApi } from "openai";

import { LLM } from ".";

export const openAiLLMFactory = ({ apiKey }: { apiKey: string }): LLM => {
  const configuration = new Configuration({ apiKey });
  const openai = new OpenAIApi(configuration);
  return {
    requestCompletion: async (prompt: string) => {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        temperature: 0.7,
        max_tokens: 2048,
        prompt,
      });
      return response.data.choices[0].text || "";
    },
    requestEmbedding: async (text: string) => {
      const response = await openai.createEmbedding({
        model: "text-embedding-ada-002",
        input: text,
      });
      const [{ embedding }] = response.data.data;
      return embedding;
    },
  };
};
