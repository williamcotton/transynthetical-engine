import { Pool } from "pg";

import * as dotenv from "dotenv";
dotenv.config();

import { dispatch } from "./dispatch";
import { openAiLLMFactory } from "./large-language-models/openai";
import { pgDatastoreFactory } from "./datastore/pg";
import { augmentation } from "./augmentations/iqlang";
import { ask } from "./ask";

const database = new Pool({
  user: "",
  host: "localhost",
  database: "transynthetical-engine",
  password: "",
  port: 5432,
});

const llm = openAiLLMFactory({ apiKey: process.env.OPENAI_API_KEY || "" });

const datastore = pgDatastoreFactory(database);

const queryEngines = [];

const problem = {
  question:
    "Filter out all the even numbers from the array [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]",
};

ask({
  prompt: problem.question,
  dispatch,
  llm,
  augmentation,
  order: 3,
  datastore,
  queryEngines,
}).then((result) => {
  console.log(result);
});
