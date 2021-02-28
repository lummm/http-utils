/**
 * This defines the top level route handler
 */
import url from "url";
import fp from "lodash/fp";

import { RouteConf, CB, Req, Res, DefaultHandler } from "../@types";
import { Method } from "../constants";
import { textRespond } from "../response";


interface RouteLookup {
  [index: string]: {
    [index in Method]: CB;
  };
}


export const RootHandler = (
  routes: RouteConf[],
  otherwise?: DefaultHandler,
): CB => {
  const routeLookup: RouteLookup = routes.reduce(
    (acc, {path, method, cbs}) => fp.set([path, method], cbs)(acc),
    {});

  return async (req: Req, res: Res) => {
    try {
      if (!req.url) {
        return
      }
      const urlParts = url.parse(req.url || "");
      const method = req.method || "";
      const path = urlParts.pathname || "";
      const key = `${path}.${method}`;
      const getOtherwiseHandlers = () => otherwise && otherwise(method, path);
      const handlers: CB[] = fp.get(key)(routeLookup)
        || getOtherwiseHandlers();
      if (!handlers) {
        return textRespond({res, status: 404, body: "Not Found"});
      }
      // This establishes the middleware flow.
      // Imperative to allow early breaks.
      let workingReq = req;
      let workingRes = res;
      for (let handler of handlers) {
        const stepResult = await handler(workingReq, workingRes);
        if (!stepResult) {
          // we terminate early
          break;
        }
        [workingReq, workingRes] = stepResult;
      }
    } catch (e) {
      console.trace(e);
      return textRespond({res, status: 500, body: "Server Error"});
    }
  };
}
