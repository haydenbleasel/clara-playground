/**
 * Splits a list into groups of `size`. The last group holds whatever is left over.
 *
 * @template T
 * @param {readonly T[]} items
 * @param {number} size
 * @returns {T[][]}
 */
export const chunk = (items, size) => {
  const groups = [];

  for (let start = 0; start <= items.length; start += size) {
    groups.push(items.slice(start, start + size));
  }

  return groups;
};
