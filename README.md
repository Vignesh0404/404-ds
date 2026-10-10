# @the404labs/ds

The design system shared by [the404labs.co](https://the404labs.co), 404shop and 404games. One set of tokens, one base stylesheet, one accessibility contract.

Brand rules and how to use the tokens: [DESIGN.md](DESIGN.md).

## Install

```sh
npm install github:Vignesh0404/404-ds#v0.1.1
```

npm 12 refuses git dependencies unless a project opts in. Each site needs this line in an `.npmrc` at its root, committed:

```ini
allow-git=root
```

The package is built when npm fetches it, so there is nothing to publish. npm prints a warning that the package's `prepare` script was blocked for the installed copy; that is expected and harmless, because `dist/` is already there. To update a site, change the tag.

While this repo is private, anything that installs it (Vercel, CI) needs a GitHub token with read access to it.

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
| `@the404labs/ds` | `normalizeA11ySettings`, `applyA11yToDocument`, `readStoredA11y`, `writeStoredA11y`, `fluidPx`. |
| `@the404labs/ds/vite` | `ds404()` Vite plugin. |
| `@the404labs/ds/tokens.json` | Tokens in Design Tokens (DTCG) format. |
| `@the404labs/ds/tones.json` | The derived tone values. |

Shared React components (Button, Sheet, the accessibility panel, header, footer) arrive in later versions; see [CHANGELOG.md](CHANGELOG.md).

## Work on it

```sh
npm install
npm run dev     # preview page at http://127.0.0.1:5180
npm run build   # tokens → contrast test → TypeScript
npm run lint
```

To change a value, edit `tokens/tokens.json`. Everything in `dist/` is generated. The build fails if any tone drops below WCAG AA.

To try a change in a site before tagging, run `npm install ../404-ds` in that site. Don't commit the resulting `file:` dependency: Vercel can't resolve it.

## Release

1. Add an entry to `CHANGELOG.md` and bump `version` in `package.json`.
2. Commit, then `git tag v0.x.y && git push --tags`.
3. In each site, point the dependency at the new tag.

Version rules: a patch changes no pixels; a minor adds tokens or components, or changes a value visibly; a major renames or removes something.
