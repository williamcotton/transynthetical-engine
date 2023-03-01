import { describe, it } from "node:test";
import { expect } from "chai";

import { LLM } from "../../src/large-language-models";

import { ask } from "../../src/ask";

import { analyticAugmentation } from "../../src/analytic-augmentations/question-and-answer";
import { insertSolutionFactory } from "../../src/ask/insert-solution";

function dispatch() {}

const database: any = {
  query: () => Promise.resolve({ rows: [] }),
};

const insertSolution = insertSolutionFactory(database);

const archiverFactory: any = () => ({
  findNearest: () => Promise.resolve([]),
});

describe("ask", () => {
  it("should return the expected solution to a first-order prompt", async () => {
    const prompt = "What is 5 + 7?";

    const mockLLM: LLM = {
      requestCompletion: async () => {
        return '{ "data": "({ answer: 12, solutions: [], computed: true })", "en": "The answer is {answer}" }';
      },
      requestEmbedding: async () => {
        return [0.1, 0.2, 0.3, 0.4, 0.5];
      },
    };

    const solution = await ask({
      prompt,
      dispatch,
      llm: mockLLM,
      insertSolution,
      analyticAugmentation,
      archiverFactory,
      queryEngines: [],
    });

    expect(solution.answer).equal(12);
    expect(solution.en_answer).equal("The answer is 12");
  });

  it("should return the expected solution to a second-order prompt", async () => {
    const prompt = "What is 5 + 7?";

    const mockLLM: LLM = {
      requestCompletion: async () => {
        return '{ "thunk": "(function () { const answer = 5 + 7; return { answer, solutions: [], computed: true }; })", "en": "The answer is {answer}" }';
      },
      requestEmbedding: async () => {
        return [0.1, 0.2, 0.3, 0.4, 0.5];
      },
    };

    const solution = await ask({
      prompt,
      dispatch,
      llm: mockLLM,
      insertSolution,
      analyticAugmentation,
      archiverFactory,
      queryEngines: [],
    });

    expect(solution.answer).equal(12);
    expect(solution.en_answer).equal("The answer is 12");
  });

  it("should return the expected solution to a third-order prompt", async () => {
    const prompt = "What is 5 + 7?";

    const mockLLM: LLM = {
      requestCompletion: async () => {
        return '{ "pthunk": "(function (query, dispatch, archive) { const answer = 5 + 7; return { answer, solutions: [], computed: true }; })", "en": "The answer is {answer}" }';
      },
      requestEmbedding: async () => {
        return [0.1, 0.2, 0.3, 0.4, 0.5];
      },
    };

    const solution = await ask({
      prompt,
      dispatch,
      llm: mockLLM,
      insertSolution,
      analyticAugmentation,
      archiverFactory,
      queryEngines: [],
    });

    expect(solution.answer).equal(12);
    expect(solution.en_answer).equal("The answer is 12");
  });

  it("should handle unstructured completion", async () => {
    const prompt = "What is 5 + 7?";

    const mockLLM: LLM = {
      requestCompletion: async () => {
        return "The answer is 12";
      },
      requestEmbedding: async () => {
        return [0.1, 0.2, 0.3, 0.4, 0.5];
      },
    };

    const solution = await ask({
      prompt,
      dispatch,
      llm: mockLLM,
      insertSolution,
      analyticAugmentation,
      archiverFactory,
      queryEngines: [],
    });

    expect(solution.answer).equal(undefined);
    expect(solution.en_answer).equal("");
  });
});
