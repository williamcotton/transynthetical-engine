import { describe, it } from "node:test";
import { expect } from "chai";

import { archiverFactory } from "../../src/archive";
import { mockDatastore } from "../../src/datastore";

function dispatch() {}

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
    const archiver = archiverFactory({
      solutionUuid,
      dispatch,
      llm,
      datastore: mockDatastore,
    });
    const addedResponse = await archiver.add(
      "test",
      t,
      [{ s: "string" }],
      "test",
      "test"
    );
    expect(addedResponse).deep.equal({
      id: 1,
      name: "test",
      stringFunc: "function t(s) {\n    return s;\n}",
      argTypes: [{ s: "string" }],
      solutionUuid: "uuid",
      description: "test",
      descriptionEmbedding: "[0.1,0.2,0.3,0.4,0.5]",
      demonstration: "test",
      verified: false,
      existing: false,
    });
  });
});
