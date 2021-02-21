import zmq from "zeromq";


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
): void => {
  await push.send(frames);
  return;
};


export const Downstream = async (
  port: number,
) => {
  const socket = await getPushSocket(port);
  return {
    sendDownstream: downstreamSendFactory(socket),
  };
};
