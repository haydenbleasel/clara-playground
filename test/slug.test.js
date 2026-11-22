import assert from "node:assert/strict";
import { test } from "node:test";

import { slugify, uniqueSlug } from "../src/slug.js";

test("lowercases letters and keeps digits", () => {
  assert.equal(slugify("Hello World 2024"), "hello-world-2024");
});

test("replaces each run of other characters with one hyphen", () => {
  assert.equal(slugify("Hello,  World"), "hello-world");
  assert.equal(slugify("a - b"), "a-b");
});

test("never starts or ends with a hyphen", () => {
  assert.equal(slugify("Hello, World!"), "hello-world");
  assert.equal(slugify("  Intro"), "intro");
  assert.equal(slugify("--a--"), "a");
});

test("returns an empty slug for a title with no ASCII letters or digits", () => {
  assert.equal(slugify("!!!"), "");
  assert.equal(slugify("日本語"), "");
});

test("returns the plain slug when it's free", () => {
  assert.equal(uniqueSlug("Post", new Set()), "post");
});

test("numbers duplicates from 2", () => {
  assert.equal(uniqueSlug("Post", new Set(["post"])), "post-2");
  assert.equal(uniqueSlug("Post", new Set(["post", "post-2"])), "post-3");
});

test("falls back to untitled for a title with no ASCII letters or digits", () => {
  assert.equal(uniqueSlug("日本語", new Set()), "untitled");
  assert.equal(uniqueSlug("!!!", new Set(["untitled"])), "untitled-2");
  assert.equal(uniqueSlug("", new Set([""])), "untitled");
});
