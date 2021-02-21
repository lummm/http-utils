#!/usr/bin/env python3

import asyncio
import json
import random
import string

import aiohttp


letters = string.ascii_lowercase


async def req(client, data):
    async with client.post("http://localhost:8888/test-zmq", data=data) as resp:
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
        await asyncio.gather(
            *[req(client, data) for data in test_data])
        await req(client, json.dumps({
            "topic": "STOP",
            "payload": ""
        }))
    return


if __name__ == '__main__':
    asyncio.run(main())
