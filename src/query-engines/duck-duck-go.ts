import { QueryEngine } from "../query";

import { load } from "cheerio";
import request from "request-promise";

async function searchDuckDuckGo(query: string): Promise<string[]> {
  try {
    const response = await request.post("https://lite.duckduckgo.com/lite", {
      form: {
        q: query,
      },
    });
    const $ = load(response);
    const resultArray: string[] = [];
    $("td.result-snippet").each((index, element) => {
      const textContent = $(element).text().trim();
      resultArray.push(textContent);
    });
    return resultArray;
  } catch (error) {
    return [];
  }
}

export const duckDuckGoQueryEngineFactory: QueryEngine = {
  name: "duckDuckGo",
  weight: 1,
  getContext: async ({ prompt, topic, target, type, dispatch }) => {
    const ddgSummary = await searchDuckDuckGo(prompt);
    if (dispatch)
      dispatch({
        type: "query_duckduckgo",
        prompt,
        topic,
        target,
        ddgSummary,
      });
    const context = ddgSummary.join(" - ");

    return context;
  },
};
