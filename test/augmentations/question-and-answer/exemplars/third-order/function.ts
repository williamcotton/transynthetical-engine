import { describe, it } from "node:test";
import { expect } from "chai";

import solution from "../../../../../src/augmentations/question-and-answer/third-order/exemplars/function";

import { archiverFactory } from "../../../../../src/archive";
import { mockDatastore } from "../../../../../src/datastore";

const database = {
  query: () => Promise.resolve({ rows: [] }),
} as any;

const query = async (query: any): Promise<any> => {
  return {
    answer: undefined,
    solutions: [],
    weight: 0,
    uuid: "",
  };
};

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
