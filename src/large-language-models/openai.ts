import { Configuration, OpenAIApi } from "openai";

import { LLM, Prompt } from ".";

export const openAiLLMFactory = ({ apiKey }: { apiKey: string }): LLM => {
  const configuration = new Configuration({ apiKey });
  const openai = new OpenAIApi(configuration);
  return {
    requestCompletion: async (prompt: Prompt) => {
      try {
        const exemplarMessages = prompt.exemplars
          .map((exemplar) => {
            return [
              {
                role: "user",
                content: exemplar.augmentedPrompt,
              },
              {
                role: "assistant",
                content: exemplar.completion,
              },
            ];
          })
          .flat();

        const messages = [
          { role: "system", content: prompt.preamble },
          ...exemplarMessages,
          { role: "user", content: prompt.augmentedPrompt },
        ] as unknown as [
          { role: "system" | "user" | "assistant"; content: string }
        ];

        const response = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          temperature: 0.7,
          messages,
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
