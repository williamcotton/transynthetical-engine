import { describe, it } from "node:test";
import { expect } from "chai";

import { analyticAugmentation } from "../../../src/analytic-augmentations/question-and-answer";

describe("solve", () => {
  it("should have four orders", async () => {
    expect(analyticAugmentation.orders).to.have.lengthOf(4);
    expect(analyticAugmentation.orders[1]).to.have.lengthOf.above(0);
    expect(analyticAugmentation.orders[2]).to.have.lengthOf.above(0);
    expect(analyticAugmentation.orders[3]).to.have.lengthOf.above(0);
  });
});
