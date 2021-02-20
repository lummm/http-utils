import { Server } from "./server/server";
import { Routes, RootHandler } from "./router";


export const App = () => {
  const routes = Routes();
  return {
    routes,
    start: (port: number) => {
      const rootHandler = RootHandler(routes.list());
      const server = Server(rootHandler);
      return server.run(port);
    },
  };
};
