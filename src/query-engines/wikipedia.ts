import wikipedia from "wikipedia";
import { QueryEngine } from "../query";

export const wikipediaQueryEngine: QueryEngine = {
  name: "wikipedia",
  weight: 1,
  getContext: async ({ prompt, topic, target, type }) => {
    const wikipediaSummary = await wikipedia.summary(topic);
    const context = wikipediaSummary.extract;

    return context;
  },
};
