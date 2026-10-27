// Fails when an exported value in src/ has no JSDoc comment directly above it.
import { readdirSync, readFileSync } from "node:fs";

const EXPORT = /^export const (\w+)/u;
const missing = [];

for (const file of readdirSync("src").filter((name) => name.endsWith(".js"))) {
  const lines = readFileSync(`src/${file}`, "utf8").split("\n");

  for (const [index, line] of lines.entries()) {
    const name = EXPORT.exec(line)?.[1];

    if (name && !lines[index - 1]?.trimEnd().endsWith("*/")) {
      missing.push(`src/${file}:${index + 1}: \`${name}\` has no JSDoc comment`);
    }
  }
}

if (missing.length > 0) {
  console.error(`Every export needs a JSDoc comment:\n${missing.join("\n")}`);
  process.exit(1);
}
