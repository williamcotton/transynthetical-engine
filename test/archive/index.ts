import { describe, it } from "node:test";
import { expect } from "chai";

import { archiveFactory } from "../../src/archive";

function t(s: string) {
  return s;
}

describe("compiler", () => {
  it("should return the compiled translation examples for each order", async () => {
    const solution = {
      uuid: "uuid",
      answer: "answer",
      en: "en",
      en_answer: "en_answer",
      solutions: [],
    };
    const archive = archiveFactory({ solution });
    const addedResponse = archive.add("test", t, [{ s: "string" }]);
    expect(addedResponse).deep.equal({
      name: "test",
      stringFunc: "function t(s) {\n    return s;\n}",
      argTypes: [{ s: "string" }],
      solutionUuid: "uuid",
    });
  });
});
