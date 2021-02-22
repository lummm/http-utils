#!/usr/bin/env python3

import asyncio
import json
import os
import random
import string
import time

import aiohttp


letters = string.ascii_lowercase

PORT = int(os.environ["PORT"])
url = f"http://localhost:{PORT}/test-zmq"

async def req(client, data):
    async with client.post(url, data=data) as resp:
        return
    return


def gen_test_data(n_tests: int) -> list[str]:
    return [
        "".join(random.choice(letters) for _ in range(100))
        for _ in range(n_tests)
    ]


async def main():
    import sys
    n_tests = int(sys.argv[1])
    print("running tests -> ", n_tests)
    payloads = gen_test_data(n_tests)
    test_data = [
        json.dumps({
            "topic": "TEST",
            "payload": payload
        })
        for payload in payloads
    ]
    with open("requests.txt", "w") as f:
        f.write("\n".join(payloads))
    async with aiohttp.ClientSession() as client:
        t0 = time.time()
        print("doing requests")
        await asyncio.gather(
            *[req(client, data) for data in test_data])
        t1 = time.time()
        print(t1 - t0)
    return


if __name__ == '__main__':
    asyncio.run(main())
