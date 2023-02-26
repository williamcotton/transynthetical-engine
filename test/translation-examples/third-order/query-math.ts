import { describe, it } from "node:test";
import { expect } from "chai";

import { QueryParams } from "../../../src/query";
import { archiveFactory } from "../../../src/archive";

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

async function mockQuery(query: QueryParams) {
  return {
    answer: 564599,
    solutions: [],
    otherSolutions: [],
    computed: true,
    query: false,
    weight: 0.1,
    uuid: "",
  };
}

import solution from "../../../src/translation-examples/third-order/query-math";

describe("Third-order translation example: query-math", () => {
  it("should return the expected solution", async () => {
    expect(await solution(mockQuery, archive)).deep.equal({
      answer: 1129198,
      solutions: [],
      computed: true,
      query: true,
    });
  });
});
