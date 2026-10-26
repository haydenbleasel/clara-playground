const sleep = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

/**
 * Calls `task` until it succeeds, waiting longer after each failure. The wait doubles from
 * `baseDelay` and never exceeds `maxDelay`. A random jitter of up to half the wait spreads out
 * retries from many callers. Errors with `retryable: false` are thrown straight away.
 *
 * @template T
 * @param {(attempt: number) => Promise<T>} task
 * @param {{ attempts?: number, baseDelay?: number, maxDelay?: number, random?: () => number, wait?: (ms: number) => Promise<void> }} [options]
 * @returns {Promise<T>}
 */
export const retry = async (
  task,
  { attempts = 3, baseDelay = 100, maxDelay = 2000, random = Math.random, wait = sleep } = {}
) => {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await task(attempt);
    } catch (error) {
      lastError = error;

      if (error?.retryable === false || attempt === attempts) {
        break;
      }

      const delay = Math.min(maxDelay, baseDelay * 2 ** (attempt - 1));
      await wait(delay / 2 + random() * (delay / 2));
    }
  }

  throw lastError;
};
