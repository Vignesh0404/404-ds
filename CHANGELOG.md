# Changelog

## 0.6.1

- Fix: a reset made on one site did not hold on the site where the setting was first made. Each site kept its own local copy of the record next to the shared cookie, and fell back to it once the cookie was gone. On the404labs.co and its subdomains the cookie is now the only copy, and a site's old per-site record is removed once it has been carried into the cookie. Elsewhere (localhost, preview URLs) the record stays in local storage as before. Found by testing the live sites after release; the earlier simulated test only ever reset on the site that had made the change.

## 0.6.0

The guardrails.

- `ds-lint`: a check for a site's `npm run lint`. Fails on raw colours, text colours made from an opacity, typefaces named directly, and removed focus rings.
- `ds-update`: moves a site to the newest tag, including the `--allow-git=all` the bump needs.
- Social cards: one template and `og/cards.json`, rendered by `npm run build:og` into `assets/og-*.png`; `ds-og <site>` copies one into a site. The fonts and colours are read from this package, so nothing is fetched while rendering. The shop's card title now ends in an underscore like the other two (it ended in a full stop).
- `skill/SKILL.md`: instructions for AI agents working in any of the repos.
- CI: build (tokens, contrast test, types) and lint on every push and pull request.

## 0.5.0

The logo and the shared page chrome.

- `Wordmark` (`the404labs`, `404shop`, `404games`) and `Badge`: outlined drawings, generated from Lilita One by `npm run build:wordmarks`. Standalone files in `assets/` (`@the404labs/ds/assets/badge.svg`, `wordmark-*.svg`) for favicons and social cards.
- `SiteHeader`: transparent, takes the page's tone, fills once scrolled. Links to the three sites on the left, wordmark in the centre, controls on the right; below 768px a menu button opens a panel from the left.
- `SiteFooter`: on ink; wordmark, the three sites, social links, contact, a row for the site's own links.
- `Sheet` gains `side="left"` and accepts any tone.
- `--ds-header-height` for pages to pad by.

## 0.4.0

The accessibility panel and its settings, shared.

- `A11yProvider` / `useA11y`: one provider for the family. Settings are saved under one key and, on the404labs.co and its subdomains, mirrored to a first-party cookie so they follow a visitor across the three sites. A site that adopts this must say so on its privacy and cookie pages.
- `extras` on the provider: a site's own on/off settings, stored and reset with the shared ones.
- `A11yPanel`, `A11yButton`, and the `A11ySection` / `A11yToggle` building blocks. `features` hides sections that don't apply to a site; children add site-specific sections.
- The page reader moves here from the404labs.co.
- With no saved motion setting, reduced motion now follows the operating system on every site (404games already did this). The pre-paint script does the same.

## 0.3.0

Shared components. Import `@the404labs/ds/components.css` once, then the components from `@the404labs/ds`. React 19 is now a peer dependency.

- `Button`: one variant per tone plus `ghost`; `size="sm"`, `block`; `as` renders it as a link or a router's `Link`.
- `IconButton`: 40px round button, `label` required.
- `Sheet`: 404games' implementation (it had the focus fix and `onCloseAutoFocus`), with any dark tone.
- `Segmented`, `Switch`, `Input`, `Textarea`, `Label`, `Eyebrow`; classes `ds-field` and `ds-label` for markup that can't use the components.
- Hover styles apply only where a pointer can hover, so a tapped button doesn't stay flipped on a phone.
- The chosen segmented option and the switch read the tone (surface flipped; accent track), replacing hard-coded yellow and green.

## 0.2.0

- Tone utilities for Tailwind sites, in `theme.css`: `bg-tone`, `text-on-tone`, `text-on-tone-muted`, `text-tone-accent`, `bg-tone-hover`, `border-tone-border`, `border-tone-border-strong`, `bg-tone-field`, `outline-tone-focus`. Each follows the nearest `data-tone`. `bg-on-tone` with `text-tone` is the button flip.
- `--tone-field` now moves away from the text colour (darker on dark tones) instead of toward it. The old direction looked like a field but dropped cream text on a green sheet to 4.38:1 and muted text to 3.84:1.
- Muted text is derived to pass on the surface, its hover fill and a field, not the surface alone. The contrast test grew from 50 to 80 pairs to cover those.
- Button rule: the outline takes the surrounding surface's text colour, so it stays visible in both states of the flip.

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
