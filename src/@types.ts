import http from "http";


export type Req = http.IncomingMessage;
export type Res = http.ServerResponse;
// a CB can return null to stop the handle flow
export type CB = (req: Req, res: Res) => Promise<[Req, Res] | void>;

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
