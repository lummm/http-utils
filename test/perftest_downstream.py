#!/usr/bin/env python3

import asyncio
import time

import zmq
import zmq.asyncio


responses = []


async def run_loop(router):
    frames = await router.recv_multipart()
    # _addr = frames[0]
    # topic = frames[1]
    # body = frames[2]
    # responses.append(
    #     " - ".join([
    #         body.decode("utf-8"),
    #         str(time.time())
    #     ]))
    return

async def main():
    c = zmq.asyncio.Context()
    router = c.socket(zmq.ROUTER)
    router.bind("tcp://0.0.0.0:9999")
    while True:
        await run_loop(router)
    return


if __name__ == '__main__':
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("stopping...")
        print(len(responses))
        with open("responses.txt", "w") as f:
            f.write("\n".join(responses))
