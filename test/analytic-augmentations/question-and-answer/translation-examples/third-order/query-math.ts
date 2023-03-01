import { describe, it } from "node:test";
import { expect } from "chai";

import solution from "../../../../../src/analytic-augmentations/question-and-answer/translation-examples/third-order/query-math";

import { QueryParams } from "../../../../../src/query";
import { archiveFactoryDatabase } from "../../../../../src/archive";

const database = {
  query: () => Promise.resolve({ rows: [] }),
} as any;

const archiveFactory = archiveFactoryDatabase(database);

const archive = archiveFactory({
  solutionUuid: "uuid",
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
