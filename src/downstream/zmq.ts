import { Push } from "zeromq";
import fp from "lodash/fp";

import { DEFAULT_N_SOCKETS } from "../constants";


interface State {
  availablePush: Push[];
  waiting: null | ((socket: Push) => void);
}

const state: State = {
  availablePush: [],
  waiting: null,
};


const createPushSocket = async (
  host: string,
  port: number,
): Promise<Push> => {
  const push = new Push();
  push.connect(`tcp://${host}:${port}`);
  return push;
}

export const initSockets = async (
  host: string,
  port: number,
) => {
  console.log("connecting sockets ->", DEFAULT_N_SOCKETS);
  state.availablePush = await Promise.all(
    fp.range(0, DEFAULT_N_SOCKETS)
      .map((_) => createPushSocket(host, port))
  );
};

// this returns an available push socket
export const getPushSocket = async (): Promise<Push> => {
  return new Promise((resolve, reject) => {
    if (state.availablePush.length > 0) {
      const socket = state.availablePush.pop();
      resolve(socket as Push);
    }
    // else we wait
    state.waiting = (socket: Push) => {
      state.waiting = null;
      resolve(socket);
    };
  })
}

export const returnPushSocket = (
  socket: Push
): void => {
  state.availablePush.push(socket);
  if (state.waiting) {
    state.waiting(socket);
  }
};
