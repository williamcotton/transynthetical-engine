import { describe, it } from "node:test";
import { expect } from "chai";

import solution from "../../../src/translation-examples/second-order/function";

describe("Second-order translation example: function", () => {
  it("should return the expected solution", async () => {
    expect(await solution()).deep.equal({
      answer: "Uryyb Jbeyq",
      solutions: [],
      computed: true,
    });
  });
});
