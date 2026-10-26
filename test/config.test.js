import assert from "node:assert/strict";
import { test } from "node:test";

import { loadConfig } from "../src/config.js";

test("merges overrides into the defaults", () => {
  const config = loadConfig({ retry: { attempts: 5 } });

  assert.equal(config.retry.attempts, 5);
  assert.equal(config.retry.baseDelay, 100);
  assert.equal(config.pagination.perPage, 20);
});
