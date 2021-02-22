import { Dealer } from "zeromq";
import fp from "lodash/fp";


type DSSocket = Dealer;


interface State {
  availableSockets: DSSocket[];
  waiting: null | ((socket: DSSocket) => void);
}

const state: State = {
  availableSockets: [],
  waiting: null,
};


const createDSSocket = async (
  host: string,
  port: number,
): Promise<DSSocket> => {
  const socket = new Dealer();
  socket.connect(`tcp://${host}:${port}`);
  return socket;
}

export const initSockets = async (
  host: string,
  port: number,
  nSockets: number
) => {
  console.log(
    "connecting ",
    nSockets,
    " to ", host, port
  );
  state.availableSockets = await Promise.all(
    fp.range(0, nSockets)
      .map((_) => createDSSocket(host, port))
  );
};

// this returns an available downstream socket
export const getDSSocket = async (): Promise<Dealer> => {
  return new Promise((resolve, reject) => {
    if (state.availableSockets.length > 0) {
      const socket = state.availableSockets.pop();
      resolve(socket as DSSocket);
    }
    // else we wait
    state.waiting = (socket: DSSocket) => {
      state.waiting = null;
      resolve(socket);
    };
  })
}

export const returnDSSocket = (
  socket: DSSocket
): void => {
  state.availableSockets.push(socket);
  if (state.waiting) {
    state.waiting(socket);
  }
};
