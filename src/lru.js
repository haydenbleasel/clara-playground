/**
 * Creates a least-recently-used cache that holds at most `capacity` entries. Reading or writing a
 * key makes it the most recently used, and when the cache is full, adding a new key evicts the
 * least recently used one.
 *
 * @template T
 * @param {number} capacity
 */
export const createLru = (capacity) => {
  /** @type {Map<string, T>} */
  const entries = new Map();

  return {
    /** @param {string} key */
    get(key) {
      return entries.get(key);
    },

    /**
     * @param {string} key
     * @param {T} value
     */
    set(key, value) {
      if (entries.size >= capacity) {
        const newest = [...entries.keys()].at(-1);
        entries.delete(newest);
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
