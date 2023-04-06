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
    getContext: async ({ prompt, topic, target, type, dispatch }) => {
      let context = "";
      const wolframAlphaQuery = await wolframAlpha.getFull(prompt);
      if (dispatch) dispatch({ type: "query_wolfram", wolframAlphaQuery });
      if (wolframAlphaQuery.pods) {
        context = JSON.stringify(
          wolframAlphaQuery.pods.map((p: any) => ({
            [p.title]: p.subpods[0].plaintext,
          }))
        );
      }
      return context;
    },
  };
};
