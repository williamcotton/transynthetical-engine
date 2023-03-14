import { Pool } from "pg";

import * as dotenv from "dotenv";
dotenv.config();

import { dispatch } from "./dispatch";
import { solve } from "./solve";
import { openAiLLMFactory } from "./large-language-models/openai";
import { pgDatastoreFactory } from "./datastore/pg";
import { augmentation } from "./augmentations/question-and-answer";
import { wikipediaQueryEngine } from "./query-engines/wikipedia";
import { wolframAlphaQueryEngineFactory } from "./query-engines/wolfram-alpha";

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

const database = new Pool({
  user: "",
  host: "localhost",
  database: "transynthetical-engine",
  password: "",
  port: 5432,
});

const llm = openAiLLMFactory({ apiKey: process.env.OPENAI_API_KEY || "" });

const datastore = pgDatastoreFactory(database);

const queryEngines = [
  wolframAlphaQueryEngineFactory({
    apiKey: process.env.WOLFRAM_ALPHA_API_KEY || "",
  }),
  wikipediaQueryEngine,
];

// openEnded[3]
// "Answering as [rowInt, colInt], writing custom predictBestMove, getEmptySpaces, minimax and checkWinner functions implemented in the thunk, what is the best tic-tac-toe move for player X on this board: [['X', '_', 'X'], ['_', '_', '_'], ['_', '_', '_']]?";

// trivia[7]
// "What is the population of Geneseo, NY?";

// trivia[10]
// "What is the population of Geneseo, NY combined with the population of Rochester, NY, divided by string length of the answer to the question 'What is the capital of France?'?";

// addition[5]
// "The hobby store normally sells 10,576 trading cards per month. In June, the hobby store sold 15,498 more trading cards than normal. In total, how many trading cards did the hobby store sell in June?";

const problem = trivia[10];

solve({
  problem,
  dispatch,
  llm,
  augmentation,
  order: 3,
  datastore,
  queryEngines,
}).then((result) => {
  return console.log(result);
});
