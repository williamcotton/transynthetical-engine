import { Configuration, OpenAIApi } from "openai";

import { LLM } from ".";

export const openAiLLMFactory = ({ apiKey }: { apiKey: string }): LLM => {
  const configuration = new Configuration({ apiKey });
  const openai = new OpenAIApi(configuration);
  return {
    requestCompletion: async (prompt: string) => {
      try {
        const response = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          temperature: 0.7,
          messages: [{ role: "user", content: prompt }],
        });
        return response.data.choices[0].message?.content || "";
      } catch (e) {
        console.error(e);
        return "";
      }
    },
    requestEmbedding: async (text: string) => {
      try {
        const response = await openai.createEmbedding({
          model: "text-embedding-ada-002",
          input: text,
        });
        const [{ embedding }] = response.data.data;
        return embedding;
      } catch (e) {
        console.error(e);
        return [];
      }
    },
  };
};
