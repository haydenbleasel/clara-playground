import assert from "node:assert/strict";
import { test } from "node:test";

import { chunk } from "../src/chunk.js";

test("splits a list into groups", () => {
  assert.deepEqual(chunk([1, 2, 3, 4, 5], 2), [[1, 2], [3, 4], [5]]);
});

test("keeps a short list in one group", () => {
  assert.deepEqual(chunk([1, 2], 5), [[1, 2]]);
});
