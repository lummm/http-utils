import http from "http";


export type Req = http.IncomingMessage;
export type Res = http.ServerResponse;
export type CB = http.RequestListener;

export type RouteConf = {
  path: string;
  method: string;
  cb: CB;
};

export type ResponseType = "json" | "text"
