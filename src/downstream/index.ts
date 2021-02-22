import { initSockets, getDSSocket, returnDSSocket } from "./zmq";

/**
 * To allow for using this module directly,
 * we provide an 'init' method to initialize the
 * global service.
 */
const sendDownstream = async (frames: string[]) => {
  const push = await getDSSocket();
  try {
    await push.send(frames);
  } finally {
    returnDSSocket(push);
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
  host: string,
  nSockets: number
) => {
  await initSockets(host, port, nSockets);
};

export { runBridge } from "./bridge";
