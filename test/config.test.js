import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import { loadConfig, loadConfigFile } from "../src/config.js";

test("merges overrides into the defaults", () => {
  const config = loadConfig({ retry: { attempts: 5 } });

  assert.equal(config.retry.attempts, 5);
  assert.equal(config.retry.baseDelay, 100);
  assert.equal(config.pagination.perPage, 20);
});

test("merges an INI file's sections into the defaults", () => {
  const path = join(mkdtempSync(join(tmpdir(), "config-")), "clara.ini");
  writeFileSync(path, "[retry]\nattempts = 5\n");

  const config = loadConfigFile(path);

  assert.equal(config.retry.attempts, "5");
  assert.equal(config.retry.baseDelay, 100);
});
