import { initSockets, getPushSocket, returnPushSocket } from "./zmq";

/**
 * To allow for using this module directly,
 * we provide an 'init' method to initialize the
 * global service.
 */
const sendDownstream = async (frames: string[]) => {
  const push = await getPushSocket();
  try {
    await push.send(frames);
  } finally {
    returnPushSocket(push);
  }
  return;
};


export interface DownstreamService {
  sendDownstream: (frames: string[]) => Promise<void>;
}

export const Downstream: DownstreamService = {
  sendDownstream,
};

export const initDownstreamService = async (
  port: number,
  host: string = "127.0.0.1",
) => {
  await initSockets(host, port);
  console.log("downstream bound to", host, port);
};
