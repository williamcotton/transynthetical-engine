import { describe, it } from "node:test";
import { expect } from "chai";

import { archiverFactory } from "../../src/archive";
import { mockDatastore } from "../../src/datastore";
import { augmentation } from "../../src/augmentations/question-and-answer";

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
      augmentation,
    });

    const addedResponse = await archiver.add({
      name: "test",
      func: t,
      argTypes: [{ s: "string" }],
      returnType: "string",
      description: "test description",
      isApplication: false,
      demonstration: "test demo",
    });

    expect(addedResponse).deep.equal({
      id: 1,
      name: "test",
      stringFunc: "function t(s) {\n    return s;\n}",
      argTypes: [{ s: "string" }],
      returnType: "string",
      isApplication: false,
      solutionUuid: "uuid",
      description: "test description",
      descriptionEmbedding: "[0.1,0.2,0.3,0.4,0.5]",
      demonstration: "test demo",
      verified: false,
      existing: false,
    });
  });
});
