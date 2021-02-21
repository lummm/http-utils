import fp from "lodash/fp";

import { Req, Res, CB } from "../@types";
import { MAX_BODY_SIZE } from "../constants";
import { textRespond } from "../response";


const getBodyStr = (req: Req): Promise<string> => {
  return new Promise((resolve, reject) => {
    const read: string[] = [];
    let totalSize = 0;
    req.on("data", (data) => {
      read.push(data);
      totalSize += data.length;
      if (totalSize > MAX_BODY_SIZE) {
        console.trace("body too large", totalSize)
        reject("request body too large");
      }
    });
    req.on("end", () => resolve(read.join("")))
  });
};

const getBodyJson = async (req: Req) => JSON.parse(
  await getBodyStr(req)
);


export const readBody = ({
  asJson = true,
  ensureKeys = [],
}: {
  asJson?: boolean;
  ensureKeys?: string[],
}): CB => async (
  req: Req,
  res: Res,
) => {
  const body = asJson
    ? await getBodyJson(req)
    : await getBodyStr(req);
  if (asJson && ensureKeys.length) {
    const missingKeys = fp.difference(ensureKeys)(Object.keys(body));
    if (missingKeys.length) {
      const errMsg = "missing required body props -> "
        + missingKeys
          .map(key => `"${key}"`)
          .join(", ");
      console.error(errMsg)
      return textRespond({res, status: 400, body: errMsg});
    }
  }
  return [{...req, body} as Req, res];
};
