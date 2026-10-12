#!/usr/bin/env node
// Fails if a site's UI code steps outside the design system: a raw colour, a
// palette colour used directly instead of through a tone, a text colour made
// from an opacity, a typeface named directly, or a removed focus ring. Each of those is how the three sites drifted apart, or failed
// contrast, before the system existed.
//
//   "lint": "oxlint && ds-lint"
//
// Checks src/ by default (pass other directories as arguments). Paths can be
// exempted in package.json — game art drawn on a canvas is not UI:
//
//   "dsLint": { "ignore": ["src/games/", "src/game/"] }
//
// A single line can be exempted with a comment containing `ds-lint-ignore`
// on that line or the one above, which should say why.
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, sep } from "node:path";

const PALETTE = "red|red-deep|yellow|yellow-warm|yellow-pale|cream|cream-soft|cream-light|green|green-light|blue|blue-deep|brown|purple|purple-light|ink|ink-soft";

// Longest first, so `cream-soft` is not read as `cream` followed by `-soft`.
const PALETTE_LONGEST_FIRST = PALETTE.split("|").sort((a, b) => b.length - a.length).join("|");
const UTILITY = "bg|text|border(?:-[xytblrse])?|ring(?:-offset)?|fill|stroke|divide|outline|decoration|from|via|to|shadow|accent|caret";

const RULES = [
  {
    id: "raw-colour",
    test: /#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b|\b(?:rgba?|hsla?|oklch|oklab)\(/,
    why: "Use a token: var(--color-…), a --tone-* variable, or color-mix() of one.",
  },
  {
    id: "palette-colour",
    // `color-mix()` of a palette variable is the documented way to make a
    // translucent overlay, so a line that has one is left alone.
    skip: /color-mix\(/,
    test: new RegExp(`(?:^|[\\s"'\`:!\\[])(?:${UTILITY})-(?:${PALETTE_LONGEST_FIRST})(?:/\\d+)?(?![\\w-])|var\\(--color-(?:${PALETTE_LONGEST_FIRST})\\)`),
    why: "Name the surface and use its tone: data-tone on the container, then bg-tone, text-on-tone, text-on-tone-muted, text-tone-accent, border-tone-border (CSS: var(--tone-bg), var(--tone-fg), …). A palette colour used directly drifts from the tone it was meant to match.",
  },
  {
    id: "px-font-size",
    test: /font-size:\s*[\d.]+px|\btext-\[[\d.]+px\]/,
    why: "A px font size ignores the text-size setting. Use a role (text-micro, text-caption, text-body-sm, text-body; CSS var(--text-*)) or rem.",
  },
  {
    id: "numeric-z-index",
    test: /z-index:\s*(?!0\b|1\b|-1\b)\d+|(?:^|[\s"'`:!\[])z-(?:[1-9]\d*|\[)/,
    why: "Use var(--z-raised | --z-popover | --z-controls | --z-toast | --z-sheet | --z-modal). 0, 1 and -1 are fine for local stacking.",
  },
  {
    id: "px-radius",
    test: /border-radius:[^;]*(?<![\w.-])[1-9][\d.]*px|\brounded(?:-[a-z]+)?-\[/,
    why: "Use a radius token: rounded-card | panel | media | pill | control | device (CSS: var(--radius-*)).",
  },
  {
    id: "literal-duration",
    files: /\.css$/,
    test: /(?<![\w.-])(?:0?\.\d+|[1-9]\d*(?:\.\d+)?)m?s\b/,
    why: "Use var(--motion-instant | --motion-fast | --motion-sheet | --motion-drawer) with var(--motion-ease-out). A decorative loop is the exception: mark it ds-lint-ignore and say why.",
  },
  {
    id: "literal-duration",
    files: /\.tsx?$/,
    test: /\bduration-(?!0\b)(?:\d+|\[)|\bease-\[|\bdelay-\[/,
    why: "Use the motion tokens: duration-(--motion-fast), ease-(--motion-ease-reveal).",
  },
  {
    id: "px-spacing",
    files: /\.css$/,
    test: /(?:padding|margin|gap|row-gap|column-gap)(?:-[a-z]+)?:[^;]*(?<![\w.-])(?:[2-9]|[1-9]\d+)(?:\.\d+)?px/,
    why: "Use var(--space-1 … --space-6): a 4px grid in rem.",
  },
  {
    id: "arbitrary-px",
    files: /\.tsx?$/,
    test: /-\[-?[\d.]+px\]/,
    why: "An arbitrary px length escapes the scale and the text-size setting. Use a token (var(--size-*), var(--space-*)) or a Tailwind scale step.",
  },
  {
    id: "opacity-text",
    test: new RegExp(`(?:^|[\\s"'\`:])(?:placeholder:)?text-(?:${PALETTE})/\\d+`),
    why: "An opacity is not a text colour: it passes contrast on some surfaces and fails on others. Use text-on-tone-muted.",
  },
  {
    id: "named-typeface",
    files: /\.css$/,
    test: /font-family:[^;]*["'](?:Inter|Lilita One|Tilt Warp|OpenDyslexic)["']/,
    why: "Use var(--font-body | --font-brand | --font-display). A typeface named directly ignores the dyslexia-friendly font.",
  },
  {
    id: "focus-ring-removed",
    test: /\boutline:\s*(?:none|0)\b|focus(?:-visible)?:outline-none/,
    why: "Don't remove the focus ring. The system provides one; restyle it with outline-color or outline-offset if you must.",
  },
];

const cwd = process.cwd();
const pkg = existsSync(join(cwd, "package.json")) ? JSON.parse(readFileSync(join(cwd, "package.json"), "utf8")) : {};
const ignore = (pkg.dsLint?.ignore ?? []).map((p) => p.replace(/\\/g, "/"));
const roots = process.argv.slice(2).length ? process.argv.slice(2) : ["src"];

const walk = (dir) => (existsSync(dir) ? readdirSync(dir).flatMap((n) => (statSync(join(dir, n)).isDirectory() ? walk(join(dir, n)) : [join(dir, n)])) : []);

/** The line with comments blanked out, so a hex in prose or a commented-out rule isn't flagged. */
function code(line, state) {
  let out = "";
  for (let i = 0; i < line.length; i++) {
    if (state.block) {
      if (line.startsWith("*/", i)) {
        state.block = false;
        i++;
      }
      continue;
    }
    if (line.startsWith("/*", i)) {
      state.block = true;
      i++;
      continue;
    }
    // `//` starts a comment unless it is part of a URL.
    if (line.startsWith("//", i) && line[i - 1] !== ":") break;
    out += line[i];
  }
  return out;
}

const findings = [];
for (const root of roots) {
  for (const file of walk(join(cwd, root))) {
    const rel = relative(cwd, file).split(sep).join("/");
    if (!/\.(css|tsx?|jsx?)$/.test(rel) || ignore.some((p) => rel.startsWith(p))) continue;
    const lines = readFileSync(file, "utf8").split(/\r?\n/);
    const state = { block: false };
    lines.forEach((line, i) => {
      const src = code(line, state);
      if (!src.trim() || /ds-lint-ignore/.test(line) || /ds-lint-ignore/.test(lines[i - 1] ?? "")) return;
      for (const rule of RULES) {
        if (rule.files && !rule.files.test(rel)) continue;
        if (rule.skip && rule.skip.test(src)) continue;
        const match = src.match(rule.test);
        if (match) findings.push({ rel, line: i + 1, rule, text: match[0].trim() });
      }
    });
  }
}

if (findings.length === 0) {
  console.log(`ds-lint: ${roots.join(", ")} uses the design system throughout`);
  process.exit(0);
}

for (const f of findings) console.error(`${f.rel}:${f.line}  ${f.rule.id}  ${f.text}`);
console.error("");
for (const rule of new Set(findings.map((f) => f.rule))) console.error(`${rule.id}: ${rule.why}`);
console.error(`\nds-lint: ${findings.length} problem${findings.length === 1 ? "" : "s"}`);
process.exit(1);
