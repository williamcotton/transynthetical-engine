import { describe, it } from "node:test";
import { expect } from "chai";

import solution from "../../../../../src/augmentations/question-and-answer/second-order/exemplars/computation";

describe("Second-order translation example: computation", () => {
  it("should return the expected solution", async () => {
    expect(await solution()).deep.equal({
      answer: 0.8571428571428571,
      solutions: [],
      computed: true,
    });
  });
});
