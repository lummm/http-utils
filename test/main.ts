import { App, jsonRespond } from "http-utils";
import { Req, Res } from "http-utils/lib/@types";


const app = App();


app.routes.GET("/test", async (req: Req, res: Res) => {
  console.log("req", req);
  return jsonRespond({res, body: "OK"});
});

app.start(8888, 9999);
