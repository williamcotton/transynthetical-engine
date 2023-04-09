import { Pool } from "pg";

import * as dotenv from "dotenv";
dotenv.config();

import { dispatch } from "../src/dispatch";
import { solve } from "../src/solve/qa-solver";
import { openAiLLMFactory } from "../src/large-language-models/openai";
import { pgDatastoreFactory } from "../src/datastore/pg";
import { augmentation } from "../src/augmentations/question-and-answer";
import { wikipediaQueryEngine } from "../src/query-engines/wikipedia";
import { wolframAlphaQueryEngineFactory } from "../src/query-engines/wolfram-alpha";
import { duckDuckGoQueryEngineFactory } from "../src/query-engines/duck-duck-go";

import { Data } from "../datasets/trivia-qa/qa/split_files/split_10.json";

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
  duckDuckGoQueryEngineFactory,
];

Data.forEach(async (problem) => {
  const result = await solve({
    problem,
    dispatch,
    llm,
    augmentation,
    order: 3,
    datastore,
    queryEngines,
  });
  console.log(result);
  await database.query(
    'INSERT INTO solved_problems (question, solution, "QuestionId", dataset, correct) VALUES ($1, $2, $3, $4, $5)',
    [
      problem.Question,
      result.answer,
      problem.QuestionId,
      "trivia-qa",
      result.correct,
    ]
  );
});
