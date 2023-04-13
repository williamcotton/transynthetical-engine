import wikipedia from "wikipedia";
import { QueryEngine } from "../query";

export const wikipediaQueryEngine: QueryEngine = {
  name: "wikipedia",
  weight: 2,
  getContext: async ({ prompt, topic, target, type, dispatch }) => {
    const wikipediaSummary = await wikipedia.summary(topic);
    if (dispatch)
      dispatch({ type: "query_wikipedia", target, prompt, wikipediaSummary });
    const context = wikipediaSummary.extract;

    return context;
  },
};
