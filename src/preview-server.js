import { execFile } from "node:child_process";
import { createServer } from "node:http";
import { parse } from "node:url";

/** The port the preview server listens on when `PORT` isn't set. */
export const DEFAULT_PORT = 3000;

export const DEFAULT_DIR = ".";

// A local preview server. GET /?dir=src lists that directory.
const port = Number(process.env.PORT ?? DEFAULT_PORT);

createServer((request, response) => {
  const { dir = DEFAULT_DIR } = parse(request.url ?? "/", true).query;

  if (typeof dir !== "string") {
    response.writeHead(400, { "content-type": "text/plain" });
    response.end("Expected a single dir parameter.\n");
    return;
  }

  // Run ls directly (no shell) and end option parsing with "--" so the
  // directory is always treated as a path, never as a command or a flag.
  execFile("ls", ["-la", "--", dir], (error, stdout, stderr) => {
    response.writeHead(error ? 500 : 200, { "content-type": "text/plain" });
    response.end(error ? stderr : stdout);
  });
}).listen(port);
