// Shared by build-tokens.mjs and contrast.mjs, so the values the build emits
// and the values the contrast test checks can never be two different
// derivations of the same token.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

export const ROOT = fileURLToPath(new URL("..", import.meta.url));

export function loadTokens() {
  return JSON.parse(readFileSync(new URL("../tokens/tokens.json", import.meta.url), "utf8"));
}

const toRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const toHex = (rgb) => "#" + rgb.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");

/** `amount` of `fg` laid over `bg` — what a browser paints for fg at that opacity. */
export function mix(fg, bg, amount) {
  const f = toRgb(fg);
  const b = toRgb(bg);
  return toHex(f.map((v, i) => v * amount + b[i] * (1 - amount)));
}

function luminance(hex) {
  const [r, g, b] = toRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG 2.x contrast ratio. */
export function contrast(a, b) {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

// WCAG AA: 4.5:1 for text, 3:1 for large text and for UI parts such as focus
// rings. The derivation aims slightly above the text line so a rounding step
// in a browser's own blend can't land a pair at 4.49.
export const AA_TEXT = 4.5;
export const AA_UI = 3;
const MUTED_TARGET = 4.6;

/**
 * Expands each authored tone (bg / fg / accent / hover) into the full set of
 * variables a component reads. Everything derived is a flat, opaque hex, not
 * an opacity — so it is what gets contrast-checked, and so it can be used
 * where opacity can't be (the -webkit-autofill inset shadow, for one).
 */
export function deriveTones(tokens) {
  const color = (name) => tokens.color[name].$value;
  const out = {};

  for (const [name, tone] of Object.entries(tokens.tone)) {
    if (name.startsWith("$")) continue;
    const bg = color(tone.bg);
    const fg = color(tone.fg);
    const dark = luminance(bg) < 0.2;

    // Muted text: the quietest 5% step of fg-over-bg that still passes AA.
    // The sites used fixed opacities (cream/60, ink/50…), which pass on some
    // tones and fail on others; deriving per tone is the fix.
    let muted = fg;
    for (let a = 0.5; a < 1; a += 0.05) {
      const candidate = mix(fg, bg, a);
      if (contrast(candidate, bg) >= MUTED_TARGET) {
        muted = candidate;
        break;
      }
    }

    out[name] = {
      bg,
      fg,
      "fg-muted": muted,
      accent: color(tone.accent),
      // For surfaces that are pressable but aren't buttons (rows, tiles,
      // list items) — buttons flip fg and bg instead and need no token.
      // It darkens: lightening a dark tone (green → green-light) drops cream
      // text to 3.36:1, which is how the old button hover failed.
      "bg-hover": tone.hover ? color(tone.hover) : mix(color("ink-soft"), bg, dark ? 0.16 : 0.08),
      border: mix(fg, bg, 0.15),
      "border-strong": mix(fg, bg, 0.3),
      field: mix(fg, bg, 0.1),
      // One focus ring per tone: ink on light surfaces, yellow on dark ones.
      // Yellow on paper was 1.34:1 — an invisible ring.
      focus: dark ? color("yellow") : color("ink"),
    };
  }
  return out;
}
