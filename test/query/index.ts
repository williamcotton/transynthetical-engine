import { describe, it } from "node:test";
import { expect } from "chai";

import { queryFactoryDatabase } from "../../src/query";

function dispatch() {}

const database = {
  query: () => Promise.resolve({ rows: [] }),
} as any;

const queryEngineFactories = [
  () => () =>
    Promise.resolve({
      answer: 6000,
      solutions: [],
      otherSolutions: [],
      weight: 0.05,
      uuid: "",
    }),
  () => () =>
    Promise.resolve({
      answer: 7574,
      solutions: [],
      otherSolutions: [],
      weight: 0.2,
      uuid: "",
    }),
  () => () =>
    Promise.resolve({
      answer: undefined,
      solutions: [],
      otherSolutions: [],
      weight: 0.3,
      uuid: "",
    }),
];

const queryFactory = queryFactoryDatabase({ database, queryEngineFactories });

describe("query", () => {
  it("should call the query engines and return the answer from the response with the highest weight", async () => {
    const query = queryFactory({
      dispatch,
      llm: {} as any,
      ask: () => Promise.resolve({}) as any,
      analyticAugmentation: {} as any,
      insertSolution: () => Promise.resolve({}),
      queryFactory,
      archiverFactory: {} as any,
      solutionUuid: "",
    });
    const querySolution = await query({
      prompt: "What is the population of Geneseo, NY?",
      topic: "Geneseo, NY",
      target: "population",
      type: "number",
    });
    expect(querySolution).deep.equal({
      answer: 7574,
      solutions: [],
      otherSolutions: [
        {
          answer: 6000,
          solutions: [],
          otherSolutions: [],
          weight: 0.05,
          uuid: "",
        },
        {
          answer: undefined,
          solutions: [],
          otherSolutions: [],
          weight: 0.3,
          uuid: "",
        },
      ],
      weight: 0.2,
      uuid: "",
    });
  });
});
