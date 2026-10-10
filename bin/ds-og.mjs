#!/usr/bin/env node
// Copies a site's social card from the design system into its public folder.
//
//   "og": "ds-og 404shop"      →  public/og-image.png
//
// The three cards are rendered in one place, from one template (og/cards.json
// and scripts/build-og.mjs in the design system), instead of each site
// keeping its own near-identical HTML file and rendering it by hand. To
// change a card's wording, change cards.json there, run `npm run build:og`,
// release, then run this.
import { copyFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const site = process.argv[2];
const source = fileURLToPath(new URL(`../assets/og-${site}.png`, import.meta.url));
if (!site || !existsSync(source)) {
  console.error(`ds-og: no card for "${site ?? ""}". Usage: ds-og the404labs | 404shop | 404games`);
  process.exit(1);
}
copyFileSync(source, "public/og-image.png");
console.log(`ds-og: public/og-image.png ← ${site}`);
