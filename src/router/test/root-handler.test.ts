import { RootHandler } from "../root-handler";
import { textRespond } from "../../response";


describe("root-handler", () => {
  const rootHandler = RootHandler([
    {
      path: "/test-1",
      method: "GET",
      cbs: [async (req, res) => textRespond({res, body: "1"})],
    },
    {
      path: "/test-2",
      method: "POST",
      cbs: [async (req, res) => textRespond({res, body: "2"})],
    },
  ]);
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

  it("should return 401 if a handler isn't found", async () => {
    const mockReq = getMockReq("GET", "/nope");
    const mockRes = getMockRes();
    await rootHandler(mockReq, mockRes);
    const [status, _headers] = mockRes.writeHead.mock.calls[0];
    expect(status).toEqual(401);
  });
});
