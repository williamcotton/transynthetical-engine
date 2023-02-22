import { describe, it } from "node:test";
import { expect } from "chai";

import { archive } from "../../../src/archive";
import { dispatch } from "../../../src/dispatch";
import { QueryParams } from "../../../src/query";

async function mockQuery(query: QueryParams) {
  return {
    answer: 564599,
    solutions: [],
    otherSolutions: [],
    computed: true,
    query: false,
    weight: 0.1,
  };
}

mockQuery.engines = [] as any;

import solution from "../../../src/translation-examples/third-order/query-math";

describe("Third-order translation example: query-math", () => {
  it("should return the expected solution", async () => {
    expect(await solution(dispatch, mockQuery, archive)).deep.equal({
      answer: 1129198,
      solutions: [],
      computed: true,
      query: true,
    });
  });
});
