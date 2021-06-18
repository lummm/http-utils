import { ResponseType, Res } from "../@types";


const CONTENT_TYPE_MAP = {
  json: "application/json",
  text: "text/plain",
  xml: "text/xml",
}

const getResponseHeaders = (
  responseType: ResponseType,
) => ({
  "Content-type": CONTENT_TYPE_MAP[responseType],
});

const getResBody = (
  responseType: ResponseType,
) => (
  body: any,
) => responseType === "json" ?
  JSON.stringify(body) : body;

const respond = (
  responseType: ResponseType = "text",
) => ({
  res,
  body,
  status = 200,
}: {
  res: Res,
  body: any,
  status?: number,
}): void => {
  const toBody = getResBody(responseType);
  res.writeHead(status, getResponseHeaders(responseType));
  res.write(toBody(body));
  res.end();
  return;
}


export const textRespond = respond("text");
export const jsonRespond = respond("json");
export const xmlRespond = respond("xml");
