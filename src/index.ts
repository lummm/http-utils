import { Server } from "./server/server";
import { Routes, RootHandler } from "./router";
import { initDownstreamService } from "./downstream";


export const App = () => {
  const routes = Routes();
  return {
    routes,
    start: async (
      listenPort: number,
      downstreamPort: number,
    ) => {
      await initDownstreamService(downstreamPort);
      const rootHandler = RootHandler(routes.list());
      const server = Server(rootHandler);
      return server.run(listenPort);
    },
  };
};

export { textRespond, jsonRespond } from "./response";
export { Downstream } from "./downstream";
