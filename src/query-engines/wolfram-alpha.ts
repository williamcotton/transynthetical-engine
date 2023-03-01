// @ts-ignore
import WolframAlphaAPI from "wolfram-alpha-node";
import { QueryEngine } from "../query";

export const wolframAlphaQueryEngineFactory = ({
  apiKey,
}: {
  apiKey: string;
}): QueryEngine => {
  const wolframAlpha = WolframAlphaAPI(apiKey);
  return {
    name: "wolfram",
    weight: 2,
    getContext: async ({ prompt, topic, target, type }) => {
      let context = "";
      const wolfromAlphaQuery = await wolframAlpha.getFull(prompt);
      if (wolfromAlphaQuery.pods) {
        context = JSON.stringify(
          wolfromAlphaQuery.pods.map((p: any) => ({
            [p.title]: p.subpods[0].plaintext,
          }))
        );
      }
      return context;
    },
  };
};
