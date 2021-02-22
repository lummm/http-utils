// This applies backpressure for messages entering the
// downstream system.
import { Router, Push } from "zeromq";


export const runBridge = async (
  routerHost: string,
  routerPort: number,
  pushHost: string,
  pushPort: number,
) => {
  const router = new Router();
  await router.bind(`tcp://${routerHost}:${routerPort}`);
  const push = new Push();
  await push.bind(`tcp://${pushHost}:${pushPort}`);
  while (true) {
    try {
      const frames = await router.receive();
      // first frame is address, which we don't care about

      // do backpressure logic or
      // reduction logic here
      await push.send(frames.slice(1));
    } catch (e) {
      console.trace(e);
    }
  }
};
