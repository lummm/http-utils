import { Server } from "./server/server";
import { Routes, RootHandler } from "./router";
import { initDownstreamService } from "./downstream";
import { DEFAULT_N_SOCKETS } from "./constants";


export const App = () => {
  const routes = Routes();
  return {
    routes,
    start: async (
      listenPort: number,
      downstreamPort: number,
      downstreamHost: string,
      {
        nSockets,
      } = {
        nSockets: DEFAULT_N_SOCKETS,
      }
    ) => {
      await initDownstreamService(
        downstreamPort, downstreamHost, nSockets
      );
      const rootHandler = RootHandler(routes.list());
      const server = Server(rootHandler);
      return server.run(listenPort);
    },
  };
};

export { textRespond, jsonRespond } from "./response";
export { Downstream, runBridge } from "./downstream";
export { readBody } from "./request";
