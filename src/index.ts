import { Pool, QueryResult } from "pg";

import * as dotenv from "dotenv";
dotenv.config();

import { ask } from "./ask";
import { dispatch } from "./dispatch";
import { solve } from "./solve";
import { openAiLLMFactory } from "./large-language-models/openai";
import { wikipediaQueryEngineFactory } from "./query-engines/wikipedia";
import { wolframAlphaQueryEngineFactory } from "./query-engines/wolfram-alpha";

const llm = openAiLLMFactory({ apiKey: process.env.OPENAI_API_KEY || "" });

const queryEngines = [
  wikipediaQueryEngineFactory({ llm, ask }),
  wolframAlphaQueryEngineFactory({
    llm,
    apiKey: process.env.WOLFRAM_ALPHA_API_KEY || "",
    ask,
  }),
];

const database = new Pool({
  user: "",
  host: "localhost",
  database: "transynthetical-engine",
  password: "",
  port: 5432,
});

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

const problem = openEnded[3];

solve({ problem, dispatch, database, llm, queryEngines }).then((result) => {
  return console.log(result);
});
