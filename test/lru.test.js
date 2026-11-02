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
