import { ask } from "./ask";
import { dispatch } from "./dispatch";

const prompt =
  "What is the population of Geneseo, NY combined with the population of Rochester, NY, divided by string length of the answer to the question 'What is the capital of France?'?";

ask({
  prompt,
  dispatch,
}).then((solution) => console.log(solution));
