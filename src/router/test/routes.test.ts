import jest from "jest";
import fp from "lodash/fp";

import { Routes } from "../routes";


describe("routes", () => {
  it("should correctly define routes", () => {
    const routes = Routes();
    routes.get("/test-1", (res, req) => {
      return "test 1";
    });
    routes.get("/test-2", (res, req) => {
      return "test 2";
    });
    const defs = routes.list();
    const test1Handler = fp.find(
      fp.flow(fp.get("path"), fp.eq("/test-1")))
    (defs);
    const test2Handler = fp.find(
      fp.flow(fp.get("path"), fp.eq("/test-2")))
    (defs);
    expect(test1Handler.cb(null, null)).toEqual("test 1");
    expect(test2Handler.cb(null, null)).toEqual("test 2");
  });
});
