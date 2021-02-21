import { Req } from "../@types";
import { MAX_BODY_SIZE } from "../constants";


export const readBodyStr = (req: Req): Promise<string> => {
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

export const readBodyJson = async (req: Req) => JSON.parse(
  await readBodyStr(req)
);
