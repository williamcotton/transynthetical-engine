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
          model: prompt.model ?? "gpt-3.5-turbo",
          temperature: 0.7,
          messages,
        });
        console.log(response);
        return response.data.choices[0].message?.content || "";
      } catch (e: unknown) {
        console.error((e as unknown as any).toString());
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
      } catch (e: unknown) {
        console.error((e as unknown as any).toString());
        const array = Array.from({ length: 1536 }, () => Math.random() * 2 - 1);
        return array;
      }
    },
  };
};
