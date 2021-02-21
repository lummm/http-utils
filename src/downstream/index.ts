/**
 * To allow for using this module directly,
 * we provide an 'init' method to initialize the
 * global service.
*/
import zmq from "zeromq";

interface DownstreamService {
  sendDownstream: (frames: string[]) => Promise<void>;
}


const getPushSocket = async (
  port: number,
): Promise<zmq.Push> => {
  const push = new zmq.Push();
  await push.bind(`tcp://0.0.0.0:{port}`);
  return push;
}


const downstreamSendFactory = (
  push: zmq.Push,
) => async (
  frames: string[]
): Promise<void> => {
  await push.send(frames);
  return;
};


export const Downstream: DownstreamService = {
  sendDownstream: () => Promise.resolve(),
};

export const init = async (
  port: number,
) => {
  const socket = await getPushSocket(port);
  Downstream.sendDownstream = downstreamSendFactory(socket);
};
