import { describe, it } from "node:test";
import { expect } from "chai";

import { analyticAugmentations } from "../../src/analytic-augmentations";

describe("solve", () => {
  it("should have four orders", async () => {
    expect(analyticAugmentations).to.have.lengthOf(4);
    expect(analyticAugmentations[1]).to.have.lengthOf.above(0);
    expect(analyticAugmentations[2]).to.have.lengthOf.above(0);
    expect(analyticAugmentations[3]).to.have.lengthOf.above(0);
  });
});
