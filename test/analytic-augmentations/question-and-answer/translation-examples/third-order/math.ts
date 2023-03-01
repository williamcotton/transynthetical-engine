import { describe, it } from "node:test";
import { expect } from "chai";

import solution from "../../../../../src/analytic-augmentations/question-and-answer/translation-examples/third-order/math";

import { archiveFactoryDatabase } from "../../../../../src/archive";

const database = {
  query: () => Promise.resolve({ rows: [] }),
} as any;

const archiveFactory = archiveFactoryDatabase(database);

const query = async (query: any): Promise<any> => {
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

describe("Third-order translation example: math", () => {
  it("should return the expected solution", async () => {
    expect(await solution(query, archive)).deep.equal({
      answer: 128485.59999999999,
      solutions: [],
      computed: true,
      query: false,
    });
  });
});
