import { describe, it } from "node:test";
import { expect } from "chai";

import { archiveFactory } from "../../src/archive";

function dispatch() {}

const database = {
  query: () => Promise.resolve({ rows: [] }),
} as any;

function t(s: string) {
  return s;
}

describe("compiler", async () => {
  it("should return the compiled translation examples for each order", async () => {
    const solution = {
      uuid: "uuid",
      answer: "answer",
      en: "en",
      en_answer: "en_answer",
      solutions: [],
    };
    const llm = {
      requestEmbedding: async () => {
        return [0.1, 0.2, 0.3, 0.4, 0.5];
      },
    } as any;
    const archiver = archiveFactory({ solution, dispatch, database, llm });
    const addedResponse = await archiver.add(
      "test",
      t,
      [{ s: "string" }],
      "test"
    );
    expect(addedResponse).deep.equal({
      name: "test",
      stringFunc: "function t(s) {\n    return s;\n}",
      argTypes: [{ s: "string" }],
      solutionUuid: "uuid",
      description: "test",
      descriptionEmbedding: "[0.1,0.2,0.3,0.4,0.5]",
    });
  });
});
