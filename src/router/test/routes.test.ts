import fp from "lodash/fp";

import { Routes } from "../routes";
import { textRespond } from "../../response";


describe("routes", () => {
  it("should correctly define routes", async () => {
    const routes = Routes();
    routes.GET("/test-1", async (req, res) => textRespond({res, body: "test 1"}));
    routes.GET("/test-2", async (req, res) => textRespond({res, body: "test 2"}));
    const defs = routes.list();
    const test1Handler = fp.find(
      fp.flow(fp.get("path"), fp.eq("/test-1")))
    (defs);
    const test2Handler = fp.find(
      fp.flow(fp.get("path"), fp.eq("/test-2")))
    (defs);
    const mockRes = {
      writeHead: jest.fn(),
      write: jest.fn(),
      end: jest.fn(),
    };
    expect(await test1Handler.cbs[0](null, mockRes)).toEqual(undefined);
    expect(mockRes.write).toHaveBeenCalledWith("test 1");
    expect(await test2Handler.cbs[0](null, mockRes)).toEqual(undefined);
    expect(mockRes.write).toHaveBeenCalledWith("test 2");
  });
});
