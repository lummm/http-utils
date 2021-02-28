import http from "http";


export interface Req extends http.IncomingMessage {
  body?: any;
};
export type Res = http.ServerResponse;
// a CB can return null to stop the handle flow
export type CB = (req: Req, res: Res) => Promise<[Req, Res] | void | null>;

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
  GET: RouteDefiner,
  POST: RouteDefiner,
  PUT: RouteDefiner,
  list: () => RouteConf[],
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
