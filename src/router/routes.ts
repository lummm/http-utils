import { CB, RouteConf } from "../@types";
import { Method } from "../constants";


type RouteDefiner = (
  path: string,
  cb: CB
) => void;

export interface RoutesDef {
  GET: RouteDefiner,
  POST: RouteDefiner,
  PUT: RouteDefiner,
  list: () => RouteConf[],
}


export const Routes = (): RoutesDef => {
  const routes: RouteConf[] = [];
  const api = Object.values(Method).reduce((acc, method: string) => {
    acc[method] = (path: string, cb: CB) => {
      routes.push({path, method, cb});
    };
    return acc;
  }, {} as any);
  return {
    ...api,
    list: () => routes,
  };
};
