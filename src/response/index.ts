import { ResponseType, Res } from "../@types";


const getResponseHeaders = (
  responseType: ResponseType,
) => ({
  "Content-type": responseType === "json" ?
    "application/json" : "text/plain",
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
