import { describe, it } from "node:test";
import { expect } from "chai";

import solution from "../../../src/translation-examples/third-order/function";
import { archiveFactory } from "../../../src/archive";
import { QueryParams, QuerySolution } from "../../../src/query";

const query = async (query: QueryParams): Promise<QuerySolution> => {
  return {
    answer: undefined,
    solutions: [],
    otherSolutions: [],
    weight: 0,
    uuid: "",
  };
};

const archive = archiveFactory({
  solutionUuid: "uuid",
  database: {
    query: () => Promise.resolve({ rows: [] }),
  } as any,
  dispatch: () => {},
  llm: {
    requestEmbedding: async () => {
      return [0.1, 0.2, 0.3, 0.4, 0.5];
    },
    requestCompletion: async () => {
      return "completion";
    },
  },
});

describe("Third-order translation example: function", () => {
  it("should return the expected solution", async () => {
    expect(await solution(query, archive)).deep.equal({
      answer: "ryybUnl beyqJnl",
      solutions: [],
      computed: true,
      query: false,
    });
  });
});
