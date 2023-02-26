import { describe, it } from "node:test";
import { expect } from "chai";

import solution from "../../../src/translation-examples/third-order/archived-functions";
import { archiveFactory } from "../../../src/archive";
import { QueryParams, QuerySolution } from "../../../src/query";

const query = async (query: QueryParams): Promise<QuerySolution> => {
  return {
    answer: undefined,
    solutions: [],
    otherSolutions: [],
    weight: 0,
    uuid: "",
  };
};

const string_func = `
function compute_rot13(str) {
  return str
    .split("")
    .map((char) => {
      const charCode = char.charCodeAt(0);
      if (charCode >= 65 && charCode <= 90) {
        return String.fromCharCode(((charCode - 65 + 13) % 26) + 65);
      } else if (charCode >= 97 && charCode <= 122) {
        return String.fromCharCode(((charCode - 97 + 13) % 26) + 97);
      } else {
        return char;
      }
    })
    .join("");
}
`;

const archive = archiveFactory({
  solutionUuid: "uuid",
  database: {
    query: () =>
      Promise.resolve({
        rows: [
          {
            name: "compute_rot13",
            string_func,
          },
        ],
      }),
  } as any,
  dispatch: () => {},
  llm: {
    requestEmbedding: async () => {
      return [0.1, 0.2, 0.3, 0.4, 0.5];
    },
    requestCompletion: async () => {
      return "completion";
    },
  },
});

describe("Third-order translation example: archived-functions", () => {
  it("should return the expected solution", async () => {
    expect(await solution(query, archive)).deep.equal({
      answer: "Uryyb Jbeyq",
      solutions: [],
      computed: true,
      query: false,
    });
  });
});
