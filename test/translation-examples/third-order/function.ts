import { describe, it } from "node:test";
import { expect } from "chai";

import { archive } from "../../../src/archive";
import { dispatch } from "../../../src/dispatch";
import { query } from "../../../src/query";

import solution from "../../../src/translation-examples/third-order/function";

describe("Third-order translation example: function", () => {
  it("should return the expected solution", async () => {
    expect(await solution(dispatch, query, archive)).deep.equal({
      answer: "Uryyb Jbeyq",
      solutions: [],
      computed: true,
      query: false,
    });
  });
});
