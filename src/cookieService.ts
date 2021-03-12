import { Req, Res } from "./@types";


function parseCookies(str: string): {[index: string]: string} {
  const rx = /([^;=\s]*)=([^;]*)/g;
  const obj: any = {};
  for ( let m ; m = rx.exec(str) ; )
    obj[m[1]] = decodeURIComponent(m[2]);
  return obj;
}

function getCookies(req: Req): {[index: string]: string} {
  if (!req.headers.cookie) {
    return {};
  }
  return parseCookies(req.headers.cookie);
}

function setCookie(
  res: Res,
  key: string,
  val: string,
  opts: {
    domain?: string,
    path?: string,
    httpOnly?: boolean,
  },
) {
  const encodedVal = encodeURIComponent(val);
  const cookieVal = `${key}=${encodedVal}` +
    (opts.domain
      ? `; Domain=${opts.domain}`
      : "") +
    (opts.path
      ? `; Path=${opts.path}`
      : "") +
    (opts.httpOnly
      ? `; HttpOnly`
      : "")
  ;
  res.setHeader("Set-Cookie", cookieVal);
}

export const cookieService = {
  getCookies,
  setCookie,
};
