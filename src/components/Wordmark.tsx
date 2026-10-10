import { cx } from "./cx.js";
import { MARKS } from "./wordmark-paths.js";

export type SiteName = "the404labs" | "404shop" | "404games";

// Height of the lettering without descenders, in the paths' own units. Every
// mark is scaled against it, so "404shop" (whose p hangs below the line) and
// "the404labs" come out with letters the same size at the same font-size.
const LETTER_HEIGHT = MARKS.the404labs.height;

/**
 * The wordmark, as a drawing. It takes the text colour and is sized by
 * font-size: 1em is the height of the lettering.
 *
 *   <Wordmark name="404shop" className="text-2xl" />
 */
export function Wordmark({ name, className }: { name: SiteName; className?: string }) {
  const mark = MARKS[name];
  return (
    <svg
      role="img"
      aria-label={name}
      viewBox={`0 0 ${mark.width} ${mark.height}`}
      className={cx("ds-wordmark", className)}
      style={{ width: `${mark.width / LETTER_HEIGHT}em`, height: `${mark.height / LETTER_HEIGHT}em` }}
      fill="currentColor"
    >
      <path d={mark.d} />
    </svg>
  );
}

/** The round "404" badge. For where the wordmark won't fit. Its colours are fixed. */
export function Badge({ size = 40, className }: { size?: number; className?: string }) {
  const four = MARKS["404"];
  const scale = 360 / four.width;
  return (
    <svg role="img" aria-label="the404labs" width={size} height={size} viewBox="0 0 500 500" className={className}>
      <circle cx="250" cy="250" r="250" fill="var(--color-red)" />
      <path
        transform={`translate(70 ${(500 - four.height * scale) / 2}) scale(${scale})`}
        fill="var(--color-yellow)"
        d={four.d}
      />
    </svg>
  );
}
