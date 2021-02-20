import http from "http";

import { CB } from "../@types";


export const Server = (rootHandler: CB) => {
  const server = http.createServer(rootHandler);
  return {
    run: (port: number) => server.listen(port),
  };
}
