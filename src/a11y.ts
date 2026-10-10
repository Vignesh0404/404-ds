// The accessibility contract for the whole family: one settings shape, one
// storage key, one way of applying it. This replaces three copies of
// src/lib/a11y.ts that had drifted into two shapes under three keys.
//
// Settings are written to localStorage and, on the404labs.co and its
// subdomains, mirrored to a cookie scoped to the parent domain — localStorage
// is per-origin, so without the cookie someone who turns on the dyslexia font
// on the studio site would have to do it again on the shop and again on games.
//
// NOTE for any site adopting this: the mirror is a real, first-party
// preference cookie. A site whose privacy or cookie page says it sets none
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

/**
 * The stored object as written, before normalising — so a site can keep its
 * own extra keys next to the shared ones (404games stores `keyboardKick` and
 * `audioCues` here) and read them back. Pass the result to
 * normalizeA11ySettings for the shared part.
 *
 * Order: the cross-site cookie (the most recent choice made on any of the
 * three sites), then this origin's localStorage, then this origin's old key.
 */
export function readStoredA11y(): Record<string, unknown> {
  try {
    const stored = parse(readCookie()) ?? parse(localStorage.getItem(A11Y_STORAGE_KEY));
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

const onFamilyDomain = () => {
  const host = location.hostname;
  return host === A11Y_COOKIE_DOMAIN || host.endsWith(`.${A11Y_COOKIE_DOMAIN}`);
};

/**
 * Removes everything saved: the shared record, this origin's old key (which
 * readStoredA11y would otherwise fall back to, undoing the reset), and the
 * cross-site cookie.
 */
export function clearStoredA11y() {
  try {
    localStorage.removeItem(A11Y_STORAGE_KEY);
    for (const key of A11Y_LEGACY_KEYS) localStorage.removeItem(key);
  } catch {
    // Storage blocked — nothing was saved in the first place.
  }
  if (onFamilyDomain()) {
    document.cookie = `${A11Y_STORAGE_KEY}=; domain=.${A11Y_COOKIE_DOMAIN}; path=/; max-age=0; samesite=lax; secure`;
  }
}

export function writeStoredA11y(value: Record<string, unknown>) {
  const json = JSON.stringify(value);
  try {
    localStorage.setItem(A11Y_STORAGE_KEY, json);
  } catch {
    // Same as above: a blocked write just means the setting lasts the session.
  }
  // Only on the real domain: on localhost or a Vercel preview URL there is no
  // sibling site to share with, and a Domain= that doesn't match the host
  // would be rejected by the browser anyway.
  if (onFamilyDomain()) {
    document.cookie =
      `${A11Y_STORAGE_KEY}=${encodeURIComponent(json)}; domain=.${A11Y_COOKIE_DOMAIN}; path=/; ` +
      `max-age=31536000; samesite=lax; secure`;
  }
}
