import { DEFAULT_PER_PAGE } from "./defaults.js";

/**
 * Splits a list into pages. Pages are numbered from 1.
 *
 * @template T
 * @param {readonly T[]} items
 * @param {{ page?: number, perPage?: number }} [options]
 * @returns {{ items: T[], page: number, totalPages: number, hasNext: boolean }}
 */
export const paginate = (items, { page = 1, perPage = DEFAULT_PER_PAGE } = {}) => {
  if (!Number.isInteger(perPage) || perPage < 1) {
    throw new RangeError("perPage must be a positive integer");
  }

  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const current = Math.min(Math.max(1, Math.trunc(page) || 1), totalPages);
  const start = (current - 1) * perPage;

  return {
    hasNext: current < totalPages,
    items: items.slice(start, start + perPage),
    page: current,
    totalPages,
  };
};
