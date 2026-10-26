import { execFile } from "node:child_process";
import { createServer } from "node:http";
import { parse } from "node:url";

// A local preview server. GET /?dir=src lists that directory.
const port = Number(process.env.PORT ?? 3000);

createServer((request, response) => {
  const { dir = "." } = parse(request.url ?? "/", true).query;

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
