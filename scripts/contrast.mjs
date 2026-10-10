// Fails (exit 1) if any tone's pairs fall below WCAG AA. Runs as part of
// `npm run build`, so a token change that breaks contrast can't be tagged.
import { loadTokens, deriveTones, contrast, AA_TEXT, AA_UI } from "./lib.mjs";

const tones = deriveTones(loadTokens());
const rows = [];
let failed = 0;

function check(tone, label, fg, bg, min) {
  const ratio = contrast(fg, bg);
  const ok = ratio >= min;
  if (!ok) failed++;
  rows.push({ tone, pair: label, ratio: ratio.toFixed(2), needs: min, result: ok ? "pass" : "FAIL" });
}

for (const [name, t] of Object.entries(tones)) {
  check(name, "fg on bg", t.fg, t.bg, AA_TEXT);
  check(name, "fg-muted on bg", t["fg-muted"], t.bg, AA_TEXT);
  check(name, "fg on bg-hover", t.fg, t["bg-hover"], AA_TEXT);
  // Accent is for display type, icons and UI marks — never body copy — so it
  // is held to the large-text / UI line.
  check(name, "accent on bg", t.accent, t.bg, AA_UI);
  check(name, "focus on bg", t.focus, t.bg, AA_UI);
}

console.table(rows);
if (failed > 0) {
  console.error(`\ncontrast: ${failed} pair(s) below WCAG AA`);
  process.exit(1);
}
console.log(`contrast: ${rows.length} pairs pass WCAG AA`);
