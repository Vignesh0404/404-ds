# the404labs brand and design guidelines

This is the standard for everything the404labs ships: the studio site, 404shop, 404games, social cards, and whatever comes next. If a site and this document disagree, the site is wrong.

The values themselves live in [tokens/tokens.json](tokens/tokens.json). This document explains how to use them.

## The idea

A small studio that makes friendly things and is honest about them. The look is flat colour, chunky rounded type and generous shapes: closer to a printed poster or a Sunday paper's games page than to a software dashboard. Nothing is glossy, nothing glows, nothing pretends to be glass.

Reference we like: [The Funday Press](https://thefundaypress.com/). Three things are taken from it directly: a page is one flat colour from edge to edge, buttons flip on hover, and the header has no colour of its own. Each is written up as a rule below.

## Name

| Write | Never write |
| --- | --- |
| the404labs | The 404 Labs, the 404 labs, 404Labs, 404 labs |
| 404shop | 404 Shop, 404 shop, the404shop |
| 404games | 404 Games, 404 games |

- Always lowercase, always joined, including at the start of a sentence.
- The studio is `the404labs`. The sub-brands drop "the".
- Page titles: `404shop • tech merch from the404labs`. Sub-brand first, a bullet, a plain description that ends in the studio name.
- The domain is `the404labs.co`. Write it only when you mean the address.

## Logo

There are two marks, and both live in this package as drawings: the `Wordmark` and `Badge` components, and SVG files in `assets/`. Do not redraw them or set them in live text. A logo that depends on a web font shows in the wrong typeface whenever the font is late.

- **Wordmark.** `the404labs` in Lilita One, tight tracking. Sub-brand lockups (`404shop`, `404games`) are drawn the same way.
- **Badge.** The red circle with "404" in cream and yellow. Used as the favicon and wherever the wordmark won't fit.

Rules:

- Clear space on every side equals the height of the "4".
- Minimum wordmark height is 20px on screen.
- Allowed pairs: brown on paper, brown on cream, red on paper, cream on red, cream on ink, yellow on red. Nothing else.
- Don't stretch, outline, add a shadow, tilt, or recolour it.

## Colour

Seventeen primitives. You rarely use them by name; you pick a **tone** and the tone supplies the right pairs.

| Colour | Hex | Job |
| --- | --- | --- |
| red | `#9e3026` | The brand colour. Heroes, the 404 page, social cards. |
| cream-soft | `#fcf7e8` | Paper. The default page background. |
| ink | `#161616` | Text on light surfaces. |
| cream | `#f5edd9` | Text on dark surfaces; a second light surface. |
| yellow | `#fad459` | The one accent. Highlights, headlines on dark tones. |
| green | `#3c6a48` | Interactive chrome: control buttons, sheets. |
| brown, purple, blue-deep | `#58332b`, `#502274`, `#086fab` | Section tones, one per project or panel. |
| purple-light | `#e9c0e9` | A light section tone, paired with purple text. |
| red-deep, yellow-warm, cream-light, ink-soft | | Hover steps of their parents. |
| yellow-pale, green-light, blue | | Decorative only: illustration, shapes, game art. Never behind body text. |

### Tones

A tone is a surface plus everything that goes on it. Set `data-tone` on a container and use only the `--tone-*` variables inside it.

Tones: `paper` (default, brown text), `cream` (brown text), `yellow`, `yellow-warm` (brown text), `purple-light`, `red`, `green`, `blue`, `brown`, `purple`, `ink`.

| Variable | Use |
| --- | --- |
| `--tone-bg` | The surface. |
| `--tone-fg` | Body text and icons. |
| `--tone-fg-muted` | Secondary text, placeholders, help text. |
| `--tone-accent` | Display headlines, marks, the "on" state. Large text only (24px and up) on green and blue. |
| `--tone-bg-hover` | A pressable surface under the pointer. |
| `--tone-border`, `--tone-border-strong` | Hairlines and control outlines. |
| `--tone-field` | Fill of inputs and inset cards. Slightly darker than the surface, so text on it keeps its contrast. |
| `--tone-focus` | The focus ring. |

### One tone per screen

A screen is one tone, edge to edge. The header is transparent and takes that tone; so do the buttons, the fields and the footer links inside it. This is what makes a page read as one thing.

- Change tone only at a full-bleed section boundary, never for a card floating inside another tone.
- A screen shows its tone, that tone's accent, and nothing else. A second colour needs a reason: a product's colourway, a game's pitch, an illustration.
- Each site's home opens on red, the brand colour. Reading pages (FAQ, legal, checkout) are paper.

In a Tailwind site the same values are utilities: `bg-tone`, `text-on-tone`, `text-on-tone-muted`, `text-tone-accent`, `bg-tone-hover`, `border-tone-border`, `border-tone-border-strong`, `bg-tone-field`.

Rules:

- Never pick a text colour by hand, and never use an opacity for text (`cream/60`, `ink/50`). Use `--tone-fg-muted`. Fixed opacities are why several pages failed contrast.
- One accent per screen region. Yellow highlights; it does not decorate.
- Red is for moments, not for chrome. If everything is red, nothing is.
- Adding or changing a tone means editing `tokens.json`. The build refuses any tone that fails WCAG AA.

## Type

| Family | Token | Use |
| --- | --- | --- |
| Tilt Warp | `font-display` | Headlines, product names, scores. |
| Lilita One | `font-brand` | Wordmark, buttons, labels, prices, eyebrows, footer links. |
| Inter | `font-body` | Paragraphs, form fields, anything longer than a line. |

- Display type is set tight: leading 0.95 to 1.1, tracking -0.03em to -0.04em.
- Eyebrows are Lilita One, uppercase, 0.75rem, tracking 0.08em, in `--tone-fg-muted`.
- Neither display face has a bold. Don't fake one; make it bigger.
- Size everything in rem so the text-size setting works. The one exception is in-game HUD text, which multiplies by `--a11y-text-scale`.
- Sentence case everywhere except eyebrows. No title case.

## Shape

| Token | Value | Use |
| --- | --- | --- |
| `radius-pill` | full | Anything you press: buttons, toggles, chips, icon buttons. |
| `radius-card` | 24px | Anything you read or type into: cards, panels, sheets, inputs. |
| `radius-panel` | 40px | Large content panels. |
| `radius-media` | 48px | Images and video. |

Inputs are cards, not pills. That contrast with the pill buttons beside them is deliberate.

No drop shadows as decoration. A shadow appears only on things that float above the page: sheets and toasts.

## Buttons

There is one button. It is a pill with a 2px outline, labelled in Lilita One. The outline is the text colour of the surface the button sits on, not of the button: brown on a paper page, cream on a red hero or a green sheet. That keeps the outline visible whichever way the button is flipped.

- **Hover and focus: it flips.** The fill becomes the text colour and the label becomes the surface colour, in 100ms. Nothing moves and nothing gets a shadow.
- **Press:** it settles to 98% scale.
- **Disabled:** 60% opacity, no hover.
- A button that needs to stand out takes a different tone from the page (a cream button on a red hero, a yellow one on brown). It still flips the same way.
- Icon buttons follow the same rule at 40px.

The flip is the same colour pair reversed, so it passes contrast on every tone without a special case. The old buttons lifted 2px and changed shade on hover; some of those shades failed contrast, and that treatment is retired.

## Motion

- 100ms for the button flip (`--motion-instant`). It should read as a state, not an animation.
- 150ms ease-out for other hover and colour changes (`--motion-fast`).
- 220ms ease-out for sheets, toasts and overlays (`--motion-sheet`).
- 300ms ease-out for the mobile menu (`--motion-drawer`).
- Pressable things settle to 98% scale on press. Nothing lifts.
- Pop-ins (a score, a banner) may use `--motion-ease-spring`.
- Everything stops when reduced motion is on, whether from the system setting or the a11y panel.

## Layout

- Page content is capped at 1440px; full-bleed colour sections may run to 1920px.
- Side gutters are 20px on phones, 40px on tablets, 80px on desktop.
- Colour runs edge to edge. Content sits inside the gutters.
- Layers, lowest to highest: page, raised (10), header and controls (40), toast (50), sheet (60), modal (70). Use the `--z-*` tokens.

## Page chrome

Every site has the same header and the same footer.

- **Header.** A transparent bar fixed to the top, with no colour of its own: it sits on the page's tone and uses that tone's text colour. Once the page scrolls it fills with the tone's surface so content doesn't run under it.
  - *Desktop (768px and up):* links to the three sites on the left, the site's wordmark in the centre, the controls on the right.
  - *Mobile:* a menu button on the left, the wordmark in the centre, the controls on the right. The menu slides in from the left and holds the three site links plus the site's own links.
  - The wordmark links to that site's home.
  - Controls are 40px icon buttons: the accessibility button first, then anything site-specific (cart, sound, leaderboard). On mobile, at most two controls stay in the bar; the rest move into the menu.
- **Footer.** On ink. The `the404labs` wordmark, links to all three sites with the current one marked, social links, the contact email, a row for site-specific links, and the copyright line.
- **Exception.** A game in play is a full-screen canvas: header only, no footer.

## Accessibility

Accessibility is part of the brand, not a compliance layer.

- The accessibility panel is on every page and is always the first control.
- Settings are shared: turn on the dyslexia font on one site and it is on for all three.
- Text contrast is 4.5:1 or better; large text, icons and focus rings 3:1 or better. The build tests this.
- There is one focus ring: 2px, offset 2px, in `--tone-focus`. Don't remove it and don't invent another.
- Everything works from the keyboard. Sheets trap focus, close on Escape, and return focus where it came from.

## Voice

The full standard for words is [CONTENT.md](CONTENT.md): how headlines, buttons, errors, FAQs, legal pages and social cards are written, with examples. The short version:

- Lowercase where the brand speaks (wordmark, titles, taglines). Normal sentence case in body copy.
- Short and plain. "No downloads, no sign-ups." "Free to use."
- Honest about limits. If checkout is a demo, say so on the page. Never promise what the site can't do.
- One joke per screen, at most. The name is already a joke; it doesn't need help.
- Button labels say what happens: "Add to cart", "Say hello", "Play". Never "Submit" or "Click here".
- No em dashes in anything a visitor reads, and no placeholder text in anything that ships.

## Social cards

One card per site, 1200×630, all from one template: the site's name in Tilt Warp, yellow on red; one line in Lilita One; the address in a cream pill. The words are in `og/cards.json`. Sites copy their card with `npm run og`; they don't keep their own template.

## For anyone writing code

- Install `@the404labs/ds`. Don't copy a token, a font file or a component out of it or out of another site.
- No raw colours in UI code: no hex, no `rgb()`, no opacity-modified text colours. Game art drawn on a canvas is exempt.
- Need something the system lacks? Add it here first, then use it.

## Keeping it this way

The three sites drifted once because nothing stopped them. Four things do now.

- **The contrast test.** `npm run build` in this package fails if any tone's text, muted text, accent or focus ring drops below WCAG AA. A colour change that breaks contrast cannot be released.
- **`ds-lint`.** Each site's `npm run lint` fails on a raw colour, a text colour made from an opacity, a typeface named directly, or a removed focus ring. Those four are exactly how the sites went wrong before.
- **CI.** This package and each site run their build and lint on every push and pull request.
- **The skill.** Each repo carries `.claude/skills/404-ds/SKILL.md` (the source is `skill/SKILL.md` here), which tells an AI agent to use this system and not to port or hard-code. Keep the copies identical to the source.

To move a site to a new version: `npm run ds:update`, read the changelog, build, look at the site, commit.
