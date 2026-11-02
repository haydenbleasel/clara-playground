import assert from "node:assert/strict";
import { test } from "node:test";

import { createCache } from "../src/cache.js";

test("returns what was set", () => {
  const cache = createCache();

  cache.set("a", 1);

  assert.equal(cache.get("a"), 1);
  assert.equal(cache.has("a"), true);
  assert.equal(cache.size, 1);
});

test("computes a value once", async () => {
  const cache = createCache();
  let calls = 0;

  const compute = async () => {
    calls += 1;
    return "value";
  };

  assert.equal(await cache.getOrSet("a", compute), "value");
  assert.equal(await cache.getOrSet("a", compute), "value");
  assert.equal(calls, 1);
});

test("has ignores expired entries", () => {
  let time = 0;
  const cache = createCache({ now: () => time, ttl: 1000 });

  cache.set("a", 1);
  time = 2000;

  assert.equal(cache.has("a"), false);
  assert.equal(cache.get("a"), undefined);
});

test("recomputes an expired value", async () => {
  let time = 0;
  const cache = createCache({ now: () => time, ttl: 1000 });
  let calls = 0;

  const compute = async () => {
    calls += 1;
    return "value";
  };

  assert.equal(await cache.getOrSet("a", compute), "value");
  time = 2000;

  assert.equal(await cache.getOrSet("a", compute), "value");
  assert.equal(calls, 2);
});

test("size ignores expired entries", () => {
  let time = 0;
  const cache = createCache({ now: () => time, ttl: 1000 });

  cache.set("a", 1);
  cache.set("b", 2);
  time = 500;
  cache.set("c", 3);
  time = 1200;

  assert.equal(cache.size, 1);

  time = 2000;

  assert.equal(cache.size, 0);
});

test("expires an entry exactly ttl after it was set", () => {
  let time = 0;
  const cache = createCache({ now: () => time, ttl: 1000 });

  cache.set("a", 1);
  time = 999;

  assert.equal(cache.get("a"), 1);

  time = 1000;

  assert.equal(cache.has("a"), false);
  assert.equal(cache.get("a"), undefined);
  assert.equal(cache.size, 0);
});

test("setting a key again restarts its ttl", () => {
  let time = 0;
  const cache = createCache({ now: () => time, ttl: 1000 });

  cache.set("a", 1);
  time = 100;
  cache.set("b", 2);
  time = 500;
  cache.set("a", 3);
  time = 1200;

  assert.equal(cache.size, 1);
  assert.equal(cache.get("a"), 3);
  assert.equal(cache.has("b"), false);
});

test("reads the clock once per size read", () => {
  let time = 0;
  let reads = 0;
  const cache = createCache({
    now: () => {
      reads += 1;
      return time;
    },
    ttl: 1000,
  });

  cache.set("a", 1);
  cache.set("b", 2);
  cache.set("c", 3);
  time = 2000;
  reads = 0;

  assert.equal(cache.size, 0);
  assert.equal(reads, 1);
});

test("shares one computation between concurrent callers", async () => {
  const cache = createCache();
  let calls = 0;

  const compute = async () => {
    calls += 1;
    await new Promise((resolve) => setTimeout(resolve, 10));
    return calls;
  };

  const results = await Promise.all([cache.getOrSet("a", compute), cache.getOrSet("a", compute)]);

  assert.deepEqual(results, [1, 1]);
  assert.equal(calls, 1);
  assert.equal(cache.get("a"), 1);
});

test("doesn't cache a failed computation", async () => {
  const cache = createCache();

  await assert.rejects(
    cache.getOrSet("a", async () => {
      throw new Error("boom");
    }),
    /boom/u,
  );
  await assert.rejects(
    cache.getOrSet("a", () => {
      throw new Error("sync boom");
    }),
    /sync boom/u,
  );

  assert.equal(cache.has("a"), false);
  assert.equal(await cache.getOrSet("a", async () => "value"), "value");
});
