// Outlines the family's wordmarks from the Lilita One font file, so the logo
// is a fixed drawing and never depends on a font loading.
// Run with: npm run build:wordmarks. Its outputs are committed; this is not
// part of the normal build.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import opentype from "opentype.js";

const ds = fileURLToPath(new URL("..", import.meta.url));
const buf = readFileSync(`${ds}/node_modules/@fontsource/lilita-one/files/lilita-one-latin-400-normal.woff`);
const font = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));

const SIZE = 100;
const TRACKING = -0.025; // em — the "tracking-tight" the sites already set the wordmark with

function outline(text) {
  const path = font.getPath(text, 0, 0, SIZE, { kerning: true, letterSpacing: TRACKING });
  const box = path.getBoundingBox();
  // Shift so the drawing starts at 0,0 and round to keep the file small.
  const r = (n) => Math.round(n * 100) / 100;
  let d = "";
  for (const c of path.commands) {
    const x = (v) => r(v - box.x1);
    const y = (v) => r(v - box.y1);
    if (c.type === "M") d += `M${x(c.x)} ${y(c.y)}`;
    else if (c.type === "L") d += `L${x(c.x)} ${y(c.y)}`;
    else if (c.type === "C") d += `C${x(c.x1)} ${y(c.y1)} ${x(c.x2)} ${y(c.y2)} ${x(c.x)} ${y(c.y)}`;
    else if (c.type === "Q") d += `Q${x(c.x1)} ${y(c.y1)} ${x(c.x)} ${y(c.y)}`;
    else if (c.type === "Z") d += "Z";
  }
  return { d, width: r(box.x2 - box.x1), height: r(box.y2 - box.y1) };
}

const marks = Object.fromEntries(["the404labs", "404shop", "404games", "404"].map((t) => [t, outline(t)]));
for (const [name, m] of Object.entries(marks)) console.log(name.padEnd(11), `${m.width} x ${m.height}`, `${m.d.length} chars`);

writeFileSync(
  `${ds}/src/components/wordmark-paths.ts`,
  `// Generated: Lilita One, outlined, tracking ${TRACKING}em. Do not edit by hand,
// and do not set the wordmark in live text instead — a logo that depends on a
// web font renders in the fallback face whenever the font is late or blocked.
// Regenerate with opentype.js from @fontsource/lilita-one if the lettering
// ever has to change.

export type Mark = { d: string; width: number; height: number };

export const MARKS = ${JSON.stringify(marks, null, 2)} as const satisfies Record<string, Mark>;
`,
);

// Standalone files for places that can't use the React components: favicons,
// social cards, anything outside the sites.
const RED = "#9e3026";
const YELLOW = "#fad459";
const four = marks["404"];
const scale = 360 / four.width;
writeFileSync(
  `${ds}/assets/badge.svg`,
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><title>the404labs</title><circle cx="250" cy="250" r="250" fill="${RED}"/><path transform="translate(${(500 - 360) / 2} ${((500 - four.height * scale) / 2).toFixed(2)}) scale(${scale.toFixed(4)})" fill="${YELLOW}" d="${four.d}"/></svg>\n`,
);
for (const name of ["the404labs", "404shop", "404games"]) {
  const m = marks[name];
  writeFileSync(`${ds}/assets/wordmark-${name}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${m.width} ${m.height}" fill="currentColor"><title>${name}</title><path d="${m.d}"/></svg>\n`);
}
console.log("wrote assets/badge.svg and assets/wordmark-*.svg");
