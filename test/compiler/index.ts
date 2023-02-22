import { describe, it } from "node:test";
import { expect } from "chai";

import compiledTranslationExamples from "../../src/compiler";

describe("compiler", () => {
  it("should return the compiled translation examples for each order", async () => {
    expect(compiledTranslationExamples).to.have.keys(
      "first-order",
      "second-order",
      "third-order"
    );
  });
});
