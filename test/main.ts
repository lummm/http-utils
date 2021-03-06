import { App, jsonRespond, Downstream, readBody, Auth } from "http-utils";
import { Req, Res } from "http-utils/lib/@types";


const app = App();


app.routes.GET(
  "/test-auth",
  Auth.ensureAuthenticated,
  async (req: Req, res: Res) => {
    return jsonRespond({res, body: "OK"});
  });

app.routes.POST(
  "/test-auth",
  async (req: Req, res: Res) => {
    console.log("in here");
    const token = await Auth.issueToken("12345")
    return jsonRespond({
      res,
      body: {
        token,
      }
    });
  });


app.routes.GET(
  "/test-http",
  async (req: Req, res: Res) => {
    console.log("middleware");
    return [req, res];
  },
  async (req: Req, res: Res) => {
    return jsonRespond({res, body: "OK"});
  });

app.routes.POST(
  "/test-zmq",
  readBody({
    ensureKeys: ["topic", "payload"],
  }),
  async (req: Req, res: Res) => {
    const { topic, payload } = req.body;
    // console.log("got", payload);
    await Downstream.sendDownstream([topic, payload]);
    // console.log("sent", payload);
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

const listen = parseInt(process.env["LISTEN"] as string);
const downstream = parseInt(process.env["DS"] as string);

app.start(listen, downstream, "127.0.0.1");
