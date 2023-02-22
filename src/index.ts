import { ask } from "./ask";
import { dispatch } from "./dispatch";

ask({
  prompt:
    "What is the population of Geneseo, NY combined with the population of Rochester, NY, divided by string length of the answer to the question 'What is the capital of France?'?",
  dispatch,
}).then((resp) => console.log(resp));
