import assert from "node:assert/strict";
import { test } from "node:test";

import { createLru } from "../src/lru.js";

test("returns what was set", () => {
  const lru = createLru(2);

  lru.set("a", 1);
  lru.set("b", 2);

  assert.equal(lru.get("a"), 1);
  assert.equal(lru.get("b"), 2);
  assert.equal(lru.size, 2);
});

test("evicts the least recently used key when full", () => {
  const lru = createLru(2);

  lru.set("a", 1);
  lru.set("b", 2);
  lru.set("c", 3);

  assert.deepEqual(lru.keys(), ["b", "c"]);
  assert.equal(lru.get("a"), undefined);
});

test("reading a key makes it the most recently used", () => {
  const lru = createLru(2);

  lru.set("a", 1);
  lru.set("b", 2);
  lru.get("a");

  assert.deepEqual(lru.keys(), ["b", "a"]);

  lru.set("c", 3);

  assert.deepEqual(lru.keys(), ["a", "c"]);
});

test("holds one entry at capacity 1", () => {
  const lru = createLru(1);

  lru.set("a", 1);
  lru.set("b", 2);

  assert.deepEqual(lru.keys(), ["b"]);
  assert.equal(lru.get("a"), undefined);
  assert.equal(lru.get("b"), 2);
  assert.equal(lru.size, 1);
});

test("treats a stored undefined as a hit", () => {
  const lru = createLru(2);

  lru.set("k", undefined);
  lru.set("b", 2);

  assert.equal(lru.get("k"), undefined);
  assert.deepEqual(lru.keys(), ["b", "k"]);

  lru.set("c", 3);

  assert.deepEqual(lru.keys(), ["k", "c"]);
});

test("rejects a capacity that isn't a positive integer", () => {
  for (const capacity of [0, -1, 1.5, Number.NaN, undefined]) {
    assert.throws(() => createLru(capacity), RangeError);
  }
});

test("updating a key in a full cache evicts nothing", () => {
  const lru = createLru(2);

  lru.set("a", 1);
  lru.set("b", 2);
  lru.set("a", 10);

  assert.equal(lru.size, 2);
  assert.equal(lru.get("a"), 10);
  assert.equal(lru.get("b"), 2);
});

test("writing a key makes it the most recently used", () => {
  const lru = createLru(2);

  lru.set("a", 1);
  lru.set("b", 2);
  lru.set("a", 10);

  assert.deepEqual(lru.keys(), ["b", "a"]);

  lru.set("c", 3);

  assert.deepEqual(lru.keys(), ["a", "c"]);
});
