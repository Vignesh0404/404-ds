import { A11Y_LEGACY_KEYS, A11Y_STORAGE_KEY } from "./a11y.js";

// The script that applies saved a11y settings to <html> before first paint,
// so a reload never flashes the default font, text size or cursor. It has to
// run before any bundle loads, which is why it is a string injected into
// index.html (by the Vite plugin in ./vite.ts) and not a module.
//
// It is a second implementation of readStoredA11y + normalizeA11ySettings +
// applyA11yToDocument from ./a11y.ts, on purpose — keep the two in step. The
// three sites each hand-maintained a copy of this in index.html (404games had
// none, and flashed); this is now the only one.
export const a11yInitScript = `(function () {
  try {
    var KEY = ${JSON.stringify(A11Y_STORAGE_KEY)};
    var LEGACY = ${JSON.stringify(A11Y_LEGACY_KEYS)};
    var read = function (raw) {
      try { var v = raw ? JSON.parse(raw) : null; return v && typeof v === "object" ? v : null; } catch (e) { return null; }
    };
    var m = document.cookie.match(new RegExp("(?:^|; )" + KEY + "=([^;]*)"));
    var parsed = read(m && decodeURIComponent(m[1])) || read(localStorage.getItem(KEY));
    for (var i = 0; !parsed && i < LEGACY.length; i++) parsed = read(localStorage.getItem(LEGACY[i]));
    parsed = parsed || {};
    var d = document.documentElement.dataset;
    d.a11yFont = parsed.dyslexicFont ? "dyslexic" : "default";
    d.a11yLinks = parsed.highlightLinks ? "on" : "off";
    d.a11yCursor = parsed.cursorSize === "lg" || parsed.cursorSize === "xl" ? parsed.cursorSize : "default";
    d.a11yImages = parsed.hideImages ? "hide" : "show";
    d.a11yText = parsed.textSize === "sm" || parsed.textSize === "lg" || parsed.textSize === "xl" ? parsed.textSize : "md";
    var motion = typeof parsed.reduceMotion === "boolean" ? parsed.reduceMotion : !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
    d.a11yMotion = motion ? "reduce" : "auto";
  } catch (e) {}
})();`;
