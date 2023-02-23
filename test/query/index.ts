import { describe, it } from "node:test";
import { expect } from "chai";

import { queryFactory } from "../../src/query";

function dispatch() {}

describe("query", () => {
  it("should call the query engines and return the answer from the response with the highest weight", async () => {
    const queryEngines = [
      () =>
        Promise.resolve({
          answer: 6000,
          solutions: [],
          otherSolutions: [],
          weight: 0.05,
        }),
      () =>
        Promise.resolve({
          answer: 7574,
          solutions: [],
          otherSolutions: [],
          weight: 0.2,
        }),
      () =>
        Promise.resolve({
          answer: undefined,
          solutions: [],
          otherSolutions: [],
          weight: 0.3,
        }),
    ];
    const query = queryFactory({
      queryEngines,
      solution: { answer: 0, uuid: "", solutions: [] },
      dispatch,
    });
    const querySolution = await query({
      prompt: "What is the population of Geneseo, NY?",
      topic: "Geneseo, NY",
      target: "population",
      type: "number",
    });
    console.log(querySolution);
    expect(querySolution).deep.equal({
      answer: 7574,
      solutions: [],
      otherSolutions: [
        { answer: 6000, solutions: [], otherSolutions: [], weight: 0.05 },
        { answer: undefined, solutions: [], otherSolutions: [], weight: 0.3 },
      ],
      weight: 0.2,
    });
  });
});
