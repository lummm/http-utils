import { RootHandler } from "../root-handler";
import { textRespond } from "../../response";


describe("root-handler", () => {
  const routeDefs = [
    {
      path: "/test-1",
      method: "GET",
      cbs: [async (req: any, res: any) => textRespond({ res, body: "1" })],
    },
    {
      path: "/test-2",
      method: "POST",
      cbs: [async (req: any, res: any) => textRespond({ res, body: "2" })],
    },
    {
      path: "/with-query",
      method: "GET",
      cbs: [async (req: any, res: any) => {
        const hiFromQuery = req.qParams.hi;
        return textRespond({ res, body: hiFromQuery });
      }],
    },
  ];
  const rootHandler = RootHandler(routeDefs);
  const getMockReq = (method: string, url: string): any => ({
    url,
    method,
  });

  const getMockRes = (): any => ({
    write: jest.fn(),
    writeHead: jest.fn(),
    end: jest.fn(),
  });


  it("should call the appropriate GET handler", async () => {
    const mockReq = getMockReq("GET", "/test-1");
    const mockRes = getMockRes();
    await rootHandler(mockReq, mockRes);
    expect(mockRes.write).toHaveBeenCalledWith("1");
    const [status, _headers] = mockRes.writeHead.mock.calls[0];
    expect(status).toEqual(200);
  });

  it("should call the appropriate POST handler", async () => {
    const mockReq = getMockReq("POST", "/test-2");
    const mockRes = getMockRes();
    await rootHandler(mockReq, mockRes);
    expect(mockRes.write).toHaveBeenCalledWith("2");
    const [status, _headers] = mockRes.writeHead.mock.calls[0];
    expect(status).toEqual(200);
  });

  it("should return 404 if a handler isn't found", async () => {
    const mockReq = getMockReq("GET", "/nope");
    const mockRes = getMockRes();
    await rootHandler(mockReq, mockRes);
    const [status, _headers] = mockRes.writeHead.mock.calls[0];
    expect(status).toEqual(404);
  });

  it("should use the 'otherwise' function if it is provided", async () => {
    const defaultHandler = (method?: string, path?: string) => {
      if (path === "/nope") {
        return [
          async (req: any, res: any) => textRespond({ res, body: "test" }),
        ];
      }
      return [
        async (req: any, res: any) => textRespond({ res, body: "test2" }),
      ];
    }
    const rootHandlerWithDefault = RootHandler(routeDefs, defaultHandler);
    const mockReq = getMockReq("GET", "/nope");
    const mockReq2 = getMockReq("GET", "/nope-2");
    const mockRes = getMockRes();
    await rootHandlerWithDefault(mockReq, mockRes);
    expect(mockRes.write).toHaveBeenCalledWith("test");
    await rootHandlerWithDefault(mockReq2, mockRes);
    expect(mockRes.write).toHaveBeenCalledWith("test2");
  });

  it("should parse query params", async () => {
    const mockReq = getMockReq("GET", "/with-query?hi=100");
    const mockRes = getMockRes();
    await rootHandler(mockReq, mockRes);
    expect(mockRes.write).toHaveBeenCalledWith("100");
  });
});
