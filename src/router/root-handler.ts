/**
 * This defines the top level route handler
 */
import url from "url";
import fp from "lodash/fp";

import { RouteConf, CB, Req, Res } from "../@types";
import { Method } from "../constants";
import { textRespond } from "../response";

interface RouteLookup {
  [index: string]: {
    [index in Method]: CB;
  };
}


export const RootHandler = (
  routes: RouteConf[]
): CB => {
  const routeLookup: RouteLookup = fp.reduce(
    (acc, {path, method, cb}) => fp.set([path, method], cb)(acc),
    {})(routes);

  return async (req: Req, res: Res) => {
    try {
      if (!req.url) {
        return
      }
      const urlParts = url.parse(req.url || "");
      const key = `${urlParts.pathname}.${req.method}`;
      const handler = fp.get(key)(routeLookup);
      if (!handler) {
        return textRespond(res, 401, "Not Found");
      }
      const response = await handler(req, res);
      return textRespond(
        res, 200, response
      );
    } catch (e) {
      console.trace(e);
      return textRespond(res, 500, "Server Error");
    }
  };
}
