import { describe, it } from "node:test";
import { expect } from "chai";

import { augmentation } from "../../../src/augmentations/question-and-answer";

describe("solve", () => {
  it("should have four orders", async () => {
    expect(augmentation.orders).to.have.lengthOf(4);
  });
});
