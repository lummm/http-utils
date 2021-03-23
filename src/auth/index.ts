import jwt from "jsonwebtoken";
import { Req, Res, CB, RefreshTokenMgr } from "../@types";
import { textRespond } from "../response";
import { cookieService } from "../cookieService";


const key = process.env["KEY"] as string;

const bearerRegex = /Bearer (.+)/;

const algorithm = "HS512";
// this is ok if we can restrict the domain,
// o/w the mgr needs to provide the key
const REFRESH_TOKEN_KEY = "REFRESH_TOKEN"
const SESSION_TOKEN_KEY = "SESSION_TOKEN"


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

const ensureAuthenticated = (
  refreshTokenMgr: RefreshTokenMgr,
): CB => async (
  req: Req,
  res: Res,
) => {
  const cookies = cookieService.getCookies(req);
  const authToken = cookies[SESSION_TOKEN_KEY];
  function respondUnauthorized() {
    textRespond({
      res,
      status: 401,
      body: "unauthorized",
    });
    return null;
  };
  async function resortToRefreshToken() {
    const refreshToken = cookies[REFRESH_TOKEN_KEY];
    const userId = await refreshTokenMgr.lookup(refreshToken);
    if (!userId) {
      return respondUnauthorized();
    }
    await refreshTokenMgr.invalidate(refreshToken);
    return initSession({req, res}, userId, refreshTokenMgr);
  }
  if (!authToken){
    return resortToRefreshToken();
  }
  try {
    const { userId } = await parseToken(authToken);
    req.userId = userId;
    return {req, res};
  } catch (e) {
    console.error(e);
    return resortToRefreshToken();
  }
}

async function initSession(
  {
    req, res
  }: { req: Req, res: Res },
  userId: string,
  refreshTokenMgr: RefreshTokenMgr,
) {
  const sessionToken = await issueToken(userId);
  const refreshToken = await refreshTokenMgr.issue(userId);
  cookieService.setCookie(res, REFRESH_TOKEN_KEY, refreshToken, {
    httpOnly: true,
    path: "/",
  });
  cookieService.setCookie(res, SESSION_TOKEN_KEY, sessionToken, {
    httpOnly: true,
    path: "/",
  });
  return {req, res};
}

async function logout({
  req, res
}: { req: Req, res: Res }) {
  cookieService.setCookie(res, REFRESH_TOKEN_KEY, "", {});
  cookieService.setCookie(res, SESSION_TOKEN_KEY, "", {});
  return { req, res };
}

export const Auth = {
  initSession,
  issueToken,
  ensureAuthenticated,
  logout,
};
