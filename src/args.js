import minimist from "minimist";

/** Parses command-line flags for the preview server. */
export const parseArgs = (argv = process.argv.slice(2)) =>
  minimist(argv, { default: { port: 3000 }, string: ["dir"] });
