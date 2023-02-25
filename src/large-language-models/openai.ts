import { Configuration, OpenAIApi } from "openai";

import * as dotenv from "dotenv";
import { LLM } from ".";
dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const openAiLLM: LLM = {
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
