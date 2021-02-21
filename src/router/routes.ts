import { CB, RouteConf, RoutesDefApi } from "../@types";
import { Method } from "../constants";


export const Routes = (): RoutesDefApi => {
  const routes: RouteConf[] = [];
  const api = Object.values(Method).reduce((acc, method: string) => {
    acc[method] = (path: string, ...cbs: CB[]) => {
      routes.push({path, method, cbs});
    };
    return acc;
  }, {} as any);
  return {
    ...api,
    list: () => routes,
  };
};
