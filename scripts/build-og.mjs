// Renders the three social cards (1200×630) from og/cards.json into
// assets/og-<site>.png. Run with: npm run build:og. The outputs are
// committed; this is not part of the normal build.
//
// One template for the family. The sites each had their own copy of this as
// an HTML file, differing only in the words (and, by accident, in the title's
// size), and rendered it by hand.
//
// Colours come from the tokens and the fonts from the same files the sites
// serve, read from disk — so nothing is fetched, and a card can't be captured
// with a fallback font because a font request was slow.
import { readFileSync, writeFileSync, rmSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { join } from "node:path";
import { chromium } from "playwright-core";
import { ROOT, loadTokens } from "./lib.mjs";

const cards = JSON.parse(readFileSync(join(ROOT, "og", "cards.json"), "utf8"));
const color = Object.fromEntries(Object.entries(loadTokens().color).filter(([k]) => !k.startsWith("$")).map(([k, t]) => [k, t.$value]));
const font = (pkg, file) => pathToFileURL(join(ROOT, "node_modules", "@fontsource", pkg, "files", file)).href;
const escape = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

const html = ({ title, line, url }) => `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<style>
  @font-face { font-family: "Tilt Warp"; src: url("${font("tilt-warp", "tilt-warp-latin-400-normal.woff2")}") format("woff2"); }
  @font-face { font-family: "Lilita One"; src: url("${font("lilita-one", "lilita-one-latin-400-normal.woff2")}") format("woff2"); }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body {
    display: flex; flex-direction: column; align-items: flex-start; justify-content: center; gap: 24px;
    padding: 90px; background: ${color.red};
  }
  h1 { font-family: "Tilt Warp"; font-weight: 400; color: ${color.yellow}; font-size: 104px; line-height: 0.95; letter-spacing: -0.04em; }
  p { font-family: "Lilita One"; color: ${color["yellow-pale"]}; font-size: 32px; max-width: 820px; line-height: 1.35; }
  span { display: inline-flex; margin-top: 8px; padding: 12px 28px; border-radius: 9999px; background: ${color.cream}; color: ${color.ink}; font-family: "Lilita One"; font-size: 24px; }
</style>
</head>
<body>
  <h1>${escape(title)}</h1>
  <p>${escape(line)}</p>
  <span>${escape(url)}</span>
</body>
</html>`;

// Uses a browser already on the machine; nothing is downloaded.
let browser;
for (const channel of ["msedge", "chrome"]) {
  try {
    browser = await chromium.launch({ channel });
    break;
  } catch {
    // try the next one
  }
}
if (!browser) {
  console.error("build-og: needs Microsoft Edge or Google Chrome installed");
  process.exit(1);
}

const tmp = join(ROOT, ".og-card.html");
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
for (const [site, card] of Object.entries(cards)) {
  writeFileSync(tmp, html(card));
  await page.goto(pathToFileURL(tmp).href);
  await page.evaluate(() => document.fonts.ready);
  const loaded = await page.evaluate(() => [...document.fonts].filter((f) => f.status === "loaded").length);
  if (loaded !== 2) {
    console.error(`build-og: ${site}: expected 2 fonts loaded, got ${loaded}`);
    process.exit(1);
  }
  await page.screenshot({ path: join(ROOT, "assets", `og-${site}.png`) });
  console.log(`assets/og-${site}.png`);
}
await browser.close();
rmSync(tmp);
