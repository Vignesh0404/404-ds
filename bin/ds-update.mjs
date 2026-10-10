#!/usr/bin/env node
// Moves a site to the newest tagged version of the design system.
//
//   npm run ds:update        ("ds:update": "ds-update")
//
// It exists because the bump has a catch: with the committed `allow-git=root`,
// npm installs from the lockfile happily but refuses to change a git
// dependency that is already locked. The fix is a wider setting for that one
// command, which is easy to forget and is all this script adds.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const REPO = "Vignesh0404/404-ds";
const run = (cmd, args, opts = {}) => execFileSync(cmd, args, { encoding: "utf8", shell: process.platform === "win32", ...opts });

const tags = run("git", ["ls-remote", "--tags", "--refs", `https://github.com/${REPO}.git`])
  .split("\n")
  .map((line) => line.split("refs/tags/")[1])
  .filter((tag) => /^v\d+\.\d+\.\d+$/.test(tag ?? ""))
  .sort((a, b) => {
    const [x, y] = [a, b].map((t) => t.slice(1).split(".").map(Number));
    return x[0] - y[0] || x[1] - y[1] || x[2] - y[2];
  });

const latest = tags.at(-1);
if (!latest) {
  console.error(`ds-update: no version tags found on ${REPO}`);
  process.exit(1);
}

const current = JSON.parse(readFileSync("package.json", "utf8")).dependencies?.["@the404labs/ds"] ?? "";
if (current.endsWith(`#${latest}`)) {
  console.log(`ds-update: already on ${latest}`);
  process.exit(0);
}

console.log(`ds-update: ${current.split("#")[1] ?? "(none)"} → ${latest}`);
run("npm", ["install", "--allow-git=all", `github:${REPO}#${latest}`], { stdio: "inherit" });
console.log(`\nds-update: now on ${latest}. Read the design system's CHANGELOG.md for what changed, then build and look at the site before committing.`);
