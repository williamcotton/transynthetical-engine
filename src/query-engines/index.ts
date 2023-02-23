import { Dispatch } from "../dispatch";
import { QueryParams, QuerySolution } from "../query";

export type QueryEngineParams = QueryParams & {
  dispatch: Dispatch;
};

export type QueryEngine = (query: QueryEngineParams) => Promise<QuerySolution>;
