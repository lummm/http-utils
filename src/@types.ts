import http from "http";
import url from "url";


export interface Req extends http.IncomingMessage {
  body?: any;
  qParams?: any;
  userId?: string;
};
export type Res = http.ServerResponse;
// a CB can return null to stop the handle flow
export type CB = (
  req: Req,
  res: Res,
  parsedUrl?: url.UrlWithParsedQuery // for compat with express-style handlers
) => Promise<{req: Req, res: Res} | void | null>;

export type DefaultHandler = (method?: string, path?: string) => CB[];
export type ErrorHandler = (
  error: Error,
  req: Req,
  res: Res,
) => Promise<void>;

export type RouteConf = {
  path: string;
  method: string;
  cbs: CB[];
};

export type ResponseType = "json" | "text"

type RouteDefiner = (
  path: string,
  ...cbs: CB[]
) => void;

export interface RoutesDefApi {
  GET: RouteDefiner;
  POST: RouteDefiner;
  PUT: RouteDefiner;
  list: () => RouteConf[];
  // specfiy a handler in case of no match elsewhere
  otherwise?: DefaultHandler;
  errorHandler?: ErrorHandler;
}


// permissioning
export type AgentId = string;
export type ObjectId = string;
export enum PermissionRelation {
  OWNS = "OWNS",
};
export interface PermissionEvalutaationArgs {
  agentId: AgentId;
  objectId: ObjectId;
  relation: PermissionRelation;
}
export type PermissionEvaluator = (evaluationArgs: PermissionEvalutaationArgs)  => Promise<boolean>;

export interface RefreshTokenMgr {
  lookup: (token: string) => Promise<string>;
  invalidate: (token: string) => Promise<void>;
  issue: (identity: string) => Promise<string>;
}
