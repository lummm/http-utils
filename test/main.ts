import { App, jsonRespond, Downstream, readBody } from "http-utils";
import { Req, Res } from "http-utils/lib/@types";


const app = App();


app.routes.GET(
  "/test-http",
  async (req: Req, res: Res) => {
    console.log("middleware");
    return [req, res];
  },
  async (req: Req, res: Res) => {
    return jsonRespond({res, body: "OK"});
  });

app.routes.GET("/test-zmq", async (req: Req, res: Res) => {
  Downstream.sendDownstream(["test", "frames"]);
  return jsonRespond({res, body: "OK"});
});

app.routes
  .POST(
    "/test-post",
    readBody({
      ensureKeys: ["hi"],
    }),
    async (req: Req, res: Res) => {
      const {body} = req;
      console.log("body", body["hi"]);
      return jsonRespond({res, body: "OK"});
    });

app.start(8888, 9999);
