/**
 * To allow for using this module directly,
 * we provide an 'init' method to initialize the
 * global service.
*/
import { Push } from "zeromq";

interface DownstreamService {
  sendDownstream: (frames: string[]) => Promise<void>;
}


const getPushSocket = async (
  port: number,
): Promise<Push> => {
  const push = new Push();
  await push.bind(`tcp://0.0.0.0:${port}`);
  return push;
}


const downstreamSendFactory = (
  push: Push,
) => async (
  frames: string[]
): Promise<void> => {
  await push.send(frames);
  return;
};


export const Downstream: DownstreamService = {
  sendDownstream: () => Promise.resolve(),
};

export const initDownstreamService = async (
  port: number,
) => {
  const socket = await getPushSocket(port);
  Downstream.sendDownstream = downstreamSendFactory(socket);
};
