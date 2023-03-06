import { describe, it } from "node:test";
import { expect } from "chai";

import solution from "../../../../../src/augmentations/question-and-answer/second-order/exemplars/function";

describe("Second-order translation example: function", () => {
  it("should return the expected solution", async () => {
    expect(await solution()).deep.equal({
      answer: "Uryyb Jbeyq",
      solutions: [],
      computed: true,
    });
  });
});
