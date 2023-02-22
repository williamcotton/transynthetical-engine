import { ask } from "./ask";
import { dispatch } from "./dispatch";
import { analyticAugmentations } from "./analytic-augmentations";
import { solve } from "./solve";

import {
  trivia,
  rot13,
  strings,
  addition,
  subtraction,
  decimals,
  ratiosAndPercentages,
  probabilityDataRelationships,
  division,
  multiplication,
  fibonacci,
  openEnded,
} from "./training-data";

// openEnded[3]
// "Answering as [rowInt, colInt], writing custom predictBestMove, getEmptySpaces, minimax and checkWinner functions implemented in the thunk, what is the best tic-tac-toe move for player X on this board: [['X', '_', 'X'], ['_', '_', '_'], ['_', '_', '_']]?";

// trivia[7]
// "What is the population of Geneseo, NY?";

// trivia[10]
// "What is the population of Geneseo, NY combined with the population of Rochester, NY, divided by string length of the answer to the question 'What is the capital of France?'?";

// addition[5]
// "The hobby store normally sells 10,576 trading cards per month. In June, the hobby store sold 15,498 more trading cards than normal. In total, how many trading cards did the hobby store sell in June?";

const problem = trivia[10];

solve(problem, dispatch).then((result) => console.log(result));
