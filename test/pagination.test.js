import assert from "node:assert/strict";
import { test } from "node:test";

import { paginate } from "../src/pagination.js";

const items = Array.from({ length: 45 }, (_, index) => index + 1);

test("returns the first page by default", () => {
  const result = paginate(items);

  assert.deepEqual(result.items, items.slice(0, 20));
  assert.equal(result.page, 1);
  assert.equal(result.totalPages, 3);
  assert.equal(result.hasNext, true);
});

test("returns a short last page", () => {
  const result = paginate(items, { page: 3 });

  assert.deepEqual(result.items, [41, 42, 43, 44, 45]);
  assert.equal(result.hasNext, false);
});

test("clamps out-of-range pages", () => {
  assert.equal(paginate(items, { page: 0 }).page, 1);
  assert.equal(paginate(items, { page: 99 }).page, 3);
});

test("treats an empty list as one empty page", () => {
  assert.deepEqual(paginate([]), {
    hasNext: false,
    items: [],
    page: 1,
    totalPages: 1,
  });
});

test("rejects a non-positive page size", () => {
  assert.throws(() => paginate(items, { perPage: 0 }), RangeError);
});
