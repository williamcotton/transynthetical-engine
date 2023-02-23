import sqlite3 from "sqlite3";

import { Dispatch } from "../dispatch";
import { QueryParams, QuerySolution } from "../query";

export type QueryEngineParams = QueryParams & {
  dispatch: Dispatch;
  database: sqlite3.Database;
};

export type QueryEngine = (query: QueryEngineParams) => Promise<QuerySolution>;
