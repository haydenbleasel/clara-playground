/**
 * Creates an in-memory cache whose entries expire `ttl` milliseconds after they're set.
 * `has`, `get`, and `size` only ever see entries that haven't expired.
 *
 * @template T
 * @param {{ ttl?: number, now?: () => number }} [options]
 */
export const createCache = ({ ttl = 60_000, now = Date.now } = {}) => {
  /** @type {Map<string, { value: T, expires: number }>} */
  const entries = new Map();

  const cache = {
    /** @param {string} key */
    get(key) {
      const entry = entries.get(key);

      if (!entry) {
        return undefined;
      }

      if (now() > entry.expires) {
        entries.delete(key);
        return undefined;
      }

      return entry.value;
    },

    /** @param {string} key */
    has(key) {
      return entries.has(key);
    },

    /**
     * @param {string} key
     * @param {T} value
     */
    set(key, value) {
      entries.set(key, { expires: now() + ttl, value });
    },

    /**
     * Returns the cached value, or computes, caches, and returns it.
     *
     * @param {string} key
     * @param {() => Promise<T>} compute
     */
    async getOrSet(key, compute) {
      if (cache.has(key)) {
        return cache.get(key);
      }

      const value = await compute();
      cache.set(key, value);
      return value;
    },

    get size() {
      return entries.size;
    },
  };

  return cache;
};
