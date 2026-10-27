import { DEFAULT_PER_PAGE } from "./defaults.js";

/**
 * Splits a list into pages. Pages are numbered from 1. Out-of-range pages are clamped, numeric
 * strings are read as numbers, and any other page (`NaN`, `"abc"`, `2n`) means the first page.
 *
 * @template T
 * @param {readonly T[]} items
 * @param {{ page?: number | string, perPage?: number }} [options]
 * @returns {{ items: T[], page: number, totalPages: number, hasNext: boolean }}
 */
export const paginate = (items, { page = 1, perPage = DEFAULT_PER_PAGE } = {}) => {
  if (!Number.isInteger(perPage) || perPage < 1) {
    throw new RangeError("perPage must be a positive integer");
  }

  const requested =
    typeof page === "number" || typeof page === "string" ? Math.trunc(Number(page)) : Number.NaN;
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const current = Number.isNaN(requested) ? 1 : Math.min(Math.max(1, requested), totalPages);
  const start = (current - 1) * perPage;

  return {
    hasNext: current < totalPages,
    items: items.slice(start, start + perPage),
    page: current,
    totalPages,
  };
};
