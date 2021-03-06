import jwt from "jsonwebtoken";
import { Req, Res, CB } from "../@types";
import { textRespond } from "../response";


const key = process.env["KEY"] as string;

const bearerRegex = /Bearer (.+)/;

const algorithm = "HS512";


const issueToken = (
  userId: string,
  expSeconds: number = 3600
): Promise<string> => {
  const exp = (Date.now() / 1000) + expSeconds;
  return new Promise((resolve, reject) => jwt.sign(
    { userId },
    key,
    { algorithm },
    (err, token) => {
      if (err) {
        return reject(err);
      }
      return resolve(token!);
    }
  ));
};

const parseToken = (
  token: string,
): Promise<{userId: string}> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, key, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      if (!decoded) {
        return reject(null);
      }
      return resolve(decoded as { userId: string });
    });
  });
}

const ensureAuthenticated: CB = async (
  req: Req,
  res: Res,
) => {
  const authHeader = req.headers["authorization"];
  const respondUnauthorized = () => {
    textRespond({
      res,
      status: 401,
      body: "unauthorized",
    });
    return null;
  };
  if (!authHeader) {
    return respondUnauthorized();
  }
  const match = bearerRegex.exec(authHeader as string);
  const authToken = match && match[1];
  if (!authToken){
    return respondUnauthorized();
  }
  try {
    const { userId } = await parseToken(authToken);
    return [{...req, userId} as Req, res];
  } catch (e) {
    console.error(e);
    return respondUnauthorized();
  }
}

export default {
  issueToken,
  ensureAuthenticated,
};
