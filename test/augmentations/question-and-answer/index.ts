import { describe, it } from "node:test";
import { expect } from "chai";

import { augmentation } from "../../../src/augmentations/question-and-answer";

describe("solve", () => {
  it("should have four orders", async () => {
    expect(augmentation.orders).to.have.lengthOf(4);
    expect(augmentation.orders[1]).to.have.lengthOf.above(0);
    expect(augmentation.orders[2]).to.have.lengthOf.above(0);
    expect(augmentation.orders[3]).to.have.lengthOf.above(0);
  });
});
