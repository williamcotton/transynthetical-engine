import { QueryParams, QuerySolution } from "../query";

export type QueryEngine = (query: QueryParams) => Promise<QuerySolution>;
