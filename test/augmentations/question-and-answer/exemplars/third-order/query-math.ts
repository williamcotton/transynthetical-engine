import { describe, it } from "node:test";
import { expect } from "chai";

import solution from "../../../../../src/augmentations/question-and-answer/exemplars/third-order/query-math";

import { archiverFactory } from "../../../../../src/archive";
import { mockDatastore } from "../../../../../src/datastore";

const database = {
  query: () => Promise.resolve({ rows: [] }),
} as any;

const archive = archiverFactory({
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
  datastore: mockDatastore,
});

async function mockQuery(query: any) {
  return {
    answer: 564599,
    solutions: [],
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
