/**
 * Creates an in-memory cache whose entries expire `ttl` milliseconds after they're set.
 * `has`, `get`, and `size` only ever see entries that haven't expired.
 * Expired entries are evicted when they're read, on every `set`, and when `size` is read.
 *
 * @template T
 * @param {{ ttl?: number, now?: () => number }} [options]
 */
export const createCache = ({ ttl = 60_000, now = Date.now } = {}) => {
  /** @type {Map<string, { value: T, expires: number }>} */
  const entries = new Map();
  /** @type {Map<string, Promise<T>>} */
  const pending = new Map();

  /**
   * Returns the entry for `key` if it hasn't expired, deleting it if it has.
   *
   * @param {string} key
   */
  const live = (key) => {
    const entry = entries.get(key);

    if (!entry) {
      return undefined;
    }

    if (now() >= entry.expires) {
      entries.delete(key);
      return undefined;
    }

    return entry;
  };

  /**
   * Deletes the entries that have expired by `time`. Every entry has the same ttl and `set`
   * re-inserts its key at the end, so `entries` is in expiry order and the sweep stops at the
   * first entry that's still live.
   *
   * @param {number} time
   */
  const sweep = (time) => {
    for (const [key, entry] of entries) {
      if (time < entry.expires) {
        break;
      }

      entries.delete(key);
    }
  };

  const cache = {
    /** @param {string} key */
    get(key) {
      return live(key)?.value;
    },

    /** @param {string} key */
    has(key) {
      return live(key) !== undefined;
    },

    /**
     * @param {string} key
     * @param {T} value
     */
    set(key, value) {
      const time = now();

      sweep(time);
      entries.delete(key);
      entries.set(key, { expires: time + ttl, value });
    },

    /**
     * Returns the cached value, or computes, caches, and returns it.
     * Concurrent calls for the same key share one computation.
     *
     * @param {string} key
     * @param {() => Promise<T>} compute
     */
    async getOrSet(key, compute) {
      const entry = live(key);

      if (entry) {
        return entry.value;
      }

      const inFlight = pending.get(key);

      if (inFlight) {
        return inFlight;
      }

      const promise = (async () => {
        const value = await compute();
        cache.set(key, value);
        return value;
      })();

      pending.set(key, promise);

      try {
        return await promise;
      } finally {
        pending.delete(key);
      }
    },

    get size() {
      sweep(now());
      return entries.size;
    },
  };

  return cache;
};
