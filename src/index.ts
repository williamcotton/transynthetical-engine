import { ask } from "./ask";
import { dispatch } from "./dispatch";
import { analyticAugmentations } from "./analytic-augmentations";

const prompt =
  "Answering as [rowInt, colInt], writing custom predictBestMove, getEmptySpaces, minimax and checkWinner functions implemented in the thunk, what is the best tic-tac-toe move for player X on this board: [['X', '_', 'X'], ['_', '_', '_'], ['_', '_', '_']]?";

ask({
  prompt,
  dispatch,
  analyticAugmentation: analyticAugmentations[3],
}).then((solution) => console.log(solution));
