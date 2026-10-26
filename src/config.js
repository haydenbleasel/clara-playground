import merge from "lodash/merge.js";

const DEFAULTS = {
  pagination: { perPage: 20 },
  retry: { attempts: 3, baseDelay: 100, maxDelay: 2000 },
};

/** The defaults, deeply merged with `overrides`. */
export const loadConfig = (overrides = {}) => merge({}, DEFAULTS, overrides);
