/**
 * To allow for using this module directly,
 * we provide an 'init' method to initialize the
 * global service.
*/
import { Push } from "zeromq";

export interface DownstreamService {
  sendDownstream: (frames: string[]) => Promise<void>;
}


const getPushSocket = async (
  host: string,
  port: number,
): Promise<Push> => {
  const push = new Push();
  push.connect(`tcp://${host}:${port}`);
  return push;
}


const downstreamSendFactory = (
  push: Push,
) => async (
  frames: string[]
): Promise<void> => push.send(frames);

export const Downstream: DownstreamService = {
  sendDownstream: () => Promise.resolve(),
};

export const initDownstreamService = async (
  port: number,
  host: string = "127.0.0.1",
) => {
  const socket = await getPushSocket(host, port);
  Downstream.sendDownstream = downstreamSendFactory(socket);
  console.log("downstream bound to", host, port);
};
