# Changelog

## 0.1.2

- Fix: the accessibility panel could not override tokens. Generated variables were unlayered, and `base.css` overrides some of them from `@layer base` (the dyslexia font swaps `--font-*`; the text-size setting sets `--a11y-text-scale`). A layered rule never outranks an unlayered one, so on a plain-CSS site the dyslexia font did nothing, and `--a11y-text-scale` stayed at 1 everywhere. All generated variables now sit in `@layer theme`, and `tokens.css` declares the order `theme, base`.

## 0.1.1

- `base.css` no longer sets `scrollbar-gutter` on `html`. That is layout policy and differs per site: 404games is a full-screen canvas and must not reserve a scrollbar strip.

## 0.1.0

First version. Foundations only; no site has adopted it yet.

- Tokens in DTCG format (`tokens/tokens.json`): the 16 existing colours under their existing names, plus type, radius, container, gutter, motion and z-index scales.
- New colour `blue-deep` (`#086fab`). Text does not reach AA on `blue`, so the blue tone uses this for its background.
- Ten tones (`data-tone`), each with derived muted text, hover, border, field and focus values.
- Contrast test in the build: 50 pairs, all WCAG AA.
- `tokens.css` for plain CSS and `theme.css` for Tailwind v4, generated from the same source.
- `base.css`: self-hosted Inter, Lilita One, Tilt Warp and OpenDyslexic; page defaults; one focus ring; the `data-a11y-*` rules; a single autofill override that covers every tone.
- Accessibility core: one settings shape, one storage key (`404-a11y`) with fallback to the three old keys, and a cross-site cookie on `.the404labs.co`.
- `ds404()` Vite plugin that injects the pre-paint accessibility script.
- `DESIGN.md`: brand and usage guidelines, including three rules taken from The Funday Press: one tone per screen, buttons that flip on hover, and a header with no colour of its own (centred wordmark, left-hand menu on mobile).
- Motion tokens for the button flip (100ms) and the mobile menu (300ms); `--border-control` for the 2px button outline. The old 2px hover lift is not carried over.
- Preview page (`npm run dev`).

Planned next: 0.2 moves the sites' surfaces onto tones; 0.3 onward adds shared components; 1.0 adds the wordmark, header and footer.
