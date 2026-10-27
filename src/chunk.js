/**
 * Splits a list into groups of `size`. The last group holds whatever is left
 * over, so it is never empty. An empty list returns no groups.
 *
 * @template T
 * @param {readonly T[]} items
 * @param {number} size A positive integer.
 * @returns {T[][]}
 * @throws {TypeError} If `items` is not an array.
 * @throws {RangeError} If `size` is not a positive integer.
 */
export const chunk = (items, size) => {
  if (!Array.isArray(items)) {
    throw new TypeError("items must be an array");
  }

  if (!Number.isInteger(size) || size < 1) {
    throw new RangeError("size must be a positive integer");
  }

  const groups = [];

  for (let start = 0; start < items.length; start += size) {
    groups.push(items.slice(start, start + size));
  }

  return groups;
};
