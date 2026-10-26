import assert from "node:assert/strict";
import { test } from "node:test";

import { chunk } from "../src/chunk.js";

test("splits a list into groups", () => {
  assert.deepEqual(chunk([1, 2, 3, 4, 5], 2), [[1, 2], [3, 4], [5]]);
});

test("keeps a short list in one group", () => {
  assert.deepEqual(chunk([1, 2], 5), [[1, 2]]);
});

test("adds no empty group when the length divides evenly", () => {
  assert.deepEqual(chunk([1, 2, 3, 4], 2), [
    [1, 2],
    [3, 4],
  ]);
  assert.deepEqual(chunk([1, 2], 2), [[1, 2]]);
});

test("returns no groups for an empty list", () => {
  assert.deepEqual(chunk([], 3), []);
});

test("rejects a size that is not a positive integer", () => {
  for (const size of [0, -1, 1.5, Number.NaN, Infinity, "2", undefined]) {
    assert.throws(() => chunk([1, 2, 3, 4], size), RangeError);
  }
});
