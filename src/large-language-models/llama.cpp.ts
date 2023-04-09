import { Configuration, OpenAIApi } from "openai";

import { LLM, Prompt } from ".";
import shell from "shelljs";
import { Dispatch } from "../dispatch";
const { spawn } = require("child_process");

function escapeShellArg(arg: any) {
  return `'${arg.replace(/'/g, "'\\''")}'`;
}

export const llamaCppLLMFactory = ({
  rootDir,
  apiKey,
}: {
  rootDir: string;
  apiKey: string;
}): LLM => {
  const configuration = new Configuration({ apiKey });
  const openai = new OpenAIApi(configuration);
  return {
    requestCompletion: async ({
      prompt,
      dispatch,
    }: {
      prompt: Prompt;
      dispatch: Dispatch;
    }) => {
      const exemplarMessages = prompt.exemplars
        .map((exemplar) => {
          return `${exemplar.augmentedPrompt}\n${exemplar.completion}\n`;
        })
        .flat()
        .join("\n");

      const messages = `${prompt.preamble}\n${exemplarMessages}\n${prompt.augmentedPrompt}\n`;

      const child = spawn("./main", [
        "-m",
        "/Volumes/SanDesk/llama.cpp/models/7B/ggml-model-q4_0.bin",
        "-p",
        messages,
        "-n",
        "512",
      ]);

      return child.stdout;

      child.stdout.on("data", (data) => {
        console.log(`Output: ${data}`);
      });

      child.stderr.on("data", (data) => {
        console.error(`Error: ${data}`);
      });

      child.on("close", (code) => {
        console.log(`Child process exited with code ${code}`);
      });

      // try {

      //   const escapedMessages2 = escapeShellArg(
      //     messages.replace(/\n/g, "\\n").replace(/\r/g, "\\r")
      //   );

      //   // console.log(escapedMessages2);

      //   const escapedMessages = messages
      //     .replace(/\n/g, "\\n")
      //     .replace(/\r/g, "\\r")
      //     .replace(/"/g, '\\"')
      //     .replace(/'/g, "\\'");

      //   const result = shell.exec(
      //     `${rootDir}/main -m ${rootDir}/models/7B/ggml-model-q4_0.bin -p '${escapedMessages2}' -n 512`
      //   );

      //   if (result.code !== 0) {
      //     console.error(result.stderr);
      //     return "";
      //   } else {
      //     return result.stdout;
      //   }
      // } catch (e: unknown) {
      //   console.error((e as unknown as any).toString());
      //   return "";
      // }
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
