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
