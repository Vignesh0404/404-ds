# @the404labs/ds

The design system shared by [the404labs.co](https://the404labs.co), 404shop and 404games. One set of tokens, one base stylesheet, one accessibility contract.

Brand rules and how to use the tokens: [DESIGN.md](DESIGN.md). How the sites talk: [CONTENT.md](CONTENT.md).

## Install

```sh
npm install github:Vignesh0404/404-ds#v0.6.1
```

npm 12 refuses git dependencies unless a project opts in. Each site needs this line in an `.npmrc` at its root, committed:

```ini
allow-git=root
```

The package is built when npm fetches it, so there is nothing to publish. npm prints a warning that the package's `prepare` script was blocked for the installed copy; that is expected and harmless, because `dist/` is already there.

To move a site to the newest version, run `npm run ds:update` in it (the script is `ds-update`, from this package). It looks up the latest tag and runs:

```sh
npm install --allow-git=all github:Vignesh0404/404-ds#vX.Y.Z
```

The wider setting is needed for that one command. With `allow-git=root`, npm installs from the lockfile without complaint (which is all a deploy does) but refuses to change a git dependency that is already locked. Keep `root` in the committed `.npmrc`; don't widen it there.

There is no automatic update pull request. Dependabot and similar tools don't follow a git dependency pinned to a tag the way they follow a registry package, so the update is a deliberate command. Publishing this package to npm would change that.

## Use

A Tailwind v4 site (the404labs, 404shop), in `src/index.css`:

```css
@import "tailwindcss";
@import "@the404labs/ds/theme.css";
@import "@the404labs/ds/base.css";
```

A plain-CSS site (404games):

```css
@import "@the404labs/ds/tokens.css";
@import "@the404labs/ds/base.css";
```

Import `theme.css` or `tokens.css`, never both. They carry the same values in two shapes.

Then the components, in either kind of site, after the lines above:

```css
@import "@the404labs/ds/components.css";
```

```tsx
import { Button, IconButton, Sheet, Segmented, Switch, Input, Label } from "@the404labs/ds";

<Button tone="cream" onClick={sayHello}>Say hello</Button>
<Button as={Link} to="/cart" tone="yellow" block>Checkout</Button>
<Sheet open={open} onClose={close} title="Your cart" closeLabel="Close cart" tone="green">…</Sheet>
```

In `vite.config.ts`, add the plugin that applies saved accessibility settings before first paint:

```ts
import { ds404 } from "@the404labs/ds/vite";

export default defineConfig({ plugins: [react(), ds404()] });
```

Then delete from the site: the token block, the `@font-face` rules and the `data-a11y-*` rules in `index.css`; the Google Fonts links and the inline a11y script in `index.html`; `public/fonts/OpenDyslexic`; and `src/lib/a11y.ts` (import from `@the404labs/ds` instead).

The shared a11y settings are mirrored to a first-party cookie on `.the404labs.co` so they follow a visitor across the three sites. A site whose privacy or cookie page says it sets no cookies must update that copy when it adopts this.

## What's in it

| Import | Contents |
| --- | --- |
| `@the404labs/ds/tokens.css` | Every token as a `:root` variable, plus the tone sets. |
| `@the404labs/ds/theme.css` | The same, as a Tailwind v4 `@theme`. |
| `@the404labs/ds/base.css` | Fonts, page defaults, the focus ring, all `data-a11y-*` rules. |
| `@the404labs/ds/fonts.css` | Fonts only (already included by `base.css`). |
| `@the404labs/ds/components.css` | Styles for the components. |
| `@the404labs/ds` | `normalizeA11ySettings`, `applyA11yToDocument`, `readStoredA11y`, `writeStoredA11y`, `fluidPx`. |
| `@the404labs/ds/vite` | `ds404()` Vite plugin. |
| `@the404labs/ds/tokens.json` | Tokens in Design Tokens (DTCG) format. |
| `@the404labs/ds/tones.json` | The derived tone values. |

### Accessibility

Wrap the app in the provider once, then put the button and the panel wherever the site's controls live:

```tsx
import { A11yButton, A11yPanel, A11yProvider } from "@the404labs/ds";

<A11yProvider>…</A11yProvider>

<A11yButton aria-expanded={open} onClick={() => setOpen(true)} />
<A11yPanel open={open} onClose={() => setOpen(false)} />
```

A site with its own switches declares them on the provider (`extras={{ keyboardKick: false }}`), reads them from `useA11y().extras`, and renders them as children of the panel using `A11ySection` and `A11yToggle`. `features` turns off sections that don't apply.

### Header, footer, logo

```tsx
import { SiteFooter, SiteHeader, Wordmark } from "@the404labs/ds";

<SiteHeader site="404shop" tone="paper" homeAs={Link} homeProps={{ to: "/" }} controls={<><A11yWidget /><CartButton /></>} />
<SiteFooter site="404shop">
  <Link to="/faq">FAQ</Link>
</SiteFooter>
```

`tone` on the header is the tone of the page beneath it. Pages whose content starts at the top pad by `var(--ds-header-height)`. The logo files for use outside React are in `@the404labs/ds/assets/`.

## Tools for a site

| Script in the site | Runs | Does |
| --- | --- | --- |
| `"lint": "oxlint && ds-lint"` | `ds-lint` | Fails on raw colours, opacity text colours, named typefaces and removed focus rings in `src/`. |
| `"ds:update": "ds-update"` | `ds-update` | Moves the site to the newest tagged version. |
| `"og": "ds-og 404shop"` | `ds-og` | Copies the site's social card to `public/og-image.png`. |

Copy `skill/SKILL.md` to `.claude/skills/404-ds/SKILL.md` in the site so AI agents working there follow the system.

## Work on it

```sh
npm install
npm run dev     # preview page at http://127.0.0.1:5180
npm run build   # tokens → contrast test → TypeScript
npm run lint
npm run build:wordmarks   # regenerate the logo drawings (outputs are committed)
npm run build:og          # re-render the social cards (needs Edge or Chrome; outputs are committed)
```

To change a value, edit `tokens/tokens.json`. Everything in `dist/` is generated. The build fails if any tone drops below WCAG AA.

To try a change in a site before tagging, run `npm install ../404-ds` in that site. Don't commit the resulting `file:` dependency: Vercel can't resolve it.

## Release

1. Add an entry to `CHANGELOG.md` and bump `version` in `package.json`.
2. Commit, then `git tag v0.x.y && git push --tags`.
3. In each site, point the dependency at the new tag.

Version rules: a patch changes no pixels; a minor adds tokens or components, or changes a value visibly; a major renames or removes something.
