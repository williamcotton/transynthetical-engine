import { describe, it } from "node:test";
import { expect } from "chai";

import solution from "../../../../../src/augmentations/question-and-answer/third-order/exemplars/archived-functions";

import { archiverFactory } from "../../../../../src/archive";
import { mockDatastore } from "../../../../../src/datastore";

const query = async (query: any): Promise<any> => {
  return {
    answer: undefined,
    solutions: [],
    weight: 0,
    uuid: "",
  };
};

const compute_rot13 = `
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

const compute_pig_latin = `
function compute_pig_latin(word) {
  const vowels = ["a", "e", "i", "o", "u"];
  if (vowels.includes(word[0])) {
    return word + "way";
  }
  for (let i = 1; i < word.length; i++) {
    if (vowels.includes(word[i])) {
      return word.slice(i) + word.slice(0, i) + "ay";
    }
  }
  return word + "ay";
}
`;

mockDatastore.archives.get = async (name: string) => {
  return name === "compute_rot13" ? compute_rot13 : compute_pig_latin;
};

const archive = archiverFactory({
  solutionUuid: "uuid",
  dispatch: () => {},
  llm: {
    requestEmbedding: async () => {
      return [0.1, 0.2, 0.3, 0.4, 0.5];
    },
    requestCompletion: async () => {
      return "completion";
    },
  },
  datastore: mockDatastore,
});

describe("Third-order translation example: archived-functions", () => {
  it("should return the expected solution", async () => {
    expect(await solution(query, archive)).deep.equal({
      answer: "ryybUnl beyqJnl",
      solutions: [],
      computed: true,
      query: false,
    });
  });
});
