import assert from "node:assert/strict";
import { test } from "node:test";

import { anchorId, slugify, trimTitle, truncateSlug, uniqueSlug } from "../src/slug.js";

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

test("doesn't turn non-ASCII letters into ASCII ones", () => {
  assert.equal(slugify("İstanbul"), "stanbul");
  assert.equal(slugify("\u212A"), "");
  assert.equal(uniqueSlug("\u212A", new Set()), "untitled");
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

test("truncates to at most maxLength characters", () => {
  assert.equal(truncateSlug("hello-world", 5), "hello");
  assert.equal(truncateSlug("hello-world", 7), "hello-w");
  assert.equal(truncateSlug("hello-world", 11), "hello-world");
  assert.equal(truncateSlug("hello-world", 20), "hello-world");
});

test("never leaves a hyphen at the end after truncating", () => {
  assert.equal(truncateSlug("hello-world", 6), "hello");
  assert.equal(truncateSlug("a--b", 3), "a");
});

test("treats a negative or fractional maxLength as zero or rounds it down", () => {
  assert.equal(truncateSlug("hello-world", -2), "");
  assert.equal(truncateSlug("hello-world", 0), "");
  assert.equal(truncateSlug("hello-world", 5.9), "hello");
});

test("shortens the base before adding a suffix so the slug fits maxLength", () => {
  assert.equal(uniqueSlug("Long Title", new Set(), 10), "long-title");
  assert.equal(uniqueSlug("Long Title", new Set(["long-title"]), 10), "long-tit-2");
  assert.equal(uniqueSlug("Long Title", new Set(["long-title", "long-tit-2"]), 10), "long-tit-3");
  assert.equal(uniqueSlug("Long Title", new Set(["long"]), 5), "lon-2");
  assert.equal(uniqueSlug("!!!", new Set(["untit"]), 5), "unt-2");
});

test("throws when maxLength leaves no room for the base", () => {
  assert.throws(() => uniqueSlug("Post", new Set(), 0), RangeError);
  assert.throws(() => uniqueSlug("Post", new Set(["po"]), 2), RangeError);
});

test("turns a heading into an anchor id", () => {
  assert.equal(anchorId("Getting Started"), "getting-started");
  assert.equal(anchorId("  snake_case -- name  "), "snake-case-name");
  assert.equal(anchorId("--a--"), "a");
});

test("trims whitespace from both ends of a title", () => {
  assert.equal(trimTitle("  Hello World \n"), "Hello World");
  assert.equal(trimTitle("Hello"), "Hello");
});
