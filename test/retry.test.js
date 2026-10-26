import assert from "node:assert/strict";
import { test } from "node:test";

import { retry } from "../src/retry.js";

const noWait = async () => {};

test("returns the first success", async () => {
  let calls = 0;
  const result = await retry(
    async () => {
      calls += 1;
      if (calls < 3) {
        throw new Error("flaky");
      }
      return "ok";
    },
    { wait: noWait }
  );

  assert.equal(result, "ok");
  assert.equal(calls, 3);
});

test("doubles the wait up to the cap", async () => {
  const waits = [];
  await assert.rejects(
    retry(
      async () => {
        throw new Error("down");
      },
      {
        attempts: 5,
        baseDelay: 100,
        maxDelay: 300,
        random: () => 1,
        wait: async (ms) => {
          waits.push(ms);
        },
      }
    )
  );

  assert.deepEqual(waits, [100, 200, 300, 300]);
});

test("stops at errors that aren't retryable", async () => {
  let calls = 0;
  await assert.rejects(
    retry(
      async () => {
        calls += 1;
        throw Object.assign(new Error("bad input"), { retryable: false });
      },
      { wait: noWait }
    ),
    /bad input/
  );

  assert.equal(calls, 1);
});
