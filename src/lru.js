/**
 * Creates a least-recently-used cache that holds at most `capacity` entries. Reading or writing a
 * key makes it the most recently used, and when the cache is full, adding a new key evicts the
 * least recently used one. Throws a `RangeError` unless `capacity` is a positive integer.
 *
 * @template T
 * @param {number} capacity
 */
export const createLru = (capacity) => {
  if (!Number.isInteger(capacity) || capacity < 1) {
    throw new RangeError("capacity must be a positive integer");
  }

  /** @type {Map<string, T>} */
  const entries = new Map();

  return {
    /** @param {string} key */
    get(key) {
      const value = entries.get(key);

      if (value === undefined && !entries.has(key)) {
        return undefined;
      }

      entries.delete(key);
      entries.set(key, value);
      return value;
    },

    /**
     * @param {string} key
     * @param {T} value
     */
    set(key, value) {
      if (entries.has(key)) {
        entries.delete(key);
      } else if (entries.size >= capacity) {
        const oldest = entries.keys().next().value;
        entries.delete(oldest);
      }

      entries.set(key, value);
    },

    /** The keys, least recently used first. */
    keys() {
      return [...entries.keys()];
    },

    get size() {
      return entries.size;
    },
  };
};
