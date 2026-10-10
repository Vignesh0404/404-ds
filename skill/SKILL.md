---
name: 404-ds
description: How to build or change UI on the404labs.co, 404shop and 404games. Use before writing or editing any component, page, stylesheet, colour, font, button, form field, sheet, header, footer, logo or social card in these repos, and whenever a task mentions the design system, brand, tones, tokens or accessibility settings.
---

# the404labs design system

The three sites (`the404labs`, `404shop`, `404games`) share one design system, the package `@the404labs/ds` (repo `Vignesh0404/404-ds`). They used to share a look by copying code between repos; the copies drifted and several failed contrast. The rule that prevents that:

**If the design system has it, import it. If it doesn't, add it there first. Never copy it, and never write a one-off.**

Read `node_modules/@the404labs/ds/DESIGN.md` before designing anything. It is the brand standard and wins over anything in a site's own notes.

## Before you write UI

1. Look for an existing component: `Button`, `IconButton`, `Sheet`, `Segmented`, `Switch`, `Input`, `Textarea`, `Label`, `Eyebrow`, `A11yProvider`, `A11yPanel`, `A11yButton`, `A11ySection`, `A11yToggle`, `SiteHeader`, `SiteFooter`, `Wordmark`, `Badge`. All from `@the404labs/ds`.
2. If markup can't use the React component, use its class: `ds-button`, `ds-icon-button`, `ds-field`, `ds-label`, `ds-switch`, `ds-segmented`.
3. Decide what surface the thing sits on, and make sure an ancestor carries `data-tone` for it.

## Colour

- A surface declares its tone: `data-tone="paper | cream | yellow | purple-light | red | green | blue | brown | purple | ink"`.
- Inside it, use only the tone's values. CSS: `var(--tone-bg)`, `--tone-fg`, `--tone-fg-muted`, `--tone-accent`, `--tone-bg-hover`, `--tone-border`, `--tone-border-strong`, `--tone-field`, `--tone-focus`. Tailwind (studio and shop): `bg-tone`, `text-on-tone`, `text-on-tone-muted`, `text-tone-accent`, `bg-tone-hover`, `border-tone-border`, `border-tone-border-strong`, `bg-tone-field`.
- Never write a hex, `rgb()` or `hsl()` in UI code. For a translucent overlay use `color-mix(in srgb, var(--color-ink) 40%, transparent)`.
- Never make a text colour from an opacity (`text-cream/60`, `rgba(…, 0.6)`). Use the tone's muted colour. Fixed opacities pass contrast on some surfaces and fail on others.
- A screen is one tone edge to edge; change tone only at a full-width section boundary.
- Game art drawn on a canvas (`404games/src/games/`, `src/game/`) is exempt from all of this.

## Type

- `var(--font-display)` (Tilt Warp) for headlines and scores, `var(--font-brand)` (Lilita One) for buttons, labels and prices, `var(--font-body)` (Inter) for everything else.
- Never name a typeface in a rule. The dyslexia-friendly font works by redefining those variables; a rule that says `"Inter"` ignores it.
- Size text in rem so the text-size setting reaches it. The exception is in-game HUD text, which multiplies by `var(--a11y-text-scale)`.

## Buttons and focus

- Buttons flip on hover and focus (fill and label trade colours). Don't add a lift, a shadow or a second hover colour.
- A button's colour is its `tone` prop. Don't put `data-tone` on a button: its outline and focus ring are drawn against the page and must read the page's tone.
- Don't remove or replace the focus ring (`outline: none`). There is one, from the system.

## Names and logo

- `the404labs`, `404shop`, `404games`: lowercase, joined, always. Never "The 404 Labs" or "404 Shop".
- The logo is the `Wordmark` or `Badge` component, or the SVGs in `@the404labs/ds/assets/`. Never set it in live text.

## Pages

- The header and footer are `SiteHeader` and `SiteFooter`. A page on a colour other than the site's default tells the header with `usePageTone("red")`.
- Content that starts at the top of a page pads by `var(--ds-header-height)`.
- Game pages in play have no shared header or footer.

## Checking your work

- `npm run lint` runs `ds-lint`, which fails on raw colours, opacity text colours, named typefaces and removed focus rings. Fix the cause; don't add `ds-lint-ignore` unless the line genuinely isn't UI, and say why in the comment.
- Check contrast and accessibility by reading computed values with the settings switched on (dyslexia font, XL text, reduced motion), not from a screenshot of the defaults. Two real bugs in this system were invisible in default screenshots.
- A change to how a shared component looks or behaves belongs in `404-ds`, released as a new tag, then `npm run ds:update` in each site.

## Changing the design system itself

- Values live in `tokens/tokens.json`; everything in `dist/` is generated. `npm run build` fails if any tone drops below WCAG AA.
- Component styles are plain CSS in `css/components.css` (`ds-` classes in `@layer components`, driven by `--tone-*`), not Tailwind, because 404games has no Tailwind.
- Add a `CHANGELOG.md` entry, bump the version, tag `vX.Y.Z`. A patch changes no pixels; a minor adds or visibly changes something; a major renames or removes.
