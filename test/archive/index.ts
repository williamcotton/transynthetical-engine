import { describe, it } from "node:test";
import { expect } from "chai";

import { archiveFactoryDatabase } from "../../src/archive";

function dispatch() {}

const database = {
  query: () => Promise.resolve({ rows: [] }),
} as any;

const archiveFactory = archiveFactoryDatabase(database);

function t(s: string) {
  return s;
}

describe("archiver", async () => {
  it("should add a function to the archives", async () => {
    const solutionUuid = "uuid";
    const llm = {
      requestEmbedding: async () => {
        return [0.1, 0.2, 0.3, 0.4, 0.5];
      },
    } as any;
    const archiver = archiveFactory({ solutionUuid, dispatch, llm });
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
