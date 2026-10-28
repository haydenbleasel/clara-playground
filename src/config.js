import { readFileSync } from "node:fs";

import { parse } from "ini";
import merge from "lodash/merge.js";

const DEFAULTS = {
  pagination: { perPage: 20 },
  retry: { attempts: 3, baseDelay: 100, maxDelay: 2000 },
};

/** The defaults, deeply merged with `overrides`. */
export const loadConfig = (overrides = {}) => merge({}, DEFAULTS, overrides);

/** The defaults, deeply merged with the sections of the INI file at `path`. */
export const loadConfigFile = (path) =>
  loadConfig(parse(readFileSync(path, "utf8")));
