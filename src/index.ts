import { ask } from "./ask";
import { dispatch } from "./dispatch";
import { analyticAugmentations } from "./analytic-augmentations";

const prompt =
  "What is the population of Geneseo, NY combined with the population of Rochester, NY, divided by string length of the answer to the question 'What is the capital of France?'?";

ask({
  prompt,
  dispatch,
  analyticAugmentation: analyticAugmentations[2],
}).then((solution) => console.log(solution));
