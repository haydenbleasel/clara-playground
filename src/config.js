import merge from "lodash/merge.js";

import { DEFAULT_PER_PAGE } from "./defaults.js";

const DEFAULTS = {
  pagination: { perPage: DEFAULT_PER_PAGE },
  retry: { attempts: 3, baseDelay: 100, maxDelay: 2000 },
};

/** The defaults, deeply merged with `overrides`. */
export const loadConfig = (overrides = {}) => merge({}, DEFAULTS, overrides);
