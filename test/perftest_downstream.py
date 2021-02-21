#!/usr/bin/env python3

import asyncio
import time

import zmq
import zmq.asyncio


responses = []

async def main():
    c = zmq.asyncio.Context()
    pull = c.socket(zmq.PULL)
    pull.bind("tcp://0.0.0.0:9999")
    while True:
        frames = await pull.recv_multipart()
        if frames[0] == b"STOP":
            break
        responses.append(
            " - ".join([
                frames[1].decode("utf-8"),
                str(time.time())
            ]))
    with open("responses.txt", "w") as f:
        f.write("\n".join(responses))
    return


if __name__ == '__main__':
    asyncio.run(main())
