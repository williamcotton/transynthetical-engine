import { Pool } from "pg";

import { Dispatch } from "../dispatch";
import { QueryParams, QuerySolution } from "../query";

export type QueryEngineParams = QueryParams & {
  dispatch: Dispatch;
  database: Pool;
  parentSolutionUuid: string;
};

export type QueryEngine = (query: QueryEngineParams) => Promise<QuerySolution>;
