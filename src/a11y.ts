// The accessibility contract for the whole family: one settings shape, one
// storage key, one way of applying it. This replaces three copies of
// src/lib/a11y.ts that had drifted into two shapes under three keys.
//
// On the404labs.co and its subdomains the settings are kept in a cookie scoped
// to the parent domain — localStorage is per-origin, so without the cookie
// someone who turns on the dyslexia font on the studio site would have to do
// it again on the shop and again on games.
//
// NOTE for any site adopting this: it is a real, first-party preference
// cookie. A site whose privacy or cookie page says it sets none
// (404shop's does) has to update that copy in the same change.

export type CursorSize = "default" | "lg" | "xl";
export type TextSize = "sm" | "md" | "lg" | "xl";

export type A11ySettings = {
  dyslexicFont: boolean;
  highlightLinks: boolean;
  cursorSize: CursorSize;
  hideImages: boolean;
  textSize: TextSize;
  readerRate: number;
  reduceMotion: boolean;
};

export const A11Y_STORAGE_KEY = "404-a11y";

// Read once, as a fallback, so nobody's saved settings are lost when a site
// moves to the shared key. Each only ever exists on its own origin.
export const A11Y_LEGACY_KEYS = ["404labs-a11y", "404shop-a11y", "keepy-uppy-a11y"] as const;

export const A11Y_COOKIE_DOMAIN = "the404labs.co";

export const DEFAULT_A11Y: A11ySettings = {
  dyslexicFont: false,
  highlightLinks: false,
  cursorSize: "default",
  hideImages: false,
  textSize: "md",
  readerRate: 1,
  reduceMotion: false,
};

export function isCursorSize(v: unknown): v is CursorSize {
  return v === "default" || v === "lg" || v === "xl";
}

export function isTextSize(v: unknown): v is TextSize {
  return v === "sm" || v === "md" || v === "lg" || v === "xl";
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function normalizeA11ySettings(raw: unknown): A11ySettings {
  const r = (raw ?? {}) as Partial<A11ySettings>;
  return {
    dyslexicFont: Boolean(r.dyslexicFont),
    highlightLinks: Boolean(r.highlightLinks),
    cursorSize: isCursorSize(r.cursorSize) ? r.cursorSize : DEFAULT_A11Y.cursorSize,
    hideImages: Boolean(r.hideImages),
    textSize: isTextSize(r.textSize) ? r.textSize : DEFAULT_A11Y.textSize,
    readerRate: Number.isFinite(r.readerRate) ? clamp(Number(r.readerRate), 0.5, 2) : DEFAULT_A11Y.readerRate,
    reduceMotion: Boolean(r.reduceMotion),
  };
}

export function applyA11yToDocument(settings: A11ySettings) {
  const root = document.documentElement;
  root.dataset.a11yFont = settings.dyslexicFont ? "dyslexic" : "default";
  root.dataset.a11yLinks = settings.highlightLinks ? "on" : "off";
  root.dataset.a11yCursor = settings.cursorSize;
  root.dataset.a11yImages = settings.hideImages ? "hide" : "show";
  root.dataset.a11yText = settings.textSize;
  root.dataset.a11yMotion = settings.reduceMotion ? "reduce" : "auto";
}

function parse(raw: string | null | undefined): Record<string, unknown> | null {
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

function readCookie(): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${A11Y_STORAGE_KEY}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

// Where the record lives depends on where the page is.
//
// On the404labs.co and its subdomains, the cookie is the only copy. It has
// to be the only one: each site's localStorage is its own, so a second copy
// there can't be reached from the other sites, and it used to bring a
// setting back on the site it was made on after a reset on another.
//
// Anywhere else (localhost, a Vercel preview URL) there is no sibling site
// and a cookie for .the404labs.co would be rejected, so localStorage it is.
const onFamilyDomain = () => {
  const host = location.hostname;
  return host === A11Y_COOKIE_DOMAIN || host.endsWith(`.${A11Y_COOKIE_DOMAIN}`);
};

const cookie = (value: string, maxAge: number) =>
  `${A11Y_STORAGE_KEY}=${value}; domain=.${A11Y_COOKIE_DOMAIN}; path=/; max-age=${maxAge}; samesite=lax; secure`;

function removeLocal(keys: readonly string[]) {
  try {
    for (const key of keys) localStorage.removeItem(key);
  } catch {
    // Storage blocked — nothing was saved there in the first place.
  }
}

/**
 * The stored object as written, before normalising — so a site can keep its
 * own extra keys next to the shared ones (404games stores `keyboardKick` and
 * `audioCues` here) and read them back. Pass the result to
 * normalizeA11ySettings for the shared part.
 *
 * Falls back to this origin's old per-site key, so a returning visitor's
 * settings from before the sites shared anything still apply.
 */
export function readStoredA11y(): Record<string, unknown> {
  try {
    const stored = onFamilyDomain() ? parse(readCookie()) : parse(localStorage.getItem(A11Y_STORAGE_KEY));
    if (stored) return stored;
    for (const key of A11Y_LEGACY_KEYS) {
      const legacy = parse(localStorage.getItem(key));
      if (legacy) return legacy;
    }
  } catch {
    // Storage blocked (private mode, site data disabled) — defaults apply.
  }
  return {};
}

/**
 * Removes everything saved here: the record and this origin's old key (which
 * readStoredA11y would otherwise fall back to, undoing the reset).
 */
export function clearStoredA11y() {
  removeLocal([A11Y_STORAGE_KEY, ...A11Y_LEGACY_KEYS]);
  if (onFamilyDomain()) document.cookie = cookie("", 0);
}

export function writeStoredA11y(value: Record<string, unknown>) {
  const json = JSON.stringify(value);
  if (onFamilyDomain()) {
    document.cookie = cookie(encodeURIComponent(json), 31536000);
    // The old per-site record has now been carried into the cookie. Left in
    // place it would resurface here after a reset made on another site. The
    // local copy of the shared record (written by versions before 0.6.1)
    // goes for the same reason.
    removeLocal([A11Y_STORAGE_KEY, ...A11Y_LEGACY_KEYS]);
    return;
  }
  try {
    localStorage.setItem(A11Y_STORAGE_KEY, json);
  } catch {
    // A blocked write just means the setting lasts the session.
  }
}
