import { App, jsonRespond, Downstream } from "http-utils";
import { Req, Res } from "http-utils/lib/@types";


const app = App();


app.routes.GET("/test-http", async (req: Req, res: Res) => {
  return jsonRespond({res, body: "OK"});
});

app.routes.GET("/test-zmq", async (req: Req, res: Res) => {
  Downstream.sendDownstream(["test", "frames"]);
  return jsonRespond({res, body: "OK"});
});

app.start(8888, 9999);
