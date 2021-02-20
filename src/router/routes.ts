
import { CB, RouteConf } from "../@types";
import { Method } from "../constants";


type RouteDefiner = (
  path: string,
  cb: CB
) => void;




export const Routes = (): {
  get: RouteDefiner,
  put: RouteDefiner,
  post: RouteDefiner,
  list: () => RouteConf[],
} => {
  const routes: RouteConf[] = [];
  const api = Object.values(Method).reduce((acc, method: string) => {
    acc[method.toLowerCase()] = (path: string, cb: CB) => {
      routes.push({path, method, cb});
    };
    return acc;
  }, {} as any);
  return {
    ...api,
    list: () => routes,
  };
};
